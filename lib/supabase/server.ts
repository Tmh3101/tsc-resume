import { createClient } from "@supabase/supabase-js";

// =====================================================
// Supabase Server Client
// Server-side Supabase client với Service Role Key
// =====================================================

// Sử dụng Service Role Key cho server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Tạo server client
export function createServerClient() {
    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn(
            "⚠️ Supabase server credentials missing. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local"
        );
        return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
