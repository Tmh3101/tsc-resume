"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import Field from "../Field";

const SkillPanel = () => {
  const { activeResume, updateSkillContent } = useResumeStore();
  const { skillContent } = activeResume || {};
  const handleChange = (value: string) => {
    updateSkillContent(value);
  };

  return (
    <div
      className={cn(
        "rounded-lg border",
        "bg-white",
        "border-gray-100"
      )}
    >
      <Field
        value={skillContent || ""}
        onChange={handleChange}
        type="editor"
        placeholder="Mô tả kỹ năng, chuyên môn của bạn..."
      />
    </div>
  );
};

export default SkillPanel;
