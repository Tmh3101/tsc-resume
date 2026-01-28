"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  contentClassName?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const BaseModal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
  contentClassName,
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-blue-dark/60 backdrop-blur-sm animate-in p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "surface-card relative w-full space-y-6",
          maxWidthClasses[maxWidth],
          contentClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
