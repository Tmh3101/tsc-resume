"use client";

import { useEffect, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { FileText, ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PreviewCV({ resumeId }: { resumeId: string }) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCvUrl() {
      try {
        const response = await fetch(`/api/resume-analyze/resume/${resumeId}/preview`);
        if (!response.ok) {
          if (!cancelled) {
            setFetchError(true);
            setIsLoading(false);
          }
          return;
        }

        const result = await response.json();
        if (result.success && result.cvUrl && !cancelled) {
          setCvUrl(result.cvUrl);
        } else if (!cancelled) {
          setFetchError(true);
        }
      } catch {
        if (!cancelled) {
          setFetchError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchCvUrl();

    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  // Measure container width for responsive PDF
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(node);
      return () => resizeObserver.disconnect();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 bg-[var(--deep-blue)]/5 p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)] border-t-transparent" />
        <p className="text-sm text-[var(--muted-foreground)]">Đang tải CV...</p>
      </div>
    );
  }

  if (fetchError || !cvUrl) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 bg-[var(--deep-blue)]/5 p-6">
        <div className="rounded-full bg-[var(--deep-blue)]/10 p-4">
          <FileText className="h-10 w-10 text-[var(--deep-blue)]/50" />
        </div>
        <div className="text-center">
          <p className="font-medium text-[var(--deep-blue)]">CV không có sẵn</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Không thể tải CV đã phân tích
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-2">
      {/* PDF Viewer */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-auto rounded-lg bg-gray-100 mb-2" 
        style={{ minHeight: '350px' }}
      >
        <Document
          file={cvUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex h-full min-h-[350px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)] border-t-transparent" />
            </div>
          }
          error={
            <div className="flex h-full min-h-[350px] flex-col items-center justify-center gap-2 p-4">
              <FileText className="h-8 w-8 text-[var(--deep-blue)]/50" />
              <p className="text-sm text-[var(--muted-foreground)]">Không thể tải PDF</p>
            </div>
          }
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            width={containerWidth > 0 ? Math.min(containerWidth - 32, 600) : undefined}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Controls */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] bg-white/90 px-2 py-2 rounded-lg">
        {/* Pagination */}
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="rounded-md p-1.5 text-[var(--deep-blue)] transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[60px] text-center text-xs text-[var(--muted-foreground)]">
            {pageNumber} / {numPages || "..."}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="rounded-md p-1.5 text-[var(--deep-blue)] transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="rounded-md p-1.5 text-[var(--deep-blue)] transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[45px] text-center text-xs text-[var(--muted-foreground)]">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.0}
            className="rounded-md p-1.5 text-[var(--deep-blue)] transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Phóng to"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Open in new tab */}
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--orange)] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--orange)]/90"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Mở tab mới</span>
        </a>
      </div>
    </div>
  );
}
