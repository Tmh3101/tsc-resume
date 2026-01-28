import { NextRequest, NextResponse } from "next/server";
import { makeAIRequest } from "@/lib/resume-analyze/ai-helpers";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { z } from "zod";
import type { Feedback } from "@/types";

// =====================================================
// Regenerate Cold DM API
// POST: Tạo lại tin nhắn tiếp cận LinkedIn dựa trên feedback
// =====================================================

const RegenerateColdDMSchema = z.object({
  resumeId: z.string(),
  userFeedback: z.string().trim().min(10).max(500),
});

async function regenerateColdDM(
  resumeMarkdown: string,
  jobTitle: string,
  jobDescription: string,
  currentColdDM: string,
  userFeedback: string
): Promise<string> {
  const systemPrompt = `Bạn là chuyên gia tư vấn CV chuyên về soạn thảo tin nhắn tiếp cận lạnh được cá nhân hóa. Nhiệm vụ của bạn là tạo lại tin nhắn LinkedIn DM dựa trên phản hồi của người dùng.`;

  const userPrompt = `Tôi cần bạn tạo lại tin nhắn tiếp cận lạnh dựa trên phản hồi cụ thể của người dùng.

Chức danh công việc: ${jobTitle}
Mô tả công việc: ${jobDescription}

CV (định dạng markdown):
${resumeMarkdown}

Tin nhắn tiếp cận hiện tại:
${currentColdDM}

Phản hồi của người dùng:
${userFeedback}

HƯỚNG DẪN TIN NHẮN TIẾP CẬN LẠNH:
- Viết từ góc nhìn của người tìm việc (ngôi thứ nhất) gửi đến đội ngũ tuyển dụng
- Phong cách LinkedIn DM chuyên nghiệp, dưới 100 từ, 2-3 đoạn ngắn
- PHẢI bắt đầu bằng lời chào tự nhiên ("Xin chào," hoặc "Chào anh/chị,")
- Cấu trúc: lời chào → điểm thu hút → 2-3 điểm mạnh từ CV phù hợp với công việc → CTA ngắn gọn
- CHỈ sử dụng thông tin từ CV - không bịa đặt kỹ năng hoặc kinh nghiệm
- CTA: đề xuất một cuộc trò chuyện ngắn trong tuần này (10-15 phút)
- Tránh: "Tôi tự tin rằng", "Tôi mong chờ", tên placeholder
- Xưng hô không phụ thuộc vai trò (phù hợp với HR, founder, hoặc CEO)
- Tránh thuật ngữ doanh nghiệp và cụm từ AI như "Tôi viết thư này để bày tỏ" hoặc "Tôi rất mong có cơ hội"

TRẢ LỜI BẰNG TIẾNG VIỆT.
Áp dụng phản hồi của người dùng để cải thiện tin nhắn. Trả về CHỈ văn bản tin nhắn tiếp cận lạnh đã tạo lại, không có định dạng JSON, không có khối mã markdown, không có văn bản giải thích.`;

  const content = await makeAIRequest<string>({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    reasoningLevel: "low",
    responseFormat: { type: "text" },
  });

  return content.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = RegenerateColdDMSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu yêu cầu không hợp lệ", errorCode: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const supabase = createRouteHandlerClient();

    const { resumeId, userFeedback } = validation.data;
    const { data: resume, error: fetchError } = await supabase
      .from('resume_analyze')
      .select(`
        id,
        jobTitle: job_title,
        jobDescription: job_description,
        resumeMarkdown: resume_markdown,
        feedback
      `)
      .eq('id', resumeId)
      .single();

    if (fetchError || !resume) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy CV", errorCode: "RESUME_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (!resume.resumeMarkdown) {
      return NextResponse.json(
        {
          success: false,
          error: "Không có dữ liệu CV để tạo lại tin nhắn",
          errorCode: "MISSING_RESUME_DATA"
        },
        { status: 400 },
      );
    }

    const feedback = resume.feedback as unknown as Feedback;

    if (!feedback?.coldOutreachMessage) {
      return NextResponse.json(
        { success: false, error: "Không có tin nhắn để tạo lại", errorCode: "NO_EXISTING_DM" },
        { status: 400 },
      );
    }

    // Logic AI giữ nguyên
    const newColdDM = await regenerateColdDM(
      resume.resumeMarkdown,
      resume.jobTitle,
      resume.jobDescription,
      feedback.coldOutreachMessage,
      userFeedback
    );

    const updatedFeedback: Feedback = {
      ...feedback,
      coldOutreachMessage: newColdDM,
    };

    // Update lại feedback vào Supabase
    const { error: updateError } = await supabase
      .from('resume_analyze')
      .update({
        feedback: updatedFeedback,
      })
      .eq('id', resumeId);

    if (updateError) {
      console.error("Error updating resume:", updateError);
      return NextResponse.json(
        { success: false, error: "Không thể cập nhật cơ sở dữ liệu", errorCode: "UPDATE_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coldOutreachMessage: newColdDM,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tạo lại tin nhắn", errorCode: "REGENERATION_FAILED" },
      { status: 500 }
    );
  }
}
