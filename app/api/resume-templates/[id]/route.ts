import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { dbTemplateToResumeTemplate } from "@/utils/typeConvert";
import { TemplateUpdate } from "@/types/db/template";

// =====================================================
// Resume Template by ID API
// GET, PUT, DELETE operations cho một template cụ thể
// =====================================================

/**
 * GET /api/resume-templates/[id]
 * Lấy chi tiết một template
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: template, error } = await supabase
            .from("templates")
            .select("*")
            .eq("id", id)
            .eq("is_active", true)
            .single();

        if (error || !template) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy mẫu CV", errorCode: "NOT_FOUND" },
                { status: 404 }
            );
        }

        const templateData = dbTemplateToResumeTemplate(template);

        return NextResponse.json({
            success: true,
            data: templateData,
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
 * PUT /api/resume-templates/[id]
 * Cập nhật một template (Admin only)
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

        // TODO: Check admin role

        const body = await request.json();
        const { name, description, thumbnail_url, layout, colorScheme, spacing, basicConfig, isPremium, isActive } = body;

        const templateUpdate: TemplateUpdate = {};

        if (name !== undefined) templateUpdate.name = name;
        if (description !== undefined) templateUpdate.description = description;
        if (thumbnail_url !== undefined) templateUpdate.thumbnail_url = thumbnail_url;
        if (layout !== undefined) templateUpdate.layout = layout;
        if (colorScheme !== undefined) templateUpdate.color_scheme = colorScheme;
        if (spacing !== undefined) templateUpdate.spacing = spacing;
        if (basicConfig !== undefined) templateUpdate.basic_config = basicConfig;
        if (isPremium !== undefined) templateUpdate.is_premium = isPremium;
        if (isActive !== undefined) templateUpdate.is_active = isActive;

        const { data: template, error } = await supabase
            .from("templates")
            .update(templateUpdate)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating template:", error);
            return NextResponse.json(
                { success: false, error: "Không thể cập nhật mẫu CV", errorCode: "UPDATE_FAILED" },
                { status: 500 }
            );
        }

        const updatedTemplate = dbTemplateToResumeTemplate(template);

        return NextResponse.json({
            success: true,
            data: updatedTemplate,
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
 * DELETE /api/resume-templates/[id]
 * Soft delete một template (Admin only)
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

        // TODO: Check admin role

        // Soft delete by setting is_active = false
        const { error } = await supabase
            .from("templates")
            .update({ is_active: false })
            .eq("id", id);

        if (error) {
            console.error("Error deleting template:", error);
            return NextResponse.json(
                { success: false, error: "Không thể xóa mẫu CV", errorCode: "DELETE_FAILED" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Đã xóa mẫu CV",
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
