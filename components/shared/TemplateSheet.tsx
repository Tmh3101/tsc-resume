"use client";
import { useEffect } from "react";
import { Layout, PanelsLeftBottom, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet-no-overlay";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import { ResumeTemplate } from "@/types/template";
import fallbackImage from "@/assets/images/template-thumbnail-placeholder.jpg";

// Helper function to get template image with fallback
function getTemplateImage(template: ResumeTemplate): string {
  // Nếu có thumbnail_url từ Supabase Storage, dùng nó
  if (template.thumbnail_url && template.thumbnail_url.startsWith('http')) {
    return template.thumbnail_url;
  }
  // Fallback về static image (sử dụng .src vì đây là StaticImageData)
  return fallbackImage.src;
}

const TemplateSheet = () => {
  const { activeResume, setTemplate } = useResumeStore();
  const templates = useTemplateStore((state) => state.templates);
  const fetchTemplates = useTemplateStore((state) => state.fetchTemplates);
  const isLoading = useTemplateStore((state) => state.isLoading);

  // Fetch templates khi sheet mở
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const currentTemplate =
    templates.find((t) => t.id === activeResume?.templateId) ||
    templates[0];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <PanelsLeftBottom size={18} />
      </SheetTrigger>
      <SheetContent side="left" className="w-1/2 sm:max-w-1/2">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            <span className="text-orange">Chọn</span> mẫu CV
          </SheetTitle>
        </SheetHeader>

        {/* Giải quyết cảnh báo */}
        <SheetDescription></SheetDescription>

        <div className="grid grid-cols-3 gap-4 px-4">
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange" />
            </div>
          ) : templates.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Không có mẫu CV nào
            </div>
          ) : (
            templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02]",
                  t.id === currentTemplate?.id
                    ? "border-orange dark:border-orange shadow-lg shadow-orange/20 dark:shadow-orange/30"
                    : "dark:border-neutral-800 dark:hover:border-neutral-700 border-gray-100 hover:border-orange/50"
                )}
              >
                <img
                  src={getTemplateImage(t)}
                  alt={t.name}
                  className="w-full h-auto"
                />
                {t.id === currentTemplate?.id && (
                  <motion.div
                    layoutId="template-selected"
                    className="absolute inset-0 flex items-center justify-center bg-orange/20 dark:bg-orange/30"
                  >
                    <Layout className="w-6 h-6 text-white dark:text-orange" />
                  </motion.div>
                )}
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSheet;
