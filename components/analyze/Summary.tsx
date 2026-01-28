import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";
import type { Feedback } from "@/types";

const buildCategoryCopy = (
  title: string,
  summary: string | undefined,
): string => {
  if (summary && summary.trim().length > 0) {
    return summary;
  }

  switch (title) {
    case "Giọng văn":
      return "Đảm bảo ngôn ngữ phù hợp với văn hóa công ty và đọc tự nhiên.";
    case "Nội dung":
      return "Nêu bật tác động có thể đo lường, thành tích liên quan và từ khóa phù hợp.";
    case "Cấu trúc":
      return "Giữ bố cục dễ quét với các phần và khoảng cách nhất quán.";
    case "Kỹ năng":
      return "Liệt kê các khả năng và công cụ cụ thể theo vai trò phù hợp với mô tả công việc.";
    default:
      return "Tập trung vào các cải thiện có thể thực hiện để nâng cao điểm số này.";
  }
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    {
      title: "Giọng văn",
      score: feedback.toneAndStyle.score,
      highlight: feedback.toneAndStyle.tips?.[0]?.tip,
    },
    {
      title: "Nội dung",
      score: feedback.content.score,
      highlight: feedback.content.tips?.[0]?.tip,
    },
    {
      title: "Cấu trúc",
      score: feedback.structure.score,
      highlight: feedback.structure.tips?.[0]?.tip,
    },
    {
      title: "Kỹ năng",
      score: feedback.skills.score,
      highlight: feedback.skills.tips?.[0]?.tip,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col justify-center gap-4">
          <h2 className="text-2xl font-semibold text-[var(--deep-blue)]">
            Hiệu suất CV
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Mỗi danh mục bên dưới đóng góp vào điểm tổng thể. Cải thiện các 
            điểm yếu nhất trước để đạt tiến bộ nhanh nhất.
          </p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <li
            key={category.title}
            className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-white/90 px-5 py-4 shadow-[var(--shadow-ring)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-[var(--deep-blue)]">
                {category.title}
              </p>
              <ScoreBadge score={category.score} size="sm" />
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {buildCategoryCopy(category.title, category.highlight)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Summary;
