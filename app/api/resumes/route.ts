import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { 
    dbResumeToResumeData, 
    resumeDataToDbInsert, 
} from "@/utils/typeConvert";
import { dbTemplateToResumeTemplate } from "@/utils/typeConvert";
import { ResumeData } from "@/types/resume";
import { initialResumeState } from "@/config/initialResumeData";

// =====================================================
// Resumes API
// CRUD operations cho CV của người dùng
// =====================================================

/**
 * GET /api/resumes
 * Lấy danh sách CV của người dùng hiện tại
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Kiểm tra authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Query params
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "updated_at";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from("resumes")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .eq("is_deleted", false);

        // Search filter
        if (search) {
            query = query.ilike("title", `%${search}%`);
        }

        // Sorting
        query = query.order(sortBy, { ascending: sortOrder === "asc" });

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data: resumes, error, count } = await query;

        if (error) {
            console.error("Error fetching resumes:", error);
            return NextResponse.json(
                { success: false, error: "Không thể lấy danh sách CV", errorCode: "FETCH_FAILED" },
                { status: 500 }
            );
        }

        // Convert to frontend format
        const resumeDataList = (resumes || []).map(dbResumeToResumeData);

        return NextResponse.json({
            success: true,
            data: resumeDataList,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
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
 * POST /api/resumes
 * Tạo CV mới
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Kiểm tra authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { templateId, title, resumeData } = body;

        // Lấy template từ database
        let template = null;
        if (templateId) {
            const { data: dbTemplate } = await supabase
                .from("templates")
                .select("*")
                .eq("id", templateId)
                .eq("is_active", true)
                .single();
            
            if (dbTemplate) {
                template = dbTemplateToResumeTemplate(dbTemplate);
            }
        }

        // Nếu không có template, lấy template mặc định (template đầu tiên)
        if (!template) {
            const { data: defaultTemplate } = await supabase
                .from("templates")
                .select("*")
                .eq("is_active", true)
                .limit(1)
                .single();
            
            if (defaultTemplate) {
                template = dbTemplateToResumeTemplate(defaultTemplate);
            }
        }

        // Tạo resume data mới
        const newResumeData: Partial<ResumeData> = resumeData || {
            ...initialResumeState,
            title: title || `CV mới`,
            templateId: template?.id,
            globalSettings: {
                ...initialResumeState.globalSettings,
                themeColor: template?.colorScheme.primary,
                sectionSpacing: template?.spacing.sectionGap,
                paragraphSpacing: template?.spacing.itemGap,
                pagePadding: template?.spacing.contentPadding,
            },
            basic: {
                ...initialResumeState.basic,
                layout: template?.basic.layout,
            },
        };

        // Convert to database format
        const dbInsert = resumeDataToDbInsert(newResumeData, user.id);

        const { data: resume, error } = await supabase
            .from("resumes")
            .insert(dbInsert)
            .select()
            .single();

        if (error) {
            console.error("Error creating resume:", error);
            return NextResponse.json(
                { success: false, error: "Không thể tạo CV", errorCode: "CREATE_FAILED" },
                { status: 500 }
            );
        }

        const createdResume = dbResumeToResumeData(resume);

        return NextResponse.json({
            success: true,
            data: createdResume,
        }, { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi server", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
