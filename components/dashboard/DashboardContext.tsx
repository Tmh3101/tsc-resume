"use client";

import React from "react";
import type { User } from "@supabase/supabase-js";

// =====================================================
// Dashboard Context
// Chia sẻ auth state và actions giữa các components
// =====================================================

interface DashboardContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    openLoginModal: () => void;
}

const DashboardContext = React.createContext<DashboardContextType | null>(null);

export function DashboardProvider({
    children,
    user,
    isLoading,
    openLoginModal,
}: {
    children: React.ReactNode;
    user: User | null;
    isLoading: boolean;
    openLoginModal: () => void;
}) {
    const value = React.useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            openLoginModal,
        }),
        [user, isLoading, openLoginModal]
    );

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = React.useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within DashboardProvider");
    }
    return context;
}
