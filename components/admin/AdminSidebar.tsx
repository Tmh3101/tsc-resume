"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CalendarClock,
    Building2,
    CalendarDays,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Settings,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// =====================================================
// Admin Sidebar Component
// Professional shell layout navigation
// =====================================================

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/applications", label: "Hồ sơ Ứng tuyển", icon: Users },
    { href: "/admin/interviews", label: "Lịch Phỏng vấn", icon: CalendarClock },
    { href: "/admin/partners", label: "Đối tác Doanh nghiệp", icon: Building2 },
    { href: "/admin/schedules", label: "Lịch làm việc", icon: CalendarDays },
    { href: "/admin/system", label: "Hệ thống", icon: Settings },
];

interface AdminSidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    const isActiveLink = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
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
                            Quản trị hệ thống
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

                {/* User Section */}
                <div className="p-3 border-t border-white/10">
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
                </div>
            </aside>
        </>
    );
}

// =====================================================
// Mobile Menu Trigger
// =====================================================

interface MobileMenuTriggerProps {
    onClick: () => void;
}

export function MobileMenuTrigger({ onClick }: MobileMenuTriggerProps) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
            <Menu className="w-5 h-5 text-gray-600" />
        </button>
    );
}

// =====================================================
// Admin Header
// =====================================================

interface AdminHeaderProps {
    title: string;
    children?: React.ReactNode;
    onMenuClick: () => void;
}

export function AdminHeader({ title, children, onMenuClick }: AdminHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
                <MobileMenuTrigger onClick={onMenuClick} />
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </header>
    );
}
