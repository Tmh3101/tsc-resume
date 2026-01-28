"use client";

import React from "react";
import { DashboardSidebar, DashboardHeader } from "@/components/dashboard/DashboardSidebar";
import { LoginModal } from "@/components/dashboard/LoginModal";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

// =====================================================
// Dashboard Shell Layout
// Layout chính cho trang Dashboard CV
// =====================================================

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const openLoginModal = React.useCallback(() => {
        setIsLoginModalOpen(true);
    }, []);

    // Check auth state on mount and listen for changes
    React.useEffect(() => {
        const supabase = createClient();

        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setIsLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_IN') {
                setIsLoginModalOpen(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const isAuthenticated = !!user;

    return (
        <DashboardProvider
            user={user}
            isLoading={isLoading}
            openLoginModal={openLoginModal}
        >
            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar */}
                <DashboardSidebar
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                    isAuthenticated={isAuthenticated}
                    onLoginClick={openLoginModal}
                    user={user}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>

                {/* Login Modal */}
                <LoginModal 
                    isOpen={isLoginModalOpen} 
                    onClose={() => setIsLoginModalOpen(false)} 
                />
            </div>
        </DashboardProvider>
    );
}
