import { NextRequest, NextResponse } from "next/server";
import { extractJobData } from "@/lib/resume-analyze/job-import";

// =====================================================
// Import Job from URL API
// POST: Import job details từ URL (sử dụng Jina Reader)
// =====================================================

const MAX_CONTENT_LENGTH = 15000;

function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);

    if (urlObj.protocol !== "https:") {
      return { valid: false, error: "Chỉ hỗ trợ URL HTTPS" };
    }

    const hostname = urlObj.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.")
    ) {
      return { valid: false, error: "URL không hợp lệ" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Định dạng URL không hợp lệ" };
  }
}

async function fetchPageContent(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;

  const response = await fetch(jinaUrl, {
    headers: {
      "User-Agent": "TSCJobFetcher/1.0",
      Accept: "text/plain",
    },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Không thể fetch nội dung: ${response.status}`);
  }

  const content = await response.text();
  if (!content || content.trim().length === 0) {
    throw new Error("Không tìm thấy nội dung tại URL này");
  }

  return content.slice(0, MAX_CONTENT_LENGTH);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL là bắt buộc", errorCode: "MISSING_URL" },
        { status: 400 },
      );
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      return NextResponse.json(
        { success: false, error: urlValidation.error || "URL không hợp lệ", errorCode: "INVALID_URL" },
        { status: 400 },
      );
    }

    const pageContent = await fetchPageContent(url);
    const jobData = await extractJobData(pageContent);

    return NextResponse.json({
      success: true,
      data: jobData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Không thể fetch thông tin công việc. Vui lòng kiểm tra URL.",
        errorCode: "FETCH_FAILED",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
