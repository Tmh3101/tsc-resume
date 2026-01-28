import { useState } from "react";
import { CheckCheck, Copy, ListChecks, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LineImprovement } from "@/types";

interface DiffCardProps {
  improvement: LineImprovement;
  onApply?: (improvementId: string) => void;
  isApplied?: boolean;
}

const getPriorityStyles = (priority: LineImprovement["priority"]) => {
  switch (priority) {
    case "high":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Cảnh báo",
      };
    case "medium":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Trung bình",
      };
    case "low":
      return {
        bg: "bg-[var(--deep-blue)]/10",
        text: "text-[var(--deep-blue)]",
        label: "Thấp",
      };
  }
};

const getCategoryLabel = (category: LineImprovement["category"]) => {
  switch (category) {
    case "quantify":
      return "Thêm số liệu";
    case "action-verb":
      return "Động từ mạnh";
    case "keyword":
      return "Từ khóa phù hợp";
    case "clarity":
      return "Rõ ràng hơn";
    case "ats":
      return "Tương thích ATS";
  }
};

const DiffCard = ({
  improvement,
  onApply,
  isApplied = false,
}: DiffCardProps) => {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(isApplied);
  const priorityStyles = getPriorityStyles(improvement.priority);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(improvement.suggested);
      setCopied(true);
      toast.success("Đã sao chép!", {
        description: "Gợi ý đã được sao chép vào clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Sao chép thất bại", {
        description: "Không thể sao chép vào clipboard",
      });
    }
  };

  const handleApply = () => {
    setApplied(!applied);
    onApply?.(improvement.sectionTitle + improvement.original);
    toast.success(applied ? "Đã bỏ đánh dấu" : "Đã đánh dấu áp dụng", {
      description: applied
        ? "Đã bỏ đánh dấu cải thiện"
        : "Tuyệt vời! Nhớ cập nhật CV của bạn",
    });
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm",
        applied && "ring-2 ring-emerald-200",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--deep-blue)]/5 px-4 py-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
          <span className="font-semibold uppercase text-[var(--deep-blue)]">
            {improvement.sectionTitle}
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] font-semibold",
              priorityStyles.bg,
              priorityStyles.text,
            )}
          >
            {priorityStyles.label}
          </span>
          <span className="rounded-md bg-[var(--orange)]/15 px-2 py-0.5 text-[11px] font-semibold text-[var(--orange)]">
            {getCategoryLabel(improvement.category)}
          </span>
          {applied && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <CheckCheck className="h-3 w-3" />
              Đã áp dụng
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-[var(--deep-blue)] transition hover:bg-[var(--deep-blue)]/10"
            type="button"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Đã chép" : "Chép"}
          </button>
          <button
            onClick={handleApply}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition",
              applied
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-[var(--muted-foreground)] hover:bg-[var(--deep-blue)]/5",
            )}
            type="button"
          >
            {applied ? (
              <Undo2 className="h-4 w-4" />
            ) : (
              <ListChecks className="h-4 w-4" />
            )}
            {applied ? "Hoàn tác" : "Đánh dấu"}
          </button>
        </div>
      </div>
      <div className="divide-y divide-[var(--border)] text-sm">
        <div className="diff-block diff-block--original">
          <div className="diff-line minus">{improvement.original}</div>
        </div>
        <div className="diff-block diff-block--suggested">
          <div className="diff-line plus font-medium">
            {improvement.suggested}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--orange)]/20 bg-[var(--orange)]/5 px-4 py-3 text-sm text-[var(--deep-blue)]">
        {improvement.reason}
      </div>
    </div>
  );
};

export default DiffCard;
