"use client";

import React from "react";
import { AdminSidebar, AdminHeader } from "@/components/admin/AdminSidebar";
import { MaintenanceOverlay, useMaintenanceMode } from "@/components/admin/MaintenanceOverlay";

// =====================================================
// Admin Shell Layout
// Professional dashboard layout with sidebar navigation
// =====================================================

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const { isMaintenanceMode } = useMaintenanceMode();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AdminSidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child as React.ReactElement<{ onMenuClick?: () => void }>, {
                                onMenuClick: () => setIsMobileMenuOpen(true)
                            });
                        }
                        return child;
                    })}
                </main>

                {/* Maintenance Overlay */}
                <MaintenanceOverlay isMaintenanceMode={isMaintenanceMode} />
            </div>
        </div>
    );
}
