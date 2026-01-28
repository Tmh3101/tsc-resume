"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Loader2 } from "lucide-react";

// =====================================================
// File Upload Component - Drag & Drop file upload
// =====================================================

interface FileUploadProps {
    label?: string;
    accept?: string;
    maxSizeMB?: number;
    error?: string;
    helperText?: string;
    required?: boolean;
    value?: File | null;
    onChange: (file: File | null) => void;
    isUploading?: boolean;
    variant?: "default" | "glass";
}

const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export function FileUpload({
    label,
    maxSizeMB = 5,
    error,
    helperText,
    required,
    value,
    onChange,
    isUploading = false,
    variant = "default",
}: FileUploadProps) {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [localError, setLocalError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isGlass = variant === "glass";

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validateFile = (file: File): boolean => {
        setLocalError(null);

        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setLocalError(`Chỉ chấp nhận file ${ALLOWED_EXTENSIONS.join(", ")}`);
            return false;
        }

        // Check file size
        if (file.size > maxSizeBytes) {
            setLocalError(`File phải nhỏ hơn ${maxSizeMB}MB`);
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            onChange(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        onChange(null);
        setLocalError(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const displayError = error || localError;

    return (
        <div className="w-full">
            {/* Label */}
            {label && (
                <label className={`block text-base font-medium mb-2 ${isGlass ? "text-white/90" : "text-gray-700"}`}>
                    {label}
                    {required && <span className="text-orange ml-1">*</span>}
                </label>
            )}

            {/* Upload Area */}
            {!value ? (
                <motion.div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                    animate={{
                        borderColor: isDragOver ? "#f29427" : displayError ? "#ef4444" : isGlass ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                        backgroundColor: isDragOver 
                            ? "rgba(242, 148, 39, 0.1)" 
                            : isGlass 
                                ? "rgba(255, 255, 255, 0.1)" 
                                : "white",
                    }}
                    className={`
                        relative cursor-pointer
                        border-2 border-dashed rounded-xl p-16
                        transition-all duration-200
                        flex flex-col items-center justify-center
                        text-center
                        hover:border-orange hover:bg-orange/10
                        ${isGlass ? "backdrop-blur-sm" : ""}
                    `}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ALLOWED_EXTENSIONS.join(",")}
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isGlass ? "bg-orange/20" : "bg-orange/10"}`}>
                        <Upload className="w-7 h-7 text-orange" />
                    </div>

                    <p className={`font-medium mb-1 ${isGlass ? "text-white" : "text-gray-700"}`}>
                        Kéo thả file vào đây hoặc <span className="text-orange">chọn file</span>
                    </p>
                    <p className={`text-sm ${isGlass ? "text-white/60" : "text-gray-400"}`}>
                        PDF, DOC, DOCX (tối đa {maxSizeMB}MB)
                    </p>
                </motion.div>
            ) : (
                // File Selected Preview
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`border-2 rounded-xl p-4 flex items-center gap-4 ${
                        isGlass 
                            ? "border-green-400/50 bg-green-500/20 backdrop-blur-sm" 
                            : "border-green-200 bg-green-50"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isGlass ? "bg-green-500/30" : "bg-green-100"
                    }`}>
                        {isUploading ? (
                            <Loader2 className={`w-6 h-6 animate-spin ${isGlass ? "text-green-300" : "text-green-600"}`} />
                        ) : (
                            <FileText className={`w-6 h-6 ${isGlass ? "text-green-300" : "text-green-600"}`} />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isGlass ? "text-white" : "text-gray-900"}`}>{value.name}</p>
                        <p className={`text-sm ${isGlass ? "text-white/60" : "text-gray-500"}`}>
                            {isUploading
                                ? "Đang tải lên..."
                                : `${(value.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                    </div>

                    {!isUploading && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                                isGlass ? "hover:bg-red-500/20" : "hover:bg-red-100"
                            }`}
                        >
                            <X className={`w-5 h-5 ${isGlass ? "text-red-300" : "text-red-500"}`} />
                        </button>
                    )}
                </motion.div>
            )}

            {/* Error Message */}
            {displayError && (
                <p className={`mt-2 text-sm ${isGlass ? "text-red-300" : "text-red-500"}`}>{displayError}</p>
            )}

            {/* Helper Text */}
            {helperText && !displayError && (
                <p className={`mt-2 text-sm ${isGlass ? "text-white/60" : "text-gray-500"}`}>{helperText}</p>
            )}
        </div>
    );
}
