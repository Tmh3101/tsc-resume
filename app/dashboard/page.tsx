"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthOverlay } from "@/components/dashboard/AuthOverlay";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useResumesApi } from "@/hooks/useResumesApi";
import { useResumeStore } from "@/store/useResumeStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";
import { 
    Plus, 
    FileText, 
    Search, 
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Clock,
    Copy,
    Loader2,
    RefreshCw,
    AlertCircle,
    LayoutTemplate,
    ArrowRight
} from "lucide-react";

// =====================================================
// Dashboard Page - Quản lý CV
// Trang chính hiển thị danh sách CV của người dùng
// =====================================================

// Template names
const templateNames: Record<string, string> = {
    classic: "Classic",
    modern: "Modern",
    leftRight: "Highlight",
    timeline: "Timeline",
};

// Format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString("vi-VN");
}

// =====================================================
// CV Card Component
// =====================================================

interface CVCardProps {
    resume: ResumeData;
    onEdit: () => void;
    onPreview: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

function CVCard({ resume, onEdit, onPreview, onDelete, onDuplicate }: CVCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const templateId = resume.templateId || "classic";
    const templateName = templateNames[templateId] || "Classic";

    return (
        <div className="group h-full bg-white rounded-xl border border-gray-200 hover:border-orange/50 hover:shadow-lg hover:shadow-orange/10 transition-all duration-300 flex flex-col overflow-hidden">
            {/* Content */}
            <div className="p-4 flex-grow flex flex-col">
                {/* Title */}
                <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-orange transition-colors text-base">
                        {resume.title}
                    </h3>
                </div>

                {/* Template info */}
                <div className="flex items-center gap-2 pb-4">
                    <LayoutTemplate className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{templateName}</span>
                </div>

                {/* Last updated */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Cập nhật {formatRelativeTime(resume.updatedAt)}</span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="p-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-1">
                    <button 
                        onClick={onPreview}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        title="Xem trước"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={onEdit}
                        className="p-2 rounded-lg text-gray-600 hover:bg-orange/10 hover:text-orange transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>

                {/* More menu */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="fixed w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50" 
                            style={{
                                top: menuRef.current ? menuRef.current.getBoundingClientRect().bottom + 4 : 0,
                                left: menuRef.current ? menuRef.current.getBoundingClientRect().right - 176 : 0,
                            }}
                        >
                            <button 
                                onClick={() => { onPreview(); setShowMenu(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Xem trước</span>
                            </button>
                            <button 
                                onClick={() => { onEdit(); setShowMenu(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>Chỉnh sửa</span>
                            </button>
                            <button 
                                onClick={() => { onDuplicate(); setShowMenu(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <Copy className="w-4 h-4" />
                                <span>Sao chép</span>
                            </button>
                            <hr className="my-1" />
                            <button 
                                onClick={() => { onDelete(); setShowMenu(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Xóa</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// =====================================================
// Empty State Component
// =====================================================

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
    return (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-6">
                <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có CV nào
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Bắt đầu tạo CV đầu tiên của bạn từ các template chuyên nghiệp.
            </p>
            <button
                onClick={onCreateClick}
                className="
                    inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-gradient-to-r from-orange to-orange-light
                    text-white font-semibold shadow-lg shadow-orange/30
                    hover:shadow-xl hover:scale-105 transition-all duration-300
                "
            >
                <Plus className="w-5 h-5" />
                Tạo CV mới
            </button>
        </div>
    );
}

// =====================================================
// Loading State Component
// =====================================================

function LoadingState() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-orange animate-spin" />
                <p className="text-gray-500">Đang tải danh sách CV...</p>
            </div>
        </div>
    );
}

// =====================================================
// Error State Component
// =====================================================

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không thể tải danh sách CV
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {message}
            </p>
            <button
                onClick={onRetry}
                className="
                    inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-gray-100 text-gray-700 font-semibold
                    hover:bg-gray-200 transition-colors
                "
            >
                <RefreshCw className="w-5 h-5" />
                Thử lại
            </button>
        </div>
    );
}

// =====================================================
// Delete Confirmation Modal
// =====================================================

function DeleteModal({ 
    resume, 
    onConfirm, 
    onCancel,
    isDeleting 
}: { 
    resume: ResumeData; 
    onConfirm: () => void; 
    onCancel: () => void;
    isDeleting: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa CV?</h3>
                <p className="text-gray-500 mb-6">
                    Bạn có chắc chắn muốn xóa CV <span className="font-semibold text-gray-900">&quot;{resume.title}&quot;</span>? 
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

// =====================================================
// Main Dashboard Content
// =====================================================

function DashboardContent() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useDashboard();
    const { 
        fetchResumes, 
        deleteResume: deleteResumeApi, 
        duplicateResume: duplicateResumeApi,
        isLoading: apiLoading, 
        error: apiError 
    } = useResumesApi();
    const setActiveResume = useResumeStore((state) => state.setActiveResume);
    const addResume = useResumeStore((state) => state.addResume);
    
    // Load templates khi vào dashboard
    const fetchTemplates = useTemplateStore((state) => state.fetchTemplates);

    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<ResumeData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch resumes on mount
    const loadResumes = useCallback(async () => {
        if (!isAuthenticated) {
            setIsInitialLoading(false);
            return;
        }

        try {
            const result = await fetchResumes({ search: searchQuery });
            setResumes(result.resumes);
        } catch (error) {
            console.error("Failed to fetch resumes:", error);
        } finally {
            setIsInitialLoading(false);
        }
    }, [isAuthenticated, fetchResumes, searchQuery]);

    useEffect(() => {
        if (!authLoading) {
            loadResumes();
        }
    }, [authLoading, isAuthenticated, loadResumes]);

    // Load templates khi component mount
    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated && !isInitialLoading) {
                loadResumes();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, isAuthenticated, isInitialLoading, loadResumes]);

    // Handle create new
    const handleCreateNew = () => {
        router.push("/dashboard/templates");
    };

    // Handle edit
    const handleEdit = (resume: ResumeData) => {
        // Add to local store and navigate
        addResume(resume);
        setActiveResume(resume.id);
        router.push(`/workbench/${resume.id}`);
    };

    // Handle preview (same as edit for now)
    const handlePreview = (resume: ResumeData) => {
        handleEdit(resume);
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            await deleteResumeApi(deleteTarget.id);
            setResumes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            console.error("Failed to delete resume:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle duplicate
    const handleDuplicate = async (resume: ResumeData) => {
        try {
            const newResume = await duplicateResumeApi(resume.id);
            setResumes((prev) => [newResume, ...prev]);
        } catch (error) {
            console.error("Failed to duplicate resume:", error);
        }
    };

    // Calculate stats
    const totalResumes = resumes.length;

    // Render states
    if (authLoading || isInitialLoading) {
        return <LoadingState />;
    }

    if (apiError && resumes.length === 0) {
        return <ErrorState message={apiError} onRetry={loadResumes} />;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Quản lý CV
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {user ? `Xin chào, ${user.user_metadata?.full_name || user.email}` : "Tạo và quản lý các CV của bạn"}
                    </p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="
                        inline-flex items-center justify-center gap-2 
                        px-5 py-2.5 rounded-xl
                        bg-gradient-to-r from-orange to-orange-light
                        text-white font-semibold
                        shadow-lg shadow-orange/25
                        hover:shadow-xl hover:scale-105 
                        transition-all duration-300
                    "
                >
                    <Plus className="w-5 h-5" />
                    <span>Tạo CV mới</span>
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm CV..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all"
                    />
                </div>
                <button 
                    onClick={loadResumes}
                    disabled={apiLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", apiLoading && "animate-spin")} />
                    <span>Làm mới</span>
                </button>
            </div>

            {/* CV Grid or Empty State */}
            {resumes.length === 0 ? (
                <EmptyState onCreateClick={handleCreateNew} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {resumes.map((resume) => (
                        <CVCard
                            key={resume.id}
                            resume={resume}
                            onEdit={() => handleEdit(resume)}
                            onPreview={() => handlePreview(resume)}
                            onDelete={() => setDeleteTarget(resume)}
                            onDuplicate={() => handleDuplicate(resume)}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <DeleteModal
                    resume={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}

// =====================================================
// Export
// =====================================================

export default function DashboardPage() {
    return (
        <AuthOverlay>
            <DashboardContent />
        </AuthOverlay>
    );
}
