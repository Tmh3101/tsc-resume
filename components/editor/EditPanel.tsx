"use client";

import { motion } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import BasicPanel from "./basic/BasicPanel";
import EducationPanel from "./education/EducationPanel";
import ProjectPanel from "./project/ProjectPanel";
import ExperiencePanel from "./experience/ExperiencePanel";
import CustomPanel from "./custom/CustomPanel";
import SkillPanel from "./skills/SkillPanel";

export function EditPanel() {
  const { activeResume, updateMenuSections } = useResumeStore();
  if (!activeResume) return;
  const { activeSection = "", menuSections = [] } = activeResume || {};

  const renderFields = () => {
    switch (activeSection) {
      case "basic":
        return <BasicPanel />;
      case "projects":
        return <ProjectPanel />;
      case "education":
        return <EducationPanel />;
      case "experience":
        return <ExperiencePanel />;
      case "skills":
        return <SkillPanel />;
      default:
        if (activeSection?.startsWith("custom")) {
          return <CustomPanel sectionId={activeSection} />;
        } else {
          return <BasicPanel />;
        }
    }
  };

  return (
    <motion.div
      className={cn(
        "w-full h-full overflow-y-auto",
        "bg-gray-100 p-2"
      )}
    >
      <motion.div
        className={cn(
          "rounded-lg",
          "bg-white",
          "shadow-lg shadow-deep-blue-20"
        )}
      >
        {renderFields()}
      </motion.div>
    </motion.div>
  );
}
