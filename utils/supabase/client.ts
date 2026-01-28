import { createBrowserClient } from "@supabase/ssr";

// =====================================================
// Supabase Client for Client Components
// Use this in "use client" components
// =====================================================

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Validate environment variables
    if (!supabaseUrl) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
            "Please add it to your .env.local file."
        );
    }

    if (!supabaseAnonKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. " +
            "Please add it to your .env.local file."
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
