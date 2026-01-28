"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { cn, formatSize } from "@/lib/utils";
import { Upload, FileText, X } from "lucide-react";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  onErrorChange?: (message: string) => void;
  error?: string;
  disabled?: boolean;
  inputId?: string;
}

const FileUploader = ({
  onFileSelect,
  onErrorChange,
  error,
  disabled,
  inputId,
}: FileUploaderProps) => {
  const maxFileSize = 20 * 1024 * 1024;

  const handleRejection = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const rejection = rejectedFiles[0];
      const rejectionError = rejection?.errors?.[0];

      let message =
        rejectionError?.message || "Vui lòng tải lên file PDF hợp lệ.";

      if (rejectionError?.code === "file-too-large") {
        message = "Vui lòng tải lên PDF nhỏ hơn 20 MB.";
        toast.error("File quá lớn", {
          description: message,
        });
      } else if (rejectionError?.code === "file-invalid-type") {
        message = "Chỉ hỗ trợ file PDF. Vui lòng tải lên CV dạng PDF.";
        toast.error("Loại file không hợp lệ", {
          description: message,
        });
      } else {
        toast.error("Lỗi tải lên", {
          description: message,
        });
      }

      onErrorChange?.(message);
      onFileSelect?.(null);
    },
    [onErrorChange, onFileSelect],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (disabled) return;

      if (rejectedFiles.length > 0) {
        handleRejection(rejectedFiles);
        return;
      }

      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
      onErrorChange?.("");
    },
    [disabled, handleRejection, onErrorChange, onFileSelect],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
    disabled,
  });

  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setIsCleared(false);
    }
  }, [acceptedFiles]);

  const file = isCleared ? null : acceptedFiles[0] || null;
  const rejection = fileRejections[0];

  const hasError = Boolean(error);

  const helperId = inputId ? `${inputId}-error` : undefined;

  return (
    <div
      className="uploader surface-card surface-card--tight"
      role="group"
      aria-label="Tải CV lên"
    >
      <div
        {...getRootProps({
          className: cn(
            "uploader-dropzone",
            isDragActive && "border-indigo-300 bg-indigo-50/60",
            hasError && !file && "border-red-300 bg-red-50/30",
            disabled && "cursor-not-allowed opacity-60",
          ),
        })}
      >
        <input
          {...getInputProps({
            "aria-label": "Tải CV PDF",
            id: inputId,
            "aria-invalid": hasError,
            "aria-describedby": hasError && helperId ? helperId : undefined,
          })}
        />

        {!file && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="uploader-dropzone__icon">
              <Upload className="h-8 w-8 text-orange" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-deep-blue">
                {isDragActive
                  ? "Thả file CV của bạn"
                  : "Click để tải lên hoặc kéo thả"}
              </p>
              <p className="text-sm text-muted">PDF, tối đa {formatSize(maxFileSize)}</p>
            </div>
          </div>
        )}

        {file && (
          <div
            className="uploader-selected-file"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange/10 to-deep-blue/10 rounded-xl">
                <FileText className="h-6 w-6 text-orange" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p
                  className="text-sm font-medium text-deep-blue truncate max-w-full"
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
              className="flex-shrink-0 flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-gray-50 hover:text-deep-blue transition-colors"
              onClick={() => {
                setIsCleared(true);
                onFileSelect?.(null);
                onErrorChange?.("");
              }}
            >
              <X className="h-3 w-3" />
              Xóa
            </button>
          </div>
        )}
      </div>

      {(() => {
        const helperMessage = error || rejection?.errors?.[0]?.message;
        if (!helperMessage) return null;

        const tone = error ? "text-red-600" : "text-amber-600";

        return (
          <p
            id={helperId}
            className={cn("mt-3 text-sm font-semibold", tone)}
            role="alert"
          >
            {helperMessage}
          </p>
        );
      })()}
    </div>
  );
};

export default FileUploader;
