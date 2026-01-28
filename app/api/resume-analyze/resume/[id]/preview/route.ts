import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

// =====================================================
// Resume Preview API
// GET: Lấy URL preview CV từ Supabase Storage
// =====================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = createRouteHandlerClient();
    const { data: resume, error: fetchError } = await supabase
      .from('resume_analyze')
      .select(`
        id,
        cvUrl: resume_url
      `)
      .eq('id', id)
      .single();

    if (fetchError || !resume) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy CV", errorCode: "RESUME_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (!resume.cvUrl) {
      return NextResponse.json(
        { success: false, error: "CV không khả dụng", errorCode: "CV_NOT_AVAILABLE" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        cvUrl: resume.cvUrl,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Không thể lấy thông tin CV", errorCode: "FETCH_FAILED" },
      { status: 500 },
    );
  }
}
