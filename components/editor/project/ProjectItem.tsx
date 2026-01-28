"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from "framer-motion";
import { ChevronDown, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import Field from "../Field";
import ThemeModal from "@/components/shared/ThemeModal";

interface Project {
  id: string;
  name: string;
  role: string;
  date: string;
  description: string;
  visible: boolean;
  link?: string;
}

interface ProjectEditorProps {
  project: Project;
  onSave: (project: Project) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave }) => {
  const handleChange = (field: keyof Project, value: string) => {
    onSave({
      ...project,
      [field]: value,
    });
  };

  return (
    <div className="space-y-2">
        <Field
          label="Tên dự án"
          value={project.name}
          onChange={(value) => handleChange("name", value)}
          placeholder="Nhập tên dự án"
        />
        <Field
          label="Vai trò"
          value={project.role}
          onChange={(value) => handleChange("role", value)}
          placeholder="Nhập vai trò"
        />
        <Field
          label="Liên kết"
          value={project.link || ""}
          onChange={(value) => handleChange("link", value)}
          placeholder="URL dự án"
        />
        <Field
          label="Thời gian"
          value={project.date}
          onChange={(value) => handleChange("date", value)}
          placeholder="VD: 01/2020 - 12/2023"
        />
        <Field
          label="Mô tả"
          value={project.description}
          onChange={(value) => handleChange("description", value)}
          type="editor"
          placeholder="Mô tả dự án..."
        />
    </div>
  );
};

const ProjectItem = ({ project }: { project: Project }) => {
  const { updateProjects, deleteProject, setDraggingProjectId } =
    useResumeStore();
  const dragControls = useDragControls();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleVisibilityToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isUpdating) return;

      setIsUpdating(true);
      setTimeout(() => {
        updateProjects({
          ...project,
          visible: !project.visible,
        });
        setIsUpdating(false);
      }, 10);
    },
    [project, updateProjects, isUpdating]
  );

  return (
    <>
      {/* ThemeModal must be outside Reorder.Item to avoid React.Children.only error */}
      <ThemeModal
        isOpen={deleteDialogOpen}
        title={project.name}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteProject(project.id);
          setExpandedId(null);
          setDeleteDialogOpen(false);
        }}
      />

      <Reorder.Item
        id={project.id}
        value={project}
        dragListener={false}
        dragControls={dragControls}
        onDragEnd={() => {
          setDraggingProjectId(null);
        }}
        className={cn(
          "rounded-lg border overflow-hidden flex group",
          "bg-white hover:border-orange",
          "border-gray-100"
        )}
      >
      <div
        onPointerDown={(event) => {
          if (expandedId === project.id) return;
          dragControls.start(event);
          setDraggingProjectId(project.id);
        }}
        onPointerUp={() => {
          setDraggingProjectId(null);
        }}
        onPointerCancel={() => {
          setDraggingProjectId(null);
        }}
        className={cn(
          "w-8 flex items-center justify-center border-r shrink-0 touch-none",
          "border-gray-100 hover:bg-orange/10",
          expandedId === project.id
            ? "cursor-not-allowed"
            : "cursor-grab hover:bg-gray-50 dark:hover:bg-neutral-800/50"
        )}
      >
        <GripVertical
          className={cn(
            "w-4 h-4",
            "text-gray-400 dark:text-neutral-400",
            expandedId === project.id && "opacity-50",
            "transform transition-transform group-hover:scale-110"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "px-4 py-4 flex items-center justify-between",
            expandedId === project.id && "bg-gray-50 dark:bg-neutral-800/50",
            "cursor-pointer select-none"
          )}
          onClick={(e) => {
            if (expandedId === project.id) {
              setExpandedId(null);
            } else {
              setExpandedId(project.id);
            }
          }}
        >
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium truncate",
                "text-gray-700 dark:text-neutral-200"
              )}
            >
              {project.name || "Dự án chưa đặt tên"}
            </h3>
          </div>
          <div className="flex items-center gap-1 ml-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              className={cn(
                "h-8 w-8 p-0 hover:text-orange",
                project.visible
                  ? "text-orange hover:bg-orange/10"
                  : "text-gray-400 hover:bg-gray-100"
              )}
              onClick={handleVisibilityToggle}
            >
              {project.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                "text-red-500 hover:bg-red-50 hover:text-red-500"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <motion.div
              initial={false}
              animate={{
                rotate: expandedId === project.id ? 180 : 0,
              }}
            >
              <ChevronDown
                className={cn(
                  "w-5 h-5",
                  "dark:text-neutral-400",
                  "text-gray-500"
                )}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expandedId === project.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "px-4 pb-4 space-y-4",
                  "dark:border-neutral-800 border-gray-100"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={cn(
                    "h-px w-full",
                    "dark:bg-neutral-800 bg-gray-100"
                  )}
                />
                <ProjectEditor
                  project={project}
                  onSave={(updatedProject) => {
                    updateProjects(updatedProject);
                  }}
                  onDelete={() => {
                    deleteProject(project.id);
                    setExpandedId(null);
                  }}
                  onCancel={() => setExpandedId(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reorder.Item>
    </>
  );
};

export default ProjectItem;
