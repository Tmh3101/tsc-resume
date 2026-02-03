"use client";
import { useMemo } from "react";
import { GlobalSettings } from "@/types/resume";
import { useResumeStore } from "@/store/useResumeStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import { cn } from "@/lib/utils";
import { templateConfigs } from "@/config/templates";

interface SectionTitleProps {
  globalSettings?: GlobalSettings;
  type: string;
  title?: string;
  showTitle?: boolean;
}

const SectionTitle = ({ type, title, globalSettings, showTitle = true }: SectionTitleProps) => {
  const { activeResume } = useResumeStore();
  const templates = useTemplateStore((state) => state.templates);
  const { menuSections = [], templateId = "default" } = activeResume || {};

  // Lấy template và layout từ store
  const template = useMemo(() => {
    return templates.find((t) => t.id === templateId) || null;
  }, [templates, templateId]);
  const templateLayout = template?.layout || "default";

  const renderTitle = useMemo(() => {
    if (type === "custom") {
      return title;
    }
    const sectionConfig = menuSections.find((s) => s.id === type);
    return sectionConfig?.title;
  }, [menuSections, type, title]);

  const config =
    templateConfigs[templateLayout as string] || templateConfigs["default"];
  const { styles } = config.sectionTitle;

  const themeColor = globalSettings?.themeColor;

  const baseStyles = useMemo(
    () => ({
      fontSize: `${globalSettings?.headerSize || styles.fontSize}px`,
      fontWeight: "bold",
      color: themeColor,
      marginBottom: `${globalSettings?.paragraphSpacing}px`,
    }),
    [
      globalSettings?.headerSize,
      globalSettings?.paragraphSpacing,
      styles.fontSize,
      themeColor,
    ]
  );

  const renderTemplateTitle = () => {
    if (!showTitle) return null;
    switch (templateLayout) {
      case "modern":
        return (
          <h3
            className={cn("border-b pb-2")}
            style={{
              ...baseStyles,
              borderColor: themeColor,
            }}
          >
            {renderTitle}
          </h3>
        );

      case "left-right":
        const pagePadding = globalSettings?.pagePadding || 32;
        return (
          <h3
            className={cn("py-1 pl-3")}
            style={{
              ...baseStyles,
              color: themeColor,
              backgroundColor: `${themeColor}25`,
              borderLeft: `4px solid ${themeColor}`,
            }}
          >
            {renderTitle}
          </h3>
        );

      case "classic":
        return (
          <h3
            className={cn("pb-2 border-b")}
            style={{
              ...baseStyles,
              color: themeColor,
              borderColor: themeColor,
            }}
          >
            {renderTitle}
          </h3>
        );

      default:
        return (
          <h3
            className={cn("pb-2")}
            style={{
              ...baseStyles,
              color: themeColor,
            }}
          >
            {renderTitle}
          </h3>
        );
    }
  };

  return renderTemplateTitle();
};

export default SectionTitle;
