import { create } from "zustand";
import { ResumeTemplate } from "@/types/template";

// =====================================================
// useTemplateStore
// Store để quản lý templates
// =====================================================

interface TemplateStore {
    // State
    templates: ResumeTemplate[];
    isLoading: boolean;
    isLoaded: boolean;
    error: string | null;

    // Actions
    fetchTemplates: () => Promise<void>;
    getTemplateById: (id: string) => ResumeTemplate | undefined;
    setTemplates: (templates: ResumeTemplate[]) => void;
    reset: () => void;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
    // Initial state
    templates: [],
    isLoading: false,
    isLoaded: false,
    error: null,

    /**
     * Fetch templates từ API
     */
    fetchTemplates: async () => {
        const state = get();
        
        // Nếu đã load rồi hoặc đang load, không fetch lại
        if (state.isLoaded || state.isLoading) {
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const response = await fetch("/api/resume-templates");
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Không thể tải danh sách mẫu CV");
            }

            set({
                templates: result.data,
                isLoading: false,
                isLoaded: true,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
            set({
                error: message,
                isLoading: false,
            });
            console.error("Error fetching templates:", err);
        }
    },

    /**
     * Lấy template theo ID
     */
    getTemplateById: (id: string) => {
        return get().templates.find((t) => t.id === id);
    },

    /**
     * Set templates trực tiếp (cho testing hoặc SSR)
     */
    setTemplates: (templates: ResumeTemplate[]) => {
        set({ templates, isLoaded: true });
    },

    /**
     * Reset store
     */
    reset: () => {
        set({
            templates: [],
            isLoading: false,
            isLoaded: false,
            error: null,
        });
    },
}));
