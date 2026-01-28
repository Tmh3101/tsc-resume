"use client";

import { useState, useCallback } from "react";
import { ResumeData } from "@/types/resume";

// =====================================================
// useResumesApi Hook
// Hook để gọi API quản lý CV
// =====================================================

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FetchResumesOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errorCode?: string;
    pagination?: Pagination;
    message?: string;
}

export function useResumesApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Lấy danh sách CV của user hiện tại
     */
    const fetchResumes = useCallback(async (options: FetchResumesOptions = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options.page) params.set("page", options.page.toString());
            if (options.limit) params.set("limit", options.limit.toString());
            if (options.search) params.set("search", options.search);
            if (options.sortBy) params.set("sortBy", options.sortBy);
            if (options.sortOrder) params.set("sortOrder", options.sortOrder);

            const response = await fetch(`/api/resumes${params.toString() ? `?${params.toString()}` : ""}`);
            const result: ApiResponse<ResumeData[]> = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Không thể lấy danh sách CV");
            }

            return {
                resumes: result.data || [],
                pagination: result.pagination,
            };
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Lấy chi tiết một CV
     */
    const fetchResume = useCallback(async (id: string): Promise<ResumeData | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}`);
            const result: ApiResponse<ResumeData> = await response.json();

            if (!result.success) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(result.error || "Không thể lấy thông tin CV");
            }

            return result.data || null;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Tạo CV mới
     */
    const createResume = useCallback(async (params: {
        templateId?: string;
        title?: string;
        resumeData?: Partial<ResumeData>;
    } = {}): Promise<ResumeData> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });
            const result: ApiResponse<ResumeData> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Không thể tạo CV");
            }

            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Cập nhật CV
     */
    const updateResume = useCallback(async (
        id: string, 
        data: Partial<ResumeData>
    ): Promise<ResumeData> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result: ApiResponse<ResumeData> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Không thể cập nhật CV");
            }

            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Xóa CV (soft delete)
     */
    const deleteResume = useCallback(async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}`, {
                method: "DELETE",
            });
            const result: ApiResponse<void> = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Không thể xóa CV");
            }

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Sao chép CV
     */
    const duplicateResume = useCallback(async (id: string): Promise<ResumeData> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}/duplicate`, {
                method: "POST",
            });
            const result: ApiResponse<ResumeData> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Không thể sao chép CV");
            }

            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        clearError: () => setError(null),
        fetchResumes,
        fetchResume,
        createResume,
        updateResume,
        deleteResume,
        duplicateResume,
    };
}

// =====================================================
// Debounced Auto-save Hook
// Hook để tự động lưu CV với debounce
// =====================================================

import { useRef, useEffect } from "react";

export function useAutoSave(
    resumeId: string | null,
    resumeData: ResumeData | null,
    isAuthenticated: boolean,
    debounceMs: number = 2000
) {
    const { updateResume } = useResumesApi();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedRef = useRef<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

    useEffect(() => {
        if (!resumeId || !resumeData || !isAuthenticated) {
            return;
        }

        // Tạo hash để so sánh thay đổi
        const dataHash = JSON.stringify(resumeData);
        
        // Nếu data chưa thay đổi, không cần save
        if (lastSavedRef.current === dataHash) {
            return;
        }

        // Clear timeout cũ
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set timeout mới
        timeoutRef.current = setTimeout(async () => {
            try {
                setIsSaving(true);
                await updateResume(resumeId, resumeData);
                lastSavedRef.current = dataHash;
                setLastSavedAt(new Date());
            } catch (error) {
                console.error("Auto-save failed:", error);
            } finally {
                setIsSaving(false);
            }
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [resumeId, resumeData, isAuthenticated, debounceMs, updateResume]);

    return { isSaving, lastSavedAt };
}
