import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { dbResumeToResumeData } from "@/utils/typeConvert";

// =====================================================
// Duplicate Resume API
// POST: Sao chép một CV
// =====================================================

/**
 * POST /api/resumes/[id]/duplicate
 * Tạo bản sao của một CV
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        
        // Kiểm tra authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Lấy CV gốc
        const { data: originalResume, error: fetchError } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .eq("is_deleted", false)
            .single();

        if (fetchError || !originalResume) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy CV", errorCode: "NOT_FOUND" },
                { status: 404 }
            );
        }

        // Tạo bản sao
        const duplicateData = {
            user_id: user.id,
            template_id: originalResume.template_id,
            title: `${originalResume.title} (Sao chép)`,
            basic_info: originalResume.basic_info,
            education: originalResume.education,
            experience: originalResume.experience,
            projects: originalResume.projects,
            skill_content: originalResume.skill_content,
            custom_data: originalResume.custom_data,
            menu_sections: originalResume.menu_sections,
            global_settings: originalResume.global_settings,
        };

        const { data: newResume, error: insertError } = await supabase
            .from("resumes")
            .insert(duplicateData)
            .select()
            .single();

        if (insertError) {
            console.error("Error duplicating resume:", insertError);
            return NextResponse.json(
                { success: false, error: "Không thể sao chép CV", errorCode: "DUPLICATE_FAILED" },
                { status: 500 }
            );
        }

        const resumeData = dbResumeToResumeData(newResume);

        return NextResponse.json({
            success: true,
            data: resumeData,
        }, { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
