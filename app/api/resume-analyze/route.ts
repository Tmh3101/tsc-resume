import { NextRequest, NextResponse } from "next/server";
import { makeAIRequest } from "@/lib/resume-analyze/ai-helpers";
import { FeedbackSchema } from "@/lib/validations/analyze";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAISystemPrompt, prepareInstructions } from "@/constants";
import { convertPdfToMarkdown, checkPdfServiceHealth } from "@/lib/pdf-service";
import type { Feedback } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_MARKDOWN_LENGTH = 15000;
const CV_BUCKET_NAME = "cv_analyze";

// Upload CV lên Supabase Storage với auto-create bucket
async function uploadCvToStorage(
  supabase: SupabaseClient,
  buffer: Buffer,
  fileName: string
): Promise<string> {
  // Tạo tên file unique với timestamp
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${timestamp}_${sanitizedName}`;

  // Upload file
  let uploadResult = await supabase.storage
    .from(CV_BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });

  // Nếu bucket không tồn tại, tạo bucket và upload lại
  if (uploadResult.error?.message?.includes("Bucket not found") ||
      uploadResult.error?.message?.includes("bucket") ||
      uploadResult.error?.message?.includes("not found")) {
    console.log("Bucket not found, creating bucket:", CV_BUCKET_NAME);
    
    // Tạo bucket public
    const { error: createBucketError } = await supabase.storage.createBucket(
      CV_BUCKET_NAME,
      {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024, // 20MB
        allowedMimeTypes: ["application/pdf"],
      }
    );

    if (createBucketError && !createBucketError.message?.includes("already exists")) {
      console.error("Failed to create bucket:", createBucketError);
      throw new Error(`Không thể tạo bucket: ${createBucketError.message}`);
    }

    // Upload lại
    uploadResult = await supabase.storage
      .from(CV_BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });
  }

  if (uploadResult.error) {
    console.error("Upload error:", uploadResult.error);
    throw new Error(`Không thể tải lên CV: ${uploadResult.error.message}`);
  }

  // Lấy public URL
  const { data: urlData } = supabase.storage
    .from(CV_BUCKET_NAME)
    .getPublicUrl(storagePath);

  return urlData.publicUrl;
}

async function analyzeWithAI(
  markdown: string,
  jobTitle: string,
  jobDescription: string,
  companyName?: string,
): Promise<Feedback> {
  const systemPrompt = getAISystemPrompt();
  const userPrompt =
    prepareInstructions({ jobTitle, jobDescription, companyName }) +
    `\n\nResume:\n${markdown}`;

  return makeAIRequest<Feedback>({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = formData.get("jobTitle") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size must be under 20 MB" },
        { status: 400 },
      );
    }

    const isHealthy = await checkPdfServiceHealth();
    if (!isHealthy) {
      return NextResponse.json(
        {
          success: false,
          error: "PDF service unavailable. Please check NUTRIENT_API_KEY configuration.",
        },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let markdownContent: string;
    let isOcrUsed = false;
    
    try {
      const conversionResult = await convertPdfToMarkdown(buffer);
      markdownContent = conversionResult.markdown;
      isOcrUsed = conversionResult.isOcrUsed;
      
      console.log("Markdown length:", markdownContent.length, "| OCR used:", isOcrUsed);
      
      if (markdownContent.length >= MAX_MARKDOWN_LENGTH) {
        markdownContent = markdownContent.slice(0, MAX_MARKDOWN_LENGTH);
      }
    } catch (conversionError) {
      const errorMessage = conversionError instanceof Error ? conversionError.message : "Unknown error";
      
      // Handle flatten PDF / OCR fallback failure
      if (errorMessage.includes("insufficient text") || errorMessage.includes("OCR fallback failed")) {
        return NextResponse.json(
          {
            success: false,
            error: "Không thể đọc nội dung CV. File PDF có thể là dạng ảnh hoặc flatten. Vui lòng sử dụng file PDF có text có thể chọn được.",
            errorCode: "PDF_UNREADABLE"
          },
          { status: 422 }
        );
      }
      
      throw conversionError;
    }

    const feedback = await analyzeWithAI(
      markdownContent,
      jobTitle,
      jobDescription
    );

    const validation = FeedbackSchema.safeParse(feedback);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "AI returned malformed response: " + validation.error},
        { status: 500 },
      );
    }

    const supabase = createRouteHandlerClient();

    // Upload CV lên Supabase Storage
    let cvUrl: string | null = null;
    try {
      cvUrl = await uploadCvToStorage(supabase, buffer, file.name);
      console.log("CV uploaded successfully:", cvUrl);
    } catch (uploadError) {
      console.error("Failed to upload CV:", uploadError);
      // Không throw error, cho phép tiếp tục mà không có CV URL
    }

    const { data: resume, error: supabaseError } = await supabase
      .from("resume_analyze")
      .insert({
        job_title: jobTitle,
        job_description: jobDescription,
        resume_markdown: markdownContent,
        feedback: validation.data,
        resume_url: cvUrl,
      })
      .select()
      .single();

    if (supabaseError || !resume) {
      return NextResponse.json(
        { success: false, error: "Failed to save resume data" + (supabaseError ? `: ${supabaseError.message}` : "") },
        { status: 500 },
      );
    }

    console.log("Resume analyzed and saved:", resume);

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      feedback: validation.data,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "PDF service unavailable. Please try again later." + (error instanceof Error ? ` Details: ${error.message}` : "") },
      { status: 500 }
    );
  }
}
