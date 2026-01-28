import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// =====================================================
// Auth Callback Route
// Xử lý OAuth callback từ Google/GitHub
// =====================================================

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const next = requestUrl.searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            // Redirect về trang dashboard sau khi đăng nhập thành công
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Nếu có lỗi, redirect về dashboard với error message
    return NextResponse.redirect(`${origin}/dashboard?error=auth_failed`);
}
