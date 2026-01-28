import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// =====================================================
// Next.js Middleware - Authentication & Route Protection
// Bao gồm: Auth check, Maintenance mode check
// =====================================================

// Helper function to check maintenance mode
async function isMaintenanceMode(supabaseUrl: string, supabaseServiceKey: string): Promise<boolean> {
    try {
        // Sử dụng service role key để bypass RLS
        const response = await fetch(`${supabaseUrl}/rest/v1/system_settings?key=eq.maintenance_mode&select=value`, {
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            // Cache for 10 seconds to reduce database calls
            next: { revalidate: 10 },
        });

        if (!response.ok) return false;
        
        const data = await response.json();
        return data?.[0]?.value === 'true';
    } catch (error) {
        console.error('Error checking maintenance mode:', error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Skip if environment variables are not set
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase environment variables not set");
        return supabaseResponse;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    // Get current user session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Rule 1: Protect /admin routes - redirect to /login if not authenticated
    if (pathname.startsWith("/admin") && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Rule 2: If user is logged in and tries to access /login, redirect to /admin
    if (pathname === "/login" && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    // Rule 3: Check maintenance mode for non-admin routes
    // Skip maintenance check for: /admin, /login, /api, /_next, /favicon.ico, static files
    const skipMaintenanceCheck = 
        pathname.startsWith("/admin") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".") ||  // Static files
        pathname === "/favicon.ico";

    if (!skipMaintenanceCheck && supabaseServiceKey) {
        const maintenanceEnabled = await isMaintenanceMode(supabaseUrl, supabaseServiceKey);
        
        if (maintenanceEnabled) {
            // Rewrite to maintenance page instead of redirect
            // This preserves the URL but shows maintenance content
            const url = request.nextUrl.clone();
            url.pathname = "/maintenance";
            return NextResponse.rewrite(url);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        // Apply to all routes except static files and api
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
