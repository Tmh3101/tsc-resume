import { Check, AlertTriangle } from "lucide-react";
import ScoreBadge from "./ScoreBadge";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const normalizedScore = Math.max(0, Math.min(score, 100));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* <ScoreBadge score={normalizedScore} /> */}
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${normalizedScore}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[var(--muted-foreground)]">
            Điểm số này đánh giá mức độ tương thích của CV với ATS. 
            Hãy giữ trên 80 điểm để đảm bảo CV được nhận diện tốt bởi các nhà tuyển dụng.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="eyebrow-tsc">
          Khuyến nghị
        </h3>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${index}`}
              className="insight-card"
            >
              <span
                className={`insight-icon ${suggestion.type === "good" ? "insight-icon--good" : "insight-icon--improve"}`}
              >
                {suggestion.type === "good" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </span>
              <p className={`text-sm mt-2 ${suggestion.type === "good" ? "text-green-600" : "text-[var(--orange)]"}`}>{suggestion.tip}</p>
            </li>
          ))}
        </ul>
        {suggestions.length === 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Chưa có khuyến nghị nào. Chạy lại phân tích sau khi cập nhật để xem 
            điểm ATS thay đổi như thế nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default ATS;
