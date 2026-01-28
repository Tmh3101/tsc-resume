"use client";

import React from "react";
import { Lock, LogIn } from "lucide-react";
import { useDashboard } from "./DashboardContext";

// =====================================================
// Auth Overlay Component
// Hiển thị khi người dùng chưa đăng nhập
// =====================================================

interface AuthOverlayProps {
    children: React.ReactNode;
}

export function AuthOverlay({ children }: AuthOverlayProps) {
    const { isAuthenticated, openLoginModal, isLoading } = useDashboard();

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred Content */}
            <div className="blur-sm pointer-events-none select-none opacity-50">
                {children}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative z-10 text-center max-w-sm mx-4">
                    {/* Lock Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-deep-blue to-deep-blue-light rounded-2xl mb-6 shadow-xl">
                        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        Yêu cầu Đăng nhập
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                        Vui lòng đăng nhập để sử dụng tính năng này và quản lý CV của bạn.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={openLoginModal}
                        className="
                            inline-flex items-center justify-center gap-2
                            px-6 py-3 rounded-xl
                            bg-gradient-to-r from-orange to-orange-light
                            text-white font-semibold
                            shadow-lg shadow-orange/30
                            hover:shadow-xl hover:shadow-orange/40
                            transition-all duration-300 hover:scale-105
                        "
                    >
                        <LogIn className="w-5 h-5" />
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
