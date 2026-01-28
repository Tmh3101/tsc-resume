"use client";

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmLoadingLabel?: string;
  isLoading?: boolean;
  confirmVariant?: "primary" | "danger";
}

const ModalActions = ({
  onCancel,
  onConfirm,
  cancelLabel = "Hủy",
  confirmLabel = "Xác nhận",
  confirmLoadingLabel,
  isLoading = false,
  confirmVariant = "primary",
}: ModalActionsProps) => {
  const confirmClasses =
    confirmVariant === "danger"
      ? "border-red-200/70 bg-red-600 hover:bg-red-700 focus-visible:ring-red-200/70"
      : "border-[var(--orange)]/70 bg-[var(--orange)] hover:bg-[var(--orange)]/90 focus-visible:ring-[var(--orange)]/70";

  return (
    <div className="flex gap-3 pt-2">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--deep-blue)] transition-all hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[var(--deep-blue)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmClasses}`}
      >
        {isLoading ? confirmLoadingLabel || confirmLabel : confirmLabel}
      </button>
    </div>
  );
};

export default ModalActions;
