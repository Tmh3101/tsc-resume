"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Eye, 
    Edit,
    X, 
    LayoutTemplate,
    Palette,
    Loader2
} from "lucide-react";

import { AuthOverlay } from "@/components/dashboard/AuthOverlay";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useResumeStore } from "@/store/useResumeStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import { useResumesApi } from "@/hooks/useResumesApi";
import { ResumeTemplate } from "@/types/template";
import { cn } from "@/lib/utils";

// Template cover images
import fallbackImage from "@/assets/images/template-thumbnail-placeholder.jpg";

// Helper function to get template image with fallback
function getTemplateImage(template: ResumeTemplate): string | StaticImageData {
    // Nếu có thumbnail_url từ Supabase Storage, dùng nó
    if (template.thumbnail_url && template.thumbnail_url.startsWith('http')) {
        return template.thumbnail_url;
    }
    // Fallback về static images
    return fallbackImage;
}

// Template metadata với tiếng Việt
const templateMeta: Record<string, { name: string; description: string; tags: string[] }> = {
    classic: {
        name: "Classic",
        description: "Thiết kế truyền thống, phù hợp với mọi ngành nghề",
        tags: ["Chuyên nghiệp", "Đơn giản"],
    },
    modern: {
        name: "Modern",
        description: "Bố cục 2 cột hiện đại, nổi bật cá tính",
        tags: ["Hiện đại", "2 cột"],
    },
    leftRight: {
        name: "Highlight",
        description: "Tiêu đề module nổi bật với màu sắc bắt mắt",
        tags: ["Sáng tạo", "Nổi bật"],
    },
    timeline: {
        name: "Timeline",
        description: "Bố cục dòng thời gian, thể hiện rõ quá trình phát triển",
        tags: ["Timeline", "Có tổ chức"],
    },
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

// Template Card Component
interface TemplateCardProps {
    template: ResumeTemplate;
    onPreview: () => void;
    onSelect: () => void;
    isCreating?: boolean;
}

function TemplateCard({ template, onPreview, onSelect, isCreating }: TemplateCardProps) {
    const meta = templateMeta[template.id] || {
        name: template.name,
        description: template.description,
        tags: [],
    };

    return (
        <motion.div
            variants={itemVariants}
            className="group relative h-full"
        >
            <div className={cn(
                "relative bg-white rounded-2xl overflow-hidden h-full",
                "border border-gray-200 hover:border-orange",
                "shadow-md hover:shadow-2xl hover:shadow-orange/20",
                "transition-all duration-300 hover:-translate-y-1",
                "flex flex-col"
            )}>
                {/* Template Preview Image */}
                <div className="relative aspect-[210/280] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
                    {/* Image */}
                    <div className="h-full w-full p-3 transition-transform duration-500 group-hover:scale-[1.02]">
                        <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-200">
                            <Image
                                src={getTemplateImage(template)}
                                alt={meta.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority
                                unoptimized={typeof getTemplateImage(template) === 'string'}
                            />
                        </div>
                    </div>

                    {/* Hover Overlay - Desktop only */}
                    <div className={cn(
                        "absolute inset-0 hidden sm:flex",
                        "bg-gradient-to-t from-deep-blue/95 via-deep-blue/60 to-transparent",
                        "opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-300",
                        "flex-col justify-end p-4"
                    )}>
                        {/* Color palette on hover */}
                        <div className="flex gap-1.5 mb-3">
                            {Object.values(template.colorScheme).slice(0, 4).map((color, i) => (
                                <div
                                    key={`color-${template.id}-${i}`}
                                    className="w-5 h-5 rounded-full border-2 border-white/50 shadow-sm"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <p className="text-white text-sm leading-relaxed font-medium">
                            {meta.description}
                        </p>
                    </div>
                </div>

                {/* Card Footer - Template Info */}
                <div className="p-4 bg-white border-t border-gray-100 flex flex-col flex-grow">
                    {/* Header: Name + Tags */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-deep-blue">
                            {meta.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 justify-end">
                            {meta.tags.map((tag, index) => (
                                <span
                                    key={`tag-${template.id}-${index}`}
                                    className="px-2 py-0.5 text-xs font-medium bg-orange/10 text-orange rounded-full whitespace-nowrap"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {meta.description}
                    </p>

                    {/* Color palette - Mobile */}
                    <div className="flex items-center gap-3 mb-4 sm:hidden">
                        <span className="text-xs text-gray-500">Màu sắc:</span>
                        <div className="flex gap-1">
                            {Object.values(template.colorScheme).slice(0, 4).map((color, i) => (
                                <div
                                    key={`mobile-color-${template.id}-${i}`}
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-auto">
                        <button
                            onClick={onPreview}
                            disabled={isCreating}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2",
                                "px-4 py-2.5 rounded-xl",
                                "bg-gray-50 border border-gray-200",
                                "text-gray-700 text-sm font-semibold",
                                "hover:bg-deep-blue hover:text-white hover:border-deep-blue",
                                "transition-all duration-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            <Eye className="w-4 h-4" />
                            Xem
                        </button>
                        <button
                            onClick={onSelect}
                            disabled={isCreating}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2",
                                "px-4 py-2.5 rounded-xl",
                                "bg-gradient-to-r from-orange to-orange-light",
                                "text-white text-sm font-semibold",
                                "shadow-md shadow-orange/25",
                                "hover:shadow-lg hover:shadow-orange/40 hover:scale-[1.02]",
                                "transition-all duration-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            )}
                        >
                            {isCreating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Edit className="w-4 h-4" />
                            )}
                            {isCreating ? "Đang tạo..." : "Sửa"}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Preview Modal Component
interface PreviewModalProps {
    template: ResumeTemplate | null;
    onClose: () => void;
    onSelect: () => void;
}

function PreviewModal({ template, onClose, onSelect }: PreviewModalProps) {
    if (!template) return null;

    const meta = templateMeta[template.id] || {
        name: template.name,
        description: template.description,
        tags: [],
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="preview-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-deep-blue-dark/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
                key="preview-modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
                <div 
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with gradient - giống LoginModal */}
                    <div className="relative bg-gradient-to-br from-deep-blue via-deep-blue-light to-orange/80 px-6 py-6">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Đóng"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        {/* Template Info */}
                        <div className="pr-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <LayoutTemplate className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">{meta.name}</h3>
                            </div>
                            <p className="text-white/80 text-sm mb-3">{meta.description}</p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {meta.tags.map((tag, index) => (
                                    <span
                                        key={`preview-tag-${template.id}-${index}`}
                                        className="px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Image */}
                    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 flex items-center justify-center">
                        <div className="relative w-full max-w-md aspect-[210/297] rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                            <Image
                                src={getTemplateImage(template)}
                                alt={meta.name}
                                fill
                                className="object-contain bg-white"
                                priority
                                unoptimized={typeof getTemplateImage(template) === 'string'}
                            />
                        </div>
                    </div>

                    {/* Footer with actions */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-white">
                        {/* Color palette */}
                        <div className="flex items-center gap-3 mb-4">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Bảng màu:</span>
                            <div className="flex gap-2">
                                {Object.values(template.colorScheme).map((color, i) => (
                                    <div
                                        key={`preview-color-${template.id}-${i}`}
                                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                        style={{ backgroundColor: color }}
                                        title={`Color ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onClose}
                                className={cn(
                                    "flex-1 px-6 py-3 rounded-xl",
                                    "bg-gray-50 border border-gray-200 text-gray-700 font-semibold",
                                    "hover:bg-gray-100 transition-colors"
                                )}
                            >
                                Đóng
                            </button>
                            <button
                                onClick={onSelect}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2",
                                    "px-6 py-3 rounded-xl",
                                    "bg-gradient-to-r from-orange to-orange-light",
                                    "text-white font-semibold",
                                    "shadow-lg shadow-orange/30",
                                    "hover:shadow-xl hover:scale-[1.02]",
                                    "transition-all duration-300"
                                )}
                            >
                                <Edit className="w-5 h-5" />
                                Sử dụng template này
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Main Templates Content
function TemplatesContent() {
    const router = useRouter();
    const { isAuthenticated } = useDashboard();
    const createLocalResume = useResumeStore((state) => state.createResume);
    const addResume = useResumeStore((state) => state.addResume);
    const setActiveResume = useResumeStore((state) => state.setActiveResume);
    const { createResume: createRemoteResume, isLoading } = useResumesApi();
    
    // Load templates từ store
    const templates = useTemplateStore((state) => state.templates);
    const fetchTemplates = useTemplateStore((state) => state.fetchTemplates);
    const isTemplatesLoading = useTemplateStore((state) => state.isLoading);
    const isTemplatesLoaded = useTemplateStore((state) => state.isLoaded);
    
    const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
    const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null);

    // Fetch templates khi component mount
    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleCreateResume = async (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (!template) return;

        setCreatingTemplate(templateId);

        try {
            if (isAuthenticated) {
                // Tạo CV trên server nếu đã đăng nhập
                const newResume = await createRemoteResume({ templateId });
                
                // Thêm vào local store và điều hướng
                addResume(newResume);
                setActiveResume(newResume.id);
                router.push(`/workbench/${newResume.id}`);
            } else {
                // Tạo CV local nếu chưa đăng nhập
                const resumeId = createLocalResume(templateId);
                const { resumes, updateResume } = useResumeStore.getState();
                const resume = resumes[resumeId];

                if (resume) {
                    updateResume(resumeId, {
                        globalSettings: {
                            ...resume.globalSettings,
                            themeColor: template.colorScheme.primary,
                            sectionSpacing: template.spacing.sectionGap,
                            paragraphSpacing: template.spacing.itemGap,
                            pagePadding: template.spacing.contentPadding,
                        },
                        basic: {
                            ...resume.basic,
                            layout: template.basic.layout,
                        },
                    });
                }

                router.push(`/workbench/${resumeId}`);
            }
        } catch (error) {
            console.error("Failed to create resume:", error);
            // Fallback to local creation
            const resumeId = createLocalResume(templateId);
            router.push(`/workbench/${resumeId}`);
        } finally {
            setCreatingTemplate(null);
        }
    };

    return (
        <div className="min-h-full bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-br from-orange to-orange-light rounded-xl">
                            <LayoutTemplate className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Chọn mẫu CV
                        </h1>
                    </div>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Chọn một template phù hợp với phong cách của bạn. 
                        Tất cả các template đều có thể tùy chỉnh màu sắc, font chữ và bố cục.
                    </p>
                </div>

                {/* Templates Grid */}
                {isTemplatesLoading && !isTemplatesLoaded ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-orange" />
                        <span className="ml-3 text-gray-600">Đang tải mẫu CV...</span>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        Không có mẫu CV nào.
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {templates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onPreview={() => setPreviewTemplate(template)}
                                onSelect={() => handleCreateResume(template.id)}
                                isCreating={creatingTemplate === template.id}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <PreviewModal
                    template={previewTemplate}
                    onClose={() => setPreviewTemplate(null)}
                    onSelect={() => {
                        handleCreateResume(previewTemplate.id);
                        setPreviewTemplate(null);
                    }}
                />
            )}
        </div>
    );
}

export default function TemplatesPage() {
    return (
        <AuthOverlay>
            <TemplatesContent />
        </AuthOverlay>
    );
}
