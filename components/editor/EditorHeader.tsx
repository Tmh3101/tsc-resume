"use client";
import { AlertCircle, Cloud, CloudOff, Loader2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import PdfExport from "../shared/PdfExport";
import { useResumeStore } from "@/store/useResumeStore";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "./AutoSaveProvider";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// =====================================================
// Editor Header - Header của trang chỉnh sửa CV
// =====================================================

interface EditorHeaderProps {
    isMobile?: boolean;
}

export function EditorHeader({ isMobile }: EditorHeaderProps) {
    const { activeResume, setActiveSection, updateResumeTitle, duplicateResume, activeResumeId } =
        useResumeStore();
    const { menuSections = [], activeSection } = activeResume || {};
    const router = useRouter();

    const handleCopyResume = () => {
        if (!activeResumeId) return;
        try {
            const newId = duplicateResume(activeResumeId);
            toast.success("Tạo bản sao CV thành công!");
            router.push(`/workbench/${newId}`);
        } catch (error) {
            toast.error("Tạo bản sao CV thất bại!");
        }
    };

    const visibleSections = menuSections
        ?.filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <motion.header
            className="h-14 border-b border-white/10 sticky top-0 z-10 bg-deep-blue shadow-lg"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
        >
            <div className="flex items-center justify-between px-4 h-full">
                <div className="flex items-center space-x-6 scrollbar-hide">
                    <motion.div
                        className="flex items-center gap-3 shrink-0 cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            router.push("/dashboard");
                        }}
                    >
                        <Image
                            src="/logo-tsc.png"
                            alt="TSC Logo"
                            width={36}
                            height={36}
                            className="rounded-md"
                        />
                        <span className="text-lg font-bold text-white">
                            <span className="text-orange">T</span>SC
                        </span>
                    </motion.div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* TODO: Grammar check feature - cần triển khai useGrammarCheck hook
                    {errors.length > 0 && (
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <div className="flex items-center space-x-1 cursor-pointer">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-red-500">
                                        Phát hiện {errors.length} vấn đề
                                    </span>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Kết quả kiểm tra ngữ pháp</h4>
                                    <div className="space-y-1">
                                        {errors.map((error: any, index: number) => (
                                            <div key={index} className="text-sm space-y-1">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p>{error.message}</p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2 text-xs"
                                                                onClick={() => selectError(index)}
                                                            >
                                                                Định vị
                                                            </Button>
                                                        </div>
                                                        {error.suggestions.length > 0 && (
                                                            <div className="mt-1">
                                                                <p className="text-xs text-muted-foreground font-medium">
                                                                    Gợi ý sửa:
                                                                </p>
                                                                {error.suggestions.map((suggestion: string, i: number) => (
                                                                    <p
                                                                        key={i}
                                                                        className="text-xs mt-1 px-2 py-1 bg-muted rounded"
                                                                    >
                                                                        {suggestion}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    )}
                    */}
                    <Input
                        defaultValue={activeResume?.title || ""}
                        onBlur={(e) => {
                            updateResumeTitle(e.target.value || "CV chưa đặt tên");
                        }}
                        className="w-52 h-9 text-sm hidden md:block border-white/20 rounded-lg focus:border-orange focus:ring-orange/20 bg-white/10 text-white placeholder:text-white/50"
                        placeholder="Tên CV"
                    />
                    
                    {/* Copy Resume Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handleCopyResume}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Tạo bản sao CV</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Auto-save status */}
                    <AutoSaveIndicator />
                    
                    <div className="md:flex items-center">
                        <PdfExport />
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

// Auto-save status indicator
function AutoSaveIndicator() {
    try {
        const { isSaving, lastSavedAt, error } = useAutoSave();

        if (error) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/20 text-red-300 text-xs">
                                <CloudOff className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Lỗi</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Không thể lưu: {error}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        if (isSaving) {
            return (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange/20 text-orange-300 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">Đang lưu...</span>
                </div>
            );
        }

        if (lastSavedAt) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/20 text-green-300 text-xs">
                                <Cloud className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Đã lưu</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Lưu lần cuối: {lastSavedAt.toLocaleTimeString("vi-VN")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return null;
    } catch {
        // AutoSaveProvider not available (user not logged in or not in workbench)
        return null;
    }
}
