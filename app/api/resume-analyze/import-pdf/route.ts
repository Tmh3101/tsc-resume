import { NextRequest, NextResponse } from "next/server";
import { extractJobData } from "@/lib/resume-analyze/job-import";
import { convertPdfToMarkdown, checkPdfServiceHealth } from "@/lib/pdf-service";

// =====================================================
// Import Job from PDF API
// POST: Import job details từ file PDF
// =====================================================

const MAX_CONTENT_LENGTH = 15000;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File PDF là bắt buộc", errorCode: "MISSING_FILE" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Chỉ hỗ trợ file PDF", errorCode: "INVALID_FILE_TYPE" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File phải nhỏ hơn 10 MB", errorCode: "FILE_TOO_LARGE" },
        { status: 400 },
      );
    }

    const isHealthy = await checkPdfServiceHealth();
    if (!isHealthy) {
      return NextResponse.json(
        {
          success: false,
          error: "Dịch vụ PDF không khả dụng. Vui lòng thử lại sau.",
          errorCode: "SERVICE_UNAVAILABLE"
        },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const { markdown, isOcrUsed } = await convertPdfToMarkdown(buffer);
      console.log("Job PDF - Markdown length:", markdown.length, "| OCR used:", isOcrUsed);
      
      const trimmedMarkdown = markdown.slice(0, MAX_CONTENT_LENGTH);
      if (trimmedMarkdown.length < 50) {
        return NextResponse.json(
          {
            success: false,
            error: "PDF chứa quá ít nội dung text. Vui lòng sử dụng file mô tả công việc chi tiết hơn.",
            errorCode: "INSUFFICIENT_CONTENT"
          },
          { status: 400 },
        );
      }

      const jobData = await extractJobData(trimmedMarkdown);

      return NextResponse.json({
        success: true,
        data: jobData,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Handle flatten PDF / OCR fallback failure
        if (error.message.includes("insufficient text") || error.message.includes("OCR fallback failed")) {
          return NextResponse.json(
            {
              success: false,
              error: "Không thể đọc nội dung PDF. File có thể là dạng ảnh hoặc flatten. Vui lòng sử dụng file PDF có text có thể chọn được.",
              errorCode: "PDF_UNREADABLE"
            },
            { status: 422 },
          );
        }
        
        if (error.message.includes("timeout")) {
          return NextResponse.json(
            {
              success: false,
              error: "Yêu cầu hết thời gian. Vui lòng thử lại.",
              errorCode: "TIMEOUT"
            },
            { status: 504 },
          );
        }

        if (error.message.includes("fetch") || error.message.includes("PDF")) {
          return NextResponse.json(
            {
              success: false,
              error: "Dịch vụ PDF không khả dụng. Vui lòng thử lại sau.",
              errorCode: "SERVICE_UNAVAILABLE"
            },
            { status: 502 },
          );
        }
      }

      return NextResponse.json(
        { success: false, error: "Không thể xử lý file PDF mô tả công việc.", errorCode: "PROCESSING_FAILED" },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Không thể upload file", errorCode: "UPLOAD_FAILED" },
      { status: 500 },
    );
  }
}
