"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Settings } from "lucide-react";

// =====================================================
// Admin Maintenance Overlay
// Hiển thị khi chế độ bảo trì được bật (trừ trang /admin/system)
// =====================================================

interface MaintenanceOverlayProps {
    isMaintenanceMode: boolean;
}

export function MaintenanceOverlay({ isMaintenanceMode }: MaintenanceOverlayProps) {
    const pathname = usePathname();
    
    // Không hiển thị overlay trên trang system settings
    if (!isMaintenanceMode || pathname === "/admin/system") {
        return null;
    }

    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            
            {/* Warning Content */}
            <div className="relative z-10 mx-4 text-center max-w-lg">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#f29427] rounded-full mb-6 shadow-lg">
                    <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                    Chế độ Bảo trì đang bật
                </h2>

                {/* Description */}
                <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed drop-shadow">
                    Hãy kiểm tra lại cài đặt hệ thống để tắt chế độ bảo trì khi hoàn tất công việc.
                </p>

                {/* CTA Button */}
                <Link
                    href="/admin/system"
                    className="
                        inline-flex items-center justify-center gap-2
                        px-6 py-3 rounded-xl
                        bg-white hover:bg-gray-100
                        text-[#0e3963] font-semibold
                        transition-all duration-200
                        shadow-lg hover:shadow-xl hover:scale-105
                    "
                >
                    <Settings className="w-5 h-5" />
                    Đi đến Cài đặt Hệ thống
                </Link>
            </div>
        </div>
    );
}

// =====================================================
// Hook to check maintenance mode
// =====================================================

export function useMaintenanceMode() {
    const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const checkMaintenanceMode = React.useCallback(async () => {
        try {
            const response = await fetch("/api/admin/system");
            const data = await response.json();
            setIsMaintenanceMode(data.maintenance_mode === true);
        } catch (error) {
            console.error("Error checking maintenance mode:", error);
            setIsMaintenanceMode(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        checkMaintenanceMode();
        
        // Poll every 30 seconds to check for updates
        const interval = setInterval(checkMaintenanceMode, 30000);
        
        return () => clearInterval(interval);
    }, [checkMaintenanceMode]);

    return { isMaintenanceMode, isLoading, refetch: checkMaintenanceMode };
}
