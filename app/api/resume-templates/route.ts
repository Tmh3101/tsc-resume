import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { dbTemplateToResumeTemplate } from "@/utils/typeConvert";
import { TemplateInsert } from "@/types/db/template";

// =====================================================
// Resume Templates API
// CRUD operations cho các mẫu CV
// =====================================================

/**
 * GET /api/resume-templates
 * Lấy danh sách tất cả templates đang hoạt động
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Query params
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";
        const includePremium = searchParams.get("includePremium") === "true";

        // Build query
        let query = supabase
            .from("templates")
            .select("*")
            .order("created_at", { ascending: true });

        // Filter by active status
        if (!includeInactive) {
            query = query.eq("is_active", true);
        }

        // Filter premium templates (for non-premium users)
        if (!includePremium) {
            query = query.eq("is_premium", false);
        }

        const { data: templates, error } = await query;

        if (error) {
            console.error("Error fetching templates:", error);
            return NextResponse.json(
                { success: false, error: "Không thể lấy danh sách mẫu CV", errorCode: "FETCH_FAILED" },
                { status: 500 }
            );
        }

        // Convert to frontend format
        const templateList = (templates || []).map(dbTemplateToResumeTemplate);

        return NextResponse.json({
            success: true,
            data: templateList,
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
 * POST /api/resume-templates
 * Tạo template mới (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Kiểm tra authentication và admin role
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // TODO: Check admin role
        // const isAdmin = user.app_metadata?.role === "admin";
        // if (!isAdmin) {
        //     return NextResponse.json(
        //         { success: false, error: "Forbidden", errorCode: "FORBIDDEN" },
        //         { status: 403 }
        //     );
        // }

        const body = await request.json();
        const { id, name, description, thumbnail_url, layout, colorScheme, spacing, basicConfig, isPremium } = body;

        if (!id || !name || !layout) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin bắt buộc", errorCode: "MISSING_FIELDS" },
                { status: 400 }
            );
        }

        const templateInsert: TemplateInsert = {
            id,
            name,
            description: description || null,
            thumbnail_url: thumbnail_url || null,
            layout,
            color_scheme: colorScheme || {
                primary: "#000000",
                secondary: "#4b5563",
                background: "#ffffff",
                text: "#212529"
            },
            spacing: spacing || {
                sectionGap: 24,
                itemGap: 16,
                contentPadding: 32
            },
            basic_config: basicConfig || { layout: "center" },
            is_premium: isPremium || false,
            is_active: true,
        };

        const { data: template, error } = await supabase
            .from("templates")
            .insert(templateInsert)
            .select()
            .single();

        if (error) {
            console.error("Error creating template:", error);
            return NextResponse.json(
                { success: false, error: "Không thể tạo mẫu CV", errorCode: "CREATE_FAILED" },
                { status: 500 }
            );
        }

        const createdTemplate = dbTemplateToResumeTemplate(template);

        return NextResponse.json({
            success: true,
            data: createdTemplate,
        }, { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
