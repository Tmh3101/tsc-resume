"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    FolderOpen,
    LayoutTemplate,
    ChevronRight,
    X,
    LogIn,
    LogOut,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

// =====================================================
// Dashboard Sidebar Component
// Sidebar navigation cho trang Dashboard CV
// Đồng bộ giao diện với AdminSidebar
// =====================================================

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { 
        href: "/dashboard", 
        label: "Quản lý CV", 
        icon: FolderOpen,
    },
    { 
        href: "/dashboard/templates", 
        label: "Templates", 
        icon: LayoutTemplate,
    },
];

interface DashboardSidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
    isAuthenticated: boolean;
    onLoginClick: () => void;
    user?: User | null;
}

export function DashboardSidebar({ 
    isMobileOpen, 
    onMobileClose, 
    isAuthenticated,
    onLoginClick,
    user
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user) return "U";
        const name = user.user_metadata?.full_name || user.email || "";
        if (user.user_metadata?.full_name) {
            const parts = name.split(" ");
            return parts.length > 1 
                ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                : name[0].toUpperCase();
        }
        return name[0]?.toUpperCase() || "U";
    };

    const isActiveLink = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64
                    bg-[#0e3963] text-white
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:sticky lg:z-auto
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo Header */}
                <div className="h-30 flex items-center justify-between px-4 border-b border-white/10">
                    <Link href="/" className="flex-1 flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo-tsc.png"
                                alt="TSC Logo"
                                width={56}
                                height={56}
                                className="rounded-md"
                            />
                            <span className="text-2xl font-bold">
                                <span className="text-orange">T</span>SC
                            </span>
                        </div>
                        <span className="text-sm text-white/50 font-medium tracking-wide">
                            Tạo và quản lý CV của bạn
                        </span>
                    </Link>
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden absolute right-4 top-4 p-1 hover:bg-white/10 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveLink(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onMobileClose}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? "bg-white/20 text-white"
                                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="flex-1">{item.label}</span>
                                        {isActive && (
                                            <ChevronRight className="w-4 h-4 opacity-60" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User/Login Section */}
                <div className="p-3 border-t border-white/10">
                    {isAuthenticated && user ? (
                        <>
                            <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                {user.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    text-sm font-medium text-white/70
                                    hover:bg-red-500/20 hover:text-red-300
                                    transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Đăng xuất</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                text-sm font-medium text-white/70
                                hover:bg-orange/20 hover:text-orange
                                transition-all duration-200"
                        >
                            <LogIn className="w-5 h-5" />
                            <span>Đăng nhập</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}

// Export Header component for mobile
export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4">
            <button
                onClick={onMenuClick}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className="flex-1 flex items-center justify-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo-tsc.png"
                        alt="TSC Logo"
                        width={28}
                        height={28}
                        className="rounded-md"
                    />
                    <span className="text-lg font-bold text-gray-900">
                        <span className="text-orange">T</span>SC CV
                    </span>
                </Link>
            </div>
            <div className="w-9" /> {/* Spacer for center alignment */}
        </header>
    );
}
