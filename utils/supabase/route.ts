import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// =====================================================
// Supabase Client for API Route Handlers
// Use this in API routes (app/api/*)
// This uses service role key for server-side operations
// =====================================================

export function createRouteHandlerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Validate environment variables
    if (!supabaseUrl) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
            "Please add it to your .env.local file."
        );
    }

    // Use service role key if available, otherwise use anon key
    const key = supabaseServiceKey || supabaseAnonKey;

    if (!key) {
        throw new Error(
            "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. " +
            "Please add at least one to your .env.local file."
        );
    }

    return createSupabaseClient(supabaseUrl, key);
}
