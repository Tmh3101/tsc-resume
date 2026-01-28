import { createClient } from "@supabase/supabase-js";

// =====================================================
// Supabase Client Configuration
// Client-side Supabase client
// =====================================================

// Lấy biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Kiểm tra config
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "⚠️ Supabase credentials missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
}

// Tạo Supabase client
export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key"
);
