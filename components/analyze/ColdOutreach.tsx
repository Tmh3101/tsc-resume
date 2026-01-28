"use client";

import { useEffect, useState } from "react";
import { Copy, Check, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import RegenerateColdDMModal from "./RegenerateColdDMModal";

interface ColdOutreachProps {
  message: string;
  resumeId: string;
}

const ColdOutreach = ({ message, resumeId }: ColdOutreachProps) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    setCurrentMessage(message);
    setCopied(false);
  }, [message]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      toast.success("Đã sao chép", {
        description: "Tin nhắn đã sẵn sàng để dán vào LinkedIn.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Sao chép thất bại", {
        description: "Vui lòng thử chọn và sao chép văn bản thủ công.",
      });
    }
  };

  const handleRegenerate = async (userFeedback: string) => {
    setIsRegenerating(true);
    const toastId = toast.loading("Đang tạo lại tin nhắn...");

    try {
      const response = await fetch("/api/resume-analyze/regenerate-dm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId, userFeedback }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data.coldOutreachMessage) {
        const errorMessage =
          data?.error || "Không thể tạo lại tin nhắn. Vui lòng thử lại.";
        throw new Error(errorMessage);
      }

      setCurrentMessage(data.coldOutreachMessage);
      setCopied(false);
      setIsModalOpen(false);

      toast.success("Đã cập nhật tin nhắn", {
        description: "Xem lại và tùy chỉnh trước khi gửi.",
        id: toastId,
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Vui lòng thử lại.";
      toast.error("Tạo lại thất bại", {
        description,
        id: toastId,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="group relative">
          <div className="message-box">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
              {currentMessage}
            </div>
          </div>
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="action-btn opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
              type="button"
              aria-label="Sao chép tin nhắn tiếp cận"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Đã chép" : "Chép"}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              disabled={isRegenerating}
              aria-label="Tạo lại tin nhắn tiếp cận"
              className="action-btn action-btn--icon opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="insight-card flex-col !items-start">
          <p className="font-semibold text-[var(--deep-blue)]">Mẹo</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Trước khi gửi, hãy thêm một dòng đề cập đến thông báo gần đây của công ty, 
            dự án, hoặc điều gì đó cụ thể từ hồ sơ của người quản lý tuyển dụng để nổi bật hơn.
          </p>
        </div>
      </div>

      <RegenerateColdDMModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleRegenerate}
        isLoading={isRegenerating}
      />
    </>
  );
};

export default ColdOutreach;
