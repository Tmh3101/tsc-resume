"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import DiffCard from "./DiffCard";
import type { LineImprovement } from "@/types";
import { toast } from "sonner";

interface LineByLineImprovementsProps {
  improvements: LineImprovement[];
}

const LineByLineImprovements = ({
  improvements,
}: LineByLineImprovementsProps) => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  // Group improvements by section
  const groupedImprovements = useMemo(() => {
    const groups: Record<string, LineImprovement[]> = {};

    improvements.forEach((improvement) => {
      const section = improvement.section;
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(improvement);
    });

    // Sort sections in a logical order
    const sectionOrder: Array<LineImprovement["section"]> = [
      "summary",
      "experience",
      "education",
      "skills",
      "other",
    ];

    return sectionOrder
      .filter((section) => groups[section]?.length > 0)
      .map((section) => ({
        section,
        improvements: groups[section],
      }));
  }, [improvements]);

  // Get section display name
  const getSectionDisplayName = (section: LineImprovement["section"]) => {
    switch (section) {
      case "summary":
        return "Tóm tắt";
      case "experience":
        return "Kinh nghiệm";
      case "education":
        return "Học vấn";
      case "skills":
        return "Kỹ năng";
      case "other":
        return "Khác";
    }
  };

  const handleApply = (improvementId: string) => {
    setAppliedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(improvementId)) {
        newSet.delete(improvementId);
      } else {
        newSet.add(improvementId);
      }
      return newSet;
    });
  };

  const handleCopyAll = async () => {
    const allSuggestions = improvements
      .map((imp) => `${imp.sectionTitle}:\n${imp.suggested}`)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(allSuggestions);
      toast.success("Đã sao chép tất cả!", {
        description: "Dán vào trình soạn thảo CV của bạn",
      });
    } catch (error) {
      toast.error("Sao chép thất bại", {
        description: "Không thể sao chép tất cả gợi ý",
      });
    }
  };

  // Calculate stats
  const totalImprovements = improvements.length;
  const appliedCount = appliedIds.size;
  const highPriorityCount = improvements.filter(
    (imp) => imp.priority === "high",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats and Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--orange)]/20 bg-[var(--orange)]/5 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="bg-green-600 px-3 py-1 rounded-full">
            <span className="font-semibold text-white">
              {totalImprovements} gợi ý cải thiện
            </span>
          </div>
          {highPriorityCount > 0 && (
            <div className="bg-red-600 px-3 py-1 rounded-full">
              <span className="font-semibold text-white">
                {highPriorityCount} cảnh báo
              </span>
            </div>
          )}
          {appliedCount > 0 && (
            <>
              <span className="text-[var(--border)]">•</span>
              <div>
                <span className="font-semibold text-green-600">
                  {appliedCount}
                </span>
                <span className="ml-1 text-[var(--muted-foreground)]">đã áp dụng</span>
              </div>
            </>
          )}
        </div>
        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--deep-blue)]/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--deep-blue)] transition-all hover:bg-[var(--deep-blue)]/5"
          type="button"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Chép tất cả
        </button>
      </div>

      {/* Grouped Improvements by Section */}
      <Accordion
        className="space-y-3"
        defaultOpen={groupedImprovements[0]?.section}
        allowMultiple
      >
        {groupedImprovements.map(({ section, improvements: sectionImps }) => (
          <AccordionItem
            key={section}
            id={`improvements-${section}`}
            className="border-[var(--border)]"
          >
            <AccordionHeader itemId={`improvements-${section}`}>
              <div className="flex w-full items-center justify-between gap-3">
                <span className="text-base font-semibold text-[var(--deep-blue)]">
                  {getSectionDisplayName(section)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--orange)]/15 px-3 py-1 text-xs font-semibold text-[var(--orange)]">
                    {sectionImps.length} gợi ý
                  </span>
                </div>
              </div>
            </AccordionHeader>
            <AccordionContent itemId={`improvements-${section}`}>
              <div className="space-y-4 pt-2">
                {sectionImps.map((improvement, index) => (
                  <DiffCard
                    key={`${section}-${index}`}
                    improvement={improvement}
                    onApply={handleApply}
                    isApplied={appliedIds.has(
                      improvement.sectionTitle + improvement.original,
                    )}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Help Text */}
      <div className="insight-card flex-col !items-start">
        <p className="font-semibold text-[var(--deep-blue)]">Cách sử dụng các gợi ý này</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Mỗi gợi ý hiển thị đoạn văn bản cần thay thế. Sao chép từng cải thiện một, 
          hoặc sử dụng "Chép tất cả" để lấy mọi thứ cùng lúc. Tập trung vào các thay đổi 
          ưu tiên cao trước để có tác động lớn nhất đến điểm ATS của bạn.
        </p>
      </div>
    </div>
  );
};

export default LineByLineImprovements;
