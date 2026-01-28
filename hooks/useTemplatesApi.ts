import { useState, useCallback } from "react";
import { ResumeTemplate } from "@/types/template";

// =====================================================
// useTemplatesApi Hook
// Hook để gọi API templates
// =====================================================

interface UseTemplatesApiReturn {
    templates: ResumeTemplate[];
    isLoading: boolean;
    error: string | null;
    fetchTemplates: (options?: { includePremium?: boolean }) => Promise<ResumeTemplate[]>;
    getTemplateById: (id: string) => Promise<ResumeTemplate | null>;
}

export function useTemplatesApi(): UseTemplatesApiReturn {
    const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch tất cả templates
     */
    const fetchTemplates = useCallback(async (options?: { includePremium?: boolean }): Promise<ResumeTemplate[]> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = new URLSearchParams();
            if (options?.includePremium) {
                params.set("includePremium", "true");
            }

            const url = `/api/resume-templates${params.toString() ? `?${params.toString()}` : ""}`;
            const response = await fetch(url);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Không thể tải danh sách mẫu CV");
            }

            setTemplates(result.data);
            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
            setError(message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Lấy template theo ID
     */
    const getTemplateById = useCallback(async (id: string): Promise<ResumeTemplate | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resume-templates/${id}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Không tìm thấy mẫu CV");
            }

            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        templates,
        isLoading,
        error,
        fetchTemplates,
        getTemplateById,
    };
}
