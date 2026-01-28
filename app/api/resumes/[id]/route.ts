import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { 
    dbResumeToResumeData, 
    resumeDataToDbUpdate 
} from "@/utils/typeConvert";

// =====================================================
// Resume by ID API
// GET, PUT, DELETE operations cho một CV cụ thể
// =====================================================

/**
 * GET /api/resumes/[id]
 * Lấy chi tiết một CV
 */
export async function GET(
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

        const { data: resume, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .eq("is_deleted", false)
            .single();

        if (error || !resume) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy CV", errorCode: "NOT_FOUND" },
                { status: 404 }
            );
        }

        const resumeData = dbResumeToResumeData(resume);

        return NextResponse.json({
            success: true,
            data: resumeData,
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/resumes/[id]
 * Cập nhật một CV
 */
export async function PUT(
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

        // Verify ownership
        const { data: existingResume, error: checkError } = await supabase
            .from("resumes")
            .select("id")
            .eq("id", id)
            .eq("user_id", user.id)
            .eq("is_deleted", false)
            .single();

        if (checkError || !existingResume) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy CV", errorCode: "NOT_FOUND" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const dbUpdate = resumeDataToDbUpdate(body);

        const { data: resume, error } = await supabase
            .from("resumes")
            .update(dbUpdate)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("Error updating resume:", error);
            return NextResponse.json(
                { success: false, error: "Không thể cập nhật CV", errorCode: "UPDATE_FAILED" },
                { status: 500 }
            );
        }

        const updatedResume = dbResumeToResumeData(resume);

        return NextResponse.json({
            success: true,
            data: updatedResume,
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/resumes/[id]
 * Soft delete một CV
 */
export async function DELETE(
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

        // Soft delete
        const { error } = await supabase
            .from("resumes")
            .update({ is_deleted: true })
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error deleting resume:", error);
            return NextResponse.json(
                { success: false, error: "Không thể xóa CV", errorCode: "DELETE_FAILED" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "CV đã được xóa",
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
