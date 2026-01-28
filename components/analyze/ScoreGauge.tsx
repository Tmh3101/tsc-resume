"use client";

import { useEffect, useId, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const percentage = Math.max(0, Math.min(score, 100)) / 100;
  const gradientId = useId();

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div className="surface-card flex flex-col items-center gap-4 bg-gradient-to-b from-[var(--orange)]/10 via-white to-white">
      <div
        className="relative h-32 w-56"
        role="img"
        aria-label={`Điểm tổng thể CV ${score} trên 100`}
      >
        <svg viewBox="0 0 100 60" className="h-full w-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--orange)" />
              <stop offset="100%" stopColor="var(--deep-blue)" />
            </linearGradient>
          </defs>
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="rgba(14, 57, 99, 0.1)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="drop-shadow-[0_12px_30px_rgba(242,148,39,0.25)]"
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 pt-10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)] leading-none">
            Tổng thể
          </span>
          <span className="text-3xl font-bold leading-none text-[var(--deep-blue)] mt-1">
            {score}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)] leading-none">
            /100
          </span>
        </div>
      </div>
      <p className="max-w-xs text-center text-sm text-[var(--muted-foreground)]">
        Điểm số này kết hợp giọng văn, nội dung, cấu trúc và kỹ năng thành một 
        chỉ số đánh giá tổng thể cho CV hiện tại của bạn.
      </p>
    </div>
  );
};

export default ScoreGauge;
