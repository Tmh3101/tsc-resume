"use client";

import React from "react";
import {
    Settings,
    Shield,
    Power,
    Clock,
    AlertTriangle,
    CheckCircle,
    Loader2,
    RefreshCw,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { PageContainer, Skeleton } from "@/components/admin/AdminUI";

// =====================================================
// Admin System Settings Page
// Quản lý cài đặt hệ thống - Maintenance Mode
// =====================================================

interface SystemSettings {
    maintenance_mode: boolean;
    updated_at: string | null;
    updated_by: string | null;
}

export default function SystemSettingsPage({ 
    onMenuClick 
}: { 
    onMenuClick?: () => void 
}) {
    const [settings, setSettings] = React.useState<SystemSettings>({
        maintenance_mode: false,
        updated_at: null,
        updated_by: null,
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

    // Fetch current settings
    const fetchSettings = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch("/api/admin/system");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Không thể tải cài đặt hệ thống");
            }

            setSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Toggle maintenance mode
    const handleToggleMaintenance = async () => {
        setIsUpdating(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch("/api/admin/system", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    maintenance_mode: !settings.maintenance_mode,
                    updated_by: session?.user?.email || "admin",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Không thể cập nhật cài đặt");
            }

            setSettings({
                maintenance_mode: data.maintenance_mode,
                updated_at: data.updated_at,
                updated_by: data.updated_by,
            });

            setSuccessMessage(
                data.maintenance_mode
                    ? "Đã bật chế độ bảo trì"
                    : "Đã tắt chế độ bảo trì"
            );

            // Auto hide success message
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return "Chưa cập nhật";
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <PageContainer
            title="Cài đặt Hệ thống"
            description="Quản lý trạng thái hệ thống và chế độ bảo trì"
            onMenuClick={onMenuClick}
            actions={
                <button
                    onClick={fetchSettings}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Làm mới</span>
                </button>
            }
        >
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Lỗi</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                )}

                {/* Maintenance Mode Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0e3963] rounded-lg">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Chế độ Bảo trì
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Kiểm soát trạng thái hoạt động của website
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : (
                            <>
                                {/* Status Display */}
                                <div className={`
                                    p-4 rounded-xl border-2 transition-all duration-300
                                    ${settings.maintenance_mode 
                                        ? 'bg-orange-50 border-orange-200' 
                                        : 'bg-green-50 border-green-200'
                                    }
                                `}>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                p-3 rounded-full
                                                ${settings.maintenance_mode 
                                                    ? 'bg-orange-100' 
                                                    : 'bg-green-100'
                                                }
                                            `}>
                                                {settings.maintenance_mode ? (
                                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                                ) : (
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Trạng thái hiện tại
                                                </p>
                                                <p className={`
                                                    text-xl font-bold
                                                    ${settings.maintenance_mode 
                                                        ? 'text-orange-600' 
                                                        : 'text-green-600'
                                                    }
                                                `}>
                                                    {settings.maintenance_mode 
                                                        ? "Đang bảo trì" 
                                                        : "Hoạt động bình thường"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Toggle Switch */}
                                        <button
                                            onClick={handleToggleMaintenance}
                                            disabled={isUpdating}
                                            className={`
                                                relative inline-flex h-12 w-24 items-center rounded-full
                                                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
                                                ${settings.maintenance_mode
                                                    ? 'bg-orange-500 focus:ring-orange-500'
                                                    : 'bg-green-500 focus:ring-green-500'
                                                }
                                                ${isUpdating ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:opacity-90'}
                                            `}
                                            aria-label={settings.maintenance_mode ? "Tắt chế độ bảo trì" : "Bật chế độ bảo trì"}
                                        >
                                            <span
                                                className={`
                                                    absolute left-1 inline-flex h-10 w-10 items-center justify-center
                                                    rounded-full bg-white shadow-lg
                                                    transition-transform duration-300 ease-in-out
                                                    ${settings.maintenance_mode ? 'translate-x-12' : 'translate-x-0'}
                                                `}
                                            >
                                                {isUpdating ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                                                ) : (
                                                    <Power className={`w-5 h-5 ${settings.maintenance_mode ? 'text-orange-500' : 'text-green-500'}`} />
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Cập nhật lần cuối
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDateTime(settings.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Settings className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Người cập nhật
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                                {settings.updated_by || "Chưa có thông tin"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning Notice */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                        <div className="text-sm text-amber-800">
                                            <p className="font-medium">Lưu ý quan trọng</p>
                                            <p className="mt-1">
                                                Khi bật chế độ bảo trì, tất cả người dùng truy cập website 
                                                (ngoại trừ trang Admin) sẽ thấy thông báo bảo trì. 
                                                Hãy đảm bảo hoàn tất công việc trước khi tắt chế độ này.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-md font-semibold text-gray-900">
                            Hướng dẫn sử dụng
                        </h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0e3963] text-white text-xs font-medium flex-shrink-0 mt-0.5">
                                    1
                                </span>
                                <span>
                                    <strong>Bật chế độ bảo trì:</strong> Nhấn vào nút toggle để chuyển sang trạng thái "Đang bảo trì"
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0e3963] text-white text-xs font-medium flex-shrink-0 mt-0.5">
                                    2
                                </span>
                                <span>
                                    <strong>Khi đang bảo trì:</strong> Người dùng sẽ thấy trang thông báo "Hệ thống đang bảo trì"
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0e3963] text-white text-xs font-medium flex-shrink-0 mt-0.5">
                                    3
                                </span>
                                <span>
                                    <strong>Tắt chế độ bảo trì:</strong> Nhấn lại vào toggle để website hoạt động bình thường
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
