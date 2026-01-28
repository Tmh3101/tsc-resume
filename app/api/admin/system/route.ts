import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// =====================================================
// System Settings API
// GET: Lấy trạng thái hệ thống (maintenance mode)
// POST: Cập nhật trạng thái hệ thống (chỉ admin)
// =====================================================

export async function GET() {
    try {
        const supabase = createServerClient();
        
        if (!supabase) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 500 }
            );
        }

        // Lấy cài đặt maintenance mode
        const { data, error } = await supabase
            .from("system_settings")
            .select("*")
            .eq("key", "maintenance_mode")
            .single();

        if (error && error.code !== "PGRST116") {
            // PGRST116 = row not found - bỏ qua lỗi này
            console.error("Error fetching maintenance mode:", error);
            return NextResponse.json(
                { error: "Failed to fetch system settings" },
                { status: 500 }
            );
        }

        // Nếu chưa có setting, trả về false (không bảo trì)
        const isMaintenanceMode = data?.value === "true";

        return NextResponse.json({
            maintenance_mode: isMaintenanceMode,
            updated_at: data?.updated_at || null,
            updated_by: data?.updated_by || null,
        });
    } catch (error) {
        console.error("System settings API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createServerClient();
        
        if (!supabase) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { maintenance_mode, updated_by } = body;

        if (typeof maintenance_mode !== "boolean") {
            return NextResponse.json(
                { error: "maintenance_mode must be a boolean" },
                { status: 400 }
            );
        }

        // Upsert cài đặt maintenance mode
        const { data, error } = await supabase
            .from("system_settings")
            .upsert(
                {
                    key: "maintenance_mode",
                    value: maintenance_mode.toString(),
                    updated_at: new Date().toISOString(),
                    updated_by: updated_by || null,
                },
                {
                    onConflict: "key",
                }
            )
            .select()
            .single();

        if (error) {
            console.error("Error updating maintenance mode:", error);
            return NextResponse.json(
                { error: "Failed to update system settings" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            maintenance_mode: data.value === "true",
            updated_at: data.updated_at,
            updated_by: data.updated_by,
        });
    } catch (error) {
        console.error("System settings API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
