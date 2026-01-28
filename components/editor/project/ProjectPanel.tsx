import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectItem from "./ProjectItem";
import { Project } from "@/types/resume";
import { generateUUID } from "@/lib/utils";

const ProjectPanel = () => {
  const { activeResume, updateProjects, updateProjectsBatch } =
    useResumeStore();
  const { projects = [] } = activeResume || {};
  const handleCreateProject = () => {
    const newProject: Project = {
      id: generateUUID(),
      name: "Tên dự án",
      role: "Vai trò",
      date: "01/2020 - 12/2023",
      description: "",
      visible: true,
    };
    updateProjects(newProject);
  };

  return (
    <div
      className={cn(
        "space-y-4 px-4 py-4 rounded-lg",
        "bg-white dark:bg-neutral-900/30"
      )}
    >
      <Reorder.Group
        axis="y"
        values={projects}
        onReorder={(newOrder) => {
          updateProjectsBatch(newOrder);
        }}
        className="space-y-3"
      >
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project}></ProjectItem>
        ))}

        <Button onClick={handleCreateProject} className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          Thêm dự án
        </Button>
      </Reorder.Group>
    </div>
  );
};

export default ProjectPanel;
