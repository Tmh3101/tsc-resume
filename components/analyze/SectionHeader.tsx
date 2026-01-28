import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: {
    tone?: "orange" | "deep-blue" | "emerald";
    Icon?: LucideIcon;
  };
  title: string;
  eyebrow?: string;
  badge?: {
    label: string;
    value: number;
  };
  description?: string;
}

const iconPalette: Record<"orange" | "deep-blue" | "emerald", string> = {
  orange: "bg-[var(--orange)]/10 text-[var(--orange)]",
  "deep-blue": "bg-[var(--deep-blue)]/10 text-[var(--deep-blue)]",
  emerald: "bg-emerald-50 text-emerald-600",
};

const SectionHeader = ({
  icon,
  title,
  eyebrow,
  badge,
  description,
}: SectionHeaderProps) => {
  const iconTone: "orange" | "deep-blue" | "emerald" = icon?.tone ?? "orange";
  return (
    <div className="flex w-full items-center justify-between gap-3 py-1">
      <div className="flex flex-1 items-start gap-3 sm:gap-4 min-w-0">
        {icon && icon.Icon && (
          <span
            className={cn(
              "inline-flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-lg",
              iconPalette[iconTone],
            )}
          >
            <icon.Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        )}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {eyebrow && (
            <span className="eyebrow-tsc">
              {eyebrow}
            </span>
          )}
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--deep-blue)] break-words">{title}</h2>
          {description && (
            <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-[var(--muted-foreground)]">{description}</p>
          )}
        </div>
      </div>

      {badge && (
        <div className="stat-badge shrink-0 self-center">
          <span className="stat-badge__label">
            {badge.label}
          </span>
          <span className="stat-badge__value">
            {badge.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
