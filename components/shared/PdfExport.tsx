"use client";

import { useState, useRef } from "react";
import {
  Download,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";

const getOptimizedStyles = () => {
  const styleCache = new Map();
  const startTime = performance.now();

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .filter((rule) => {
            const ruleText = rule.cssText;
            if (styleCache.has(ruleText)) return false;
            styleCache.set(ruleText, true);

            if (rule instanceof CSSFontFaceRule) return false;
            if (ruleText.includes("font-family")) return false;
            if (ruleText.includes("@keyframes")) return false;
            if (ruleText.includes("animation")) return false;
            if (ruleText.includes("transition")) return false;
            if (ruleText.includes("hover")) return false;
            return true;
          })
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        console.warn("Style processing error:", e);
        return "";
      }
    })
    .join("\n");

  console.log(`Style processing took ${performance.now() - startTime}ms`);
  return styles;
};

const optimizeImages = async (element: HTMLElement) => {
  const startTime = performance.now();
  const images = element.getElementsByTagName("img");

  const imagePromises = Array.from(images)
    .filter((img) => !img.src.startsWith("data:"))
    .map(async (img) => {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result as string;
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Image conversion error:", error);
        return Promise.resolve();
      }
    });

  await Promise.all(imagePromises);
  console.log(`Image processing took ${performance.now() - startTime}ms`);
};

const PdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { activeResume } = useResumeStore();
  const { globalSettings = {}, title } = activeResume || {};

  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const handleExport = async () => {
    const exportStartTime = performance.now();
    setIsExporting(true);

    try {
      const pdfElement = document.querySelector<HTMLElement>("#resume-preview");
      if (!pdfElement) {
        throw new Error("PDF element not found");
      }

      const clonedElement = pdfElement.cloneNode(true) as HTMLElement;

      const pageBreakLines =
        clonedElement.querySelectorAll<HTMLElement>(".page-break-line");
      pageBreakLines.forEach((line) => {
        line.style.display = "none";
      });

      const [styles] = await Promise.all([
        getOptimizedStyles(),
        optimizeImages(clonedElement)
      ]);

      const response = await fetch("/api/resumes/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: clonedElement.outerHTML,
          styles,
          margin: globalSettings.pagePadding || 0
        }),
        signal: AbortSignal.timeout(45000)
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
      console.log(`Total export took ${performance.now() - exportStartTime}ms`);
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Export error:", error);
      handlePrint();
      // toast.error("Xuất PDF thất bại!");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!printFrameRef.current) {
      console.error("Print frame not found");
      toast.error("Khung in không khả dụng");
      return;
    }

    const resumeContent = document.getElementById("resume-preview");
    if (!resumeContent) {
      console.error("Resume content not found");
      toast.error("Nội dung CV không tìm thấy");
      return;
    }

    const actualContent = resumeContent.parentElement;
    if (!actualContent) {
      console.error("Actual content not found");
      toast.error("Nội dung thực tế không tìm thấy");
      return;
    }

    const pagePadding = globalSettings?.pagePadding;
    const iframeWindow = printFrameRef.current.contentWindow;
    if (!iframeWindow) {
      console.error("IFrame window not found");
      toast.error("Cửa sổ iframe không tìm thấy");
      return;
    }

    try {
      iframeWindow.document.open();
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @font-face {
                font-family: "Alibaba PuHuiTi";
                src: url("/fonts/AlibabaPuHuiTi-3-55-Regular.ttf") format("truetype");
                font-weight: normal;
                font-style: normal;
                font-display: swap;
              }

              @page {
                size: A4;
                margin: 0;
                padding: 0;
              }

              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              html, body {
                width: 100%;
                height: 100%;
                background: white;
                margin: 0;
                padding: 0;
              }

              body {
                font-family: "Alibaba PuHuiTi", sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                line-height: 1.6;
              }

              #resume-preview {
                padding: 0 !important;
                margin: 0 !important;
              }

              #print-content {
                width: 210mm;
                height: 297mm;
                margin: 0 auto;
                padding: ${pagePadding}px;
                background: white;
                box-sizing: border-box;
              }

              #print-content * {
                box-shadow: none !important;
                transform: none !important;
                scale: 1 !important;
              }

              .scale-90 {
                transform: none !important;
              }
              
              .page-break-line {
                display: none;
              }

              ${Array.from(document.styleSheets)
                .map((sheet) => {
                  try {
                    return Array.from(sheet.cssRules)
                      .map((rule) => rule.cssText)
                      .join("\n");
                  } catch (e) {
                    console.warn("Could not copy styles from sheet:", e);
                    return "";
                  }
                })
                .join("\n")}
            </style>
          </head>
          <body>
            <div id="print-content">
              ${actualContent.innerHTML}
            </div>
          </body>
        </html>
      `;

      iframeWindow.document.write(htmlContent);
      iframeWindow.document.close();

      setTimeout(() => {
        try {
          iframeWindow.focus();
          iframeWindow.print();
        } catch (error) {
          console.error("Error during print:", error);
          toast.error("Lỗi khi in tài liệu");
        }
      }, 500);
    } catch (error) {
      console.error("Error setting up print:", error);
      toast.error("Lỗi cấu hình in");
    }
  };

  return (
    <>
    <Button
      onClick={handlePrint}
      disabled={isExporting}
      className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang xuất...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Xuất file</span>
        </>
      )}
    </Button>
    <iframe
        ref={printFrameRef}
        style={{
          position: "absolute",
          width: "210mm",
          height: "297mm",
          visibility: "hidden",
          zIndex: -1
        }}
        title="Print Frame"
      />
    </>
  );
};

export default PdfExport;