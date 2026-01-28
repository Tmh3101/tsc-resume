"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import { cn, formatSize } from "@/lib/utils";
import { toast } from "sonner";
import { Upload, FileText, X, Link } from "lucide-react";
import BaseModal from "./BaseModal";

interface ImportJobModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onImportUrl: (url: string) => Promise<void>;
  onImportPdf: (file: File) => Promise<void>;
}

const ImportJobModal = ({
  isOpen,
  onCancel,
  onImportUrl,
  onImportPdf,
}: ImportJobModalProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const maxFileSize = 10 * 1024 * 1024;

  const handleRejection = useCallback((rejectedFiles: FileRejection[]) => {
    const rejection = rejectedFiles[0];
    const rejectionError = rejection?.errors?.[0];

    let message = rejectionError?.message || "Vui lòng tải lên file PDF hợp lệ.";

    if (rejectionError?.code === "file-too-large") {
      message = "Vui lòng tải lên PDF nhỏ hơn 10 MB.";
      toast.error("File quá lớn", {
        description: message,
      });
    } else if (rejectionError?.code === "file-invalid-type") {
      message = "Chỉ hỗ trợ file PDF.";
      toast.error("Loại file không hợp lệ", {
        description: message,
      });
    } else {
      toast.error("Lỗi tải lên", {
        description: message,
      });
    }

    setFileError(message);
    setFile(null);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (isLoading) return;

      if (rejectedFiles.length > 0) {
        handleRejection(rejectedFiles);
        return;
      }

      const selectedFile = acceptedFiles[0] || null;
      setFile(selectedFile);
      setFileError("");
      if (selectedFile) {
        setUrl("");
        setError("");
      }
    },
    [isLoading, handleRejection],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
    disabled: isLoading,
  });

  const handleSubmitUrl = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Vui lòng nhập URL hợp lệ");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onImportUrl(url.trim());
      setUrl("");
      setError("");
      setFile(null);
      setFileError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể import từ URL",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPdf = async () => {
    if (!file) {
      setFileError("Vui lòng tải lên file PDF");
      return;
    }

    setIsLoading(true);
    setFileError("");

    try {
      await onImportPdf(file);
      setUrl("");
      setError("");
      setFile(null);
      setFileError("");
    } catch (err) {
      setFileError(
        err instanceof Error ? err.message : "Không thể import từ PDF",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    setUrl("");
    setError("");
    setFile(null);
    setFileError("");
    onCancel();
  };

  const hasUrl = Boolean(url.trim());
  const hasFile = Boolean(file);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      maxWidth="lg"
      contentClassName="space-y-6"
    >
      <div className="space-y-2 pr-8">
        <h2 className="text-xl font-bold text-deep-blue">Import tự động</h2>
        <p className="text-sm text-muted">
          Nhập URL trang tuyển dụng hoặc tải lên PDF mô tả công việc. 
          Chúng tôi sẽ tự động trích xuất thông tin cần thiết.
        </p>
      </div>

      <form id="job-url-form" onSubmit={handleSubmitUrl} className="space-y-4">
        <div className="input-wrapper">
          <label htmlFor="job-url" className="input-label flex items-center gap-2">
            <Link className="w-4 h-4 text-orange" />
            URL trang tuyển dụng
          </label>
          <input
            type="url"
            id="job-url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (e.target.value.trim()) {
                setFile(null);
                setFileError("");
              }
            }}
            placeholder="https://example.com/careers/senior-developer"
            className="input-field"
            disabled={isLoading}
          />
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-muted tracking-wider font-medium">
            Hoặc
          </span>
        </div>
      </div>

      <div className="input-wrapper">
        <label className="input-label flex items-center gap-2">
          <FileText className="w-4 h-4 text-deep-blue" />
          PDF mô tả công việc
        </label>
        <div
          {...getRootProps({
            className: cn(
              "uploader-dropzone",
              isDragActive && "border-orange bg-orange/5",
              fileError && !file && "border-red-300 bg-red-50/30",
              isLoading && "cursor-not-allowed opacity-60",
            ),
          })}
        >
          <input
            {...getInputProps({
              "aria-label": "Tải lên PDF mô tả công việc",
              "aria-invalid": Boolean(fileError),
            })}
          />

          {!file && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="uploader-dropzone__icon">
                <Upload className="h-6 w-6 text-orange" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-deep-blue">
                  {isDragActive
                    ? "Thả file PDF ở đây"
                    : "Click để tải lên hoặc kéo thả"}
                </p>
                <p className="text-sm text-muted">PDF, tối đa {formatSize(maxFileSize)}</p>
              </div>
            </div>
          )}

          {file && (
            <div
              className="flex items-center justify-between w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange/10 to-deep-blue/10 rounded-lg">
                  <FileText className="h-5 w-5 text-orange" />
                </div>
                <div className="text-left">
                  <p
                    className="text-sm font-medium text-deep-blue"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-gray-50 hover:text-deep-blue transition-colors"
                onClick={() => {
                  setFile(null);
                  setFileError("");
                }}
              >
                <X className="h-3 w-3" />
                Xóa
              </button>
            </div>
          )}
        </div>
        {fileError && (
          <p className="text-sm text-red-600" role="alert">
            {fileError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {(hasUrl || hasFile) && (
          <button
            type={hasUrl ? "submit" : "button"}
            form={hasUrl ? "job-url-form" : undefined}
            onClick={hasFile ? handleSubmitPdf : undefined}
            disabled={isLoading}
            className="order-1 w-full primary-button sm:order-2 sm:flex-1"
          >
            {isLoading
              ? "Đang import..."
              : hasUrl
                ? "Import từ URL"
                : "Import từ PDF"}
          </button>
        )}
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="order-2 w-full secondary-button sm:order-1 sm:flex-1"
        >
          Hủy
        </button>
      </div>
    </BaseModal>
  );
};

export default ImportJobModal;
