import { cn } from "@/lib/utils";
import { Check, AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import ScoreBadge from "./ScoreBadge";
import type { Feedback } from "@/types";

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-[var(--deep-blue)]">{title}</span>
        <ScoreBadge score={categoryScore} size="sm" showScore={false} />
      </div>
      <span className="category-score-pill">
        {categoryScore}/100
      </span>
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  if (!tips || tips.length === 0) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">
        Chưa có khuyến nghị nào cho mục này. Chạy lại phân tích để cập nhật hướng dẫn.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid gap-3 sm:grid-cols-2">
        {tips.map((tip, index) => (
          <li
            key={`summary-${index}-${tip.tip}`}
            className="insight-card"
          >
            <span
              className={cn(
                "insight-icon",
                tip.type === "good" ? "insight-icon--good" : "insight-icon--improve",
              )}
            >
              {tip.type === "good" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </span>
            <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
              <p className="font-semibold text-[var(--deep-blue)]">{tip.tip}</p>
              <p>{tip.explanation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <Accordion className="space-y-3" defaultOpen="tone-style" allowMultiple>
      <AccordionItem id="tone-style">
        <AccordionHeader itemId="tone-style">
          <CategoryHeader
            title="Giọng văn & Phong cách"
            categoryScore={feedback.toneAndStyle.score}
          />
        </AccordionHeader>
        <AccordionContent itemId="tone-style">
          <CategoryContent tips={feedback.toneAndStyle.tips} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem id="content">
        <AccordionHeader itemId="content">
          <CategoryHeader
            title="Nội dung"
            categoryScore={feedback.content.score}
          />
        </AccordionHeader>
        <AccordionContent itemId="content">
          <CategoryContent tips={feedback.content.tips} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem id="structure">
        <AccordionHeader itemId="structure">
          <CategoryHeader
            title="Cấu trúc"
            categoryScore={feedback.structure.score}
          />
        </AccordionHeader>
        <AccordionContent itemId="structure">
          <CategoryContent tips={feedback.structure.tips} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem id="skills">
        <AccordionHeader itemId="skills">
          <CategoryHeader
            title="Kỹ năng"
            categoryScore={feedback.skills.score}
          />
        </AccordionHeader>
        <AccordionContent itemId="skills">
          <CategoryContent tips={feedback.skills.tips} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Details;
