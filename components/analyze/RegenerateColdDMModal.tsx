"use client";

import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import ModalActions from "./ModalActions";
import { RefreshCcw } from "lucide-react";

interface RegenerateColdDMModalProps {
  isOpen: boolean;
  onConfirm: (feedback: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const RegenerateColdDMModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: RegenerateColdDMModalProps) => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFeedback("");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      setError("Vui lòng cung cấp phản hồi để tạo lại");
      return;
    }
    if (trimmed.length < 10) {
      setError("Phản hồi phải có ít nhất 10 ký tự");
      return;
    }
    if (trimmed.length > 500) {
      setError("Phản hồi phải dưới 500 ký tự");
      return;
    }
    setError("");
    onConfirm(trimmed);
  };

  const handleCancel = () => {
    setFeedback("");
    setError("");
    onCancel();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleCancel} maxWidth="lg">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--orange)]/10">
            <RefreshCcw className="h-5 w-5 text-[var(--orange)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--deep-blue)]">
              Tạo lại tin nhắn tiếp cận
            </h2>
          </div>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Cho AI biết bạn muốn cải thiện tin nhắn như thế nào. Hãy cụ thể 
          về những thay đổi bạn muốn (giọng điệu, cấu trúc, điểm nhấn...).
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="feedback"
          className="input-label"
        >
          Phản hồi của bạn
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setError("");
          }}
          placeholder="Ví dụ: Làm ngắn gọn hơn và nhấn mạnh kinh nghiệm backend của tôi..."
          className="textarea-field min-h-[100px] resize-y"
          disabled={isLoading}
          maxLength={500}
        />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <p className="text-xs text-[var(--muted-foreground)]">
          {feedback.length}/500 ký tự
        </p>
      </div>

      <ModalActions
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        cancelLabel="Hủy bỏ"
        confirmLabel="Tạo lại"
        confirmLoadingLabel="Đang tạo..."
        isLoading={isLoading}
      />
    </BaseModal>
  );
};

export default RegenerateColdDMModal;
