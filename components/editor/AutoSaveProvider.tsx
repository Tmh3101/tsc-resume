"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { ResumeData } from "@/types/resume";
import { createClient } from "@/utils/supabase/client";

// =====================================================
// AutoSave Context & Provider
// Tự động lưu CV vào database khi có thay đổi
// =====================================================

interface AutoSaveContextType {
    isSaving: boolean;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;
    error: string | null;
}

const AutoSaveContext = createContext<AutoSaveContextType | null>(null);

export function useAutoSave() {
    const context = useContext(AutoSaveContext);
    if (!context) {
        throw new Error("useAutoSave must be used within AutoSaveProvider");
    }
    return context;
}

interface AutoSaveProviderProps {
    children: React.ReactNode;
    resumeId: string;
    debounceMs?: number;
}

export function AutoSaveProvider({ 
    children, 
    resumeId, 
    debounceMs = 3000 
}: AutoSaveProviderProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedHashRef = useRef<string | null>(null);
    const resumeDataRef = useRef<ResumeData | null>(null);

    // Check authentication
    useEffect(() => {
        const supabase = createClient();
        
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session?.user);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session?.user);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Save function
    const saveToDatabase = useCallback(async (data: ResumeData) => {
        if (!isAuthenticated) return;

        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${resumeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    templateId: data.templateId,
                    basic: data.basic,
                    education: data.education,
                    experience: data.experience,
                    projects: data.projects,
                    skillContent: data.skillContent,
                    customData: data.customData,
                    menuSections: data.menuSections,
                    globalSettings: data.globalSettings,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Không thể lưu CV");
            }

            lastSavedHashRef.current = JSON.stringify(data);
            setLastSavedAt(new Date());
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            console.error("Auto-save failed:", err);
        } finally {
            setIsSaving(false);
        }
    }, [resumeId, isAuthenticated]);

    // Manual save function
    const saveNow = useCallback(async () => {
        if (resumeDataRef.current) {
            await saveToDatabase(resumeDataRef.current);
        }
    }, [saveToDatabase]);

    // Subscribe to store changes
    useEffect(() => {
        if (!isAuthenticated) return;

        const unsubscribe = useResumeStore.subscribe((state) => {
            const resume = state.activeResume;
            
            if (!resume || resume.id !== resumeId) return;

            resumeDataRef.current = resume;

            // Check if data changed
            const currentHash = JSON.stringify(resume);
            if (lastSavedHashRef.current === currentHash) return;

            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout for debounced save
            timeoutRef.current = setTimeout(() => {
                saveToDatabase(resume);
            }, debounceMs);
        });

        return () => {
            unsubscribe();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [resumeId, debounceMs, isAuthenticated, saveToDatabase]);

    // Save on unmount if there are unsaved changes
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            // Immediate save on unmount
            if (resumeDataRef.current && isAuthenticated) {
                const currentHash = JSON.stringify(resumeDataRef.current);
                if (lastSavedHashRef.current !== currentHash) {
                    // Use beacon API for reliable unmount save
                    const data = {
                        title: resumeDataRef.current.title,
                        templateId: resumeDataRef.current.templateId,
                        basic: resumeDataRef.current.basic,
                        education: resumeDataRef.current.education,
                        experience: resumeDataRef.current.experience,
                        projects: resumeDataRef.current.projects,
                        skillContent: resumeDataRef.current.skillContent,
                        customData: resumeDataRef.current.customData,
                        menuSections: resumeDataRef.current.menuSections,
                        globalSettings: resumeDataRef.current.globalSettings,
                    };
                    
                    navigator.sendBeacon(
                        `/api/resumes/${resumeId}`,
                        new Blob([JSON.stringify(data)], { type: "application/json" })
                    );
                }
            }
        };
    }, [resumeId, isAuthenticated]);

    const value = {
        isSaving,
        lastSavedAt,
        saveNow,
        error,
    };

    return (
        <AutoSaveContext.Provider value={value}>
            {children}
        </AutoSaveContext.Provider>
    );
}

// =====================================================
// AutoSave Status Component
// Hiển thị trạng thái lưu
// =====================================================

export function AutoSaveStatus() {
    const { isSaving, lastSavedAt, error } = useAutoSave();

    if (error) {
        return (
            <div className="flex items-center gap-2 text-xs text-red-500">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Lỗi lưu</span>
            </div>
        );
    }

    if (isSaving) {
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                <span>Đang lưu...</span>
            </div>
        );
    }

    if (lastSavedAt) {
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Đã lưu</span>
            </div>
        );
    }

    return null;
}
