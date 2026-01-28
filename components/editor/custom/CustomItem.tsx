import { useCallback, useState } from "react";
import {
  motion,
  useDragControls,
  Reorder,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { GripVertical, Eye, EyeOff, ChevronDown, Trash2 } from "lucide-react";
import Field from "../Field";

import { CustomItem as CustomItemType } from "@/types/resume";
import ThemeModal from "@/components/shared/ThemeModal";
const CustomItemEditor = ({
  item,
  onSave,
}: {
  item: CustomItemType;
  onSave: (item: CustomItemType) => void;
}) => {
  const handleChange = (field: keyof CustomItemType, value: string) => {
    onSave({ ...item, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Tiêu đề"
            value={item.title}
            onChange={(value) => handleChange("title", value)}
            placeholder="Tiêu đề"
          />
          <Field
            label="Phụ đề"
            value={item.subtitle}
            onChange={(value) => handleChange("subtitle", value)}
            placeholder="Phụ đề"
          />
        </div>

        <Field
          label="Khoảng thời gian"
          value={item.dateRange}
          onChange={(value) => handleChange("dateRange", value)}
          placeholder="Ví dụ: 2023.01 - 2024.01"
        />

        <Field
          label="Mô tả chi tiết"
          value={item.description}
          onChange={(value) => handleChange("description", value)}
          type="editor"
          placeholder="Nhập mô tả chi tiết..."
        />
      </div>
    </div>
  );
};

const CustomItem = ({
  item,
  sectionId,
}: {
  item: CustomItemType;
  sectionId: string;
}) => {
  const { updateCustomItem, removeCustomItem } = useResumeStore();
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
        updateCustomItem(sectionId, item.id, { visible: !item.visible });
        setIsUpdating(false);
      }, 10);
    },
    [item, updateCustomItem, isUpdating, sectionId]
  );

  return (
    <>
      {/* ThemeModal must be outside Reorder.Item to avoid React.Children.only error */}
      <ThemeModal
        isOpen={deleteDialogOpen}
        title={item.title}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          removeCustomItem(sectionId, item.id);
          setExpandedId(null);
          setDeleteDialogOpen(false);
        }}
      />

      <Reorder.Item
        id={item.id}
        value={item}
        dragListener={false}
        dragControls={dragControls}
        className={cn(
          "rounded-lg border overflow-hidden flex group",
          "bg-white hover:border-orange",
          "dark:bg-neutral-900/30",
          "border-gray-100 dark:border-neutral-800",
          "dark:hover:border-orange"
        )}
      >
      <div
        onPointerDown={(event) => {
          if (expandedId === item.id) return;
          dragControls.start(event);
        }}
        className={cn(
          "w-12 flex items-center justify-center border-r shrink-0 touch-none",
          "dark:border-neutral-800 border-gray-100",
          expandedId === item.id
            ? "cursor-not-allowed"
            : "cursor-grab hover:bg-gray-50 dark:hover:bg-neutral-800/50"
        )}
      >
        <GripVertical
          className={cn(
            "w-4 h-4",
            "dark:text-neutral-400 text-gray-400",
            expandedId === item.id && "opacity-50"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "px-4 py-4 flex items-center justify-between cursor-pointer select-none",
            expandedId === item.id && "dark:bg-neutral-800/50 bg-gray-50"
          )}
          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
        >
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium truncate text-gray-700",
                "dark:text-neutral-200"
              )}
            >
              {item.title || "Module chưa đặt tên"}
            </h3>
            {item.subtitle && (
              <p
                className={cn(
                  "text-sm truncate",
                  "dark:text-neutral-400 text-gray-500"
                )}
              >
                {item.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 ml-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              className={cn(
                "h-8 w-8 p-0 hover:text-orange",
                item.visible
                  ? "text-orange hover:bg-orange/10"
                  : "text-gray-400 hover:bg-gray-100"
              )}
              onClick={handleVisibilityToggle}
            >
              {item.visible ? (
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
                rotate: expandedId === item.id ? 180 : 0,
              }}
            >
              <ChevronDown
                className={cn("w-5 h-5", "dark:text-neutral-400 text-gray-500")}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expandedId === item.id && (
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
              >
                <div
                  className={cn(
                    "h-px w-full",
                    "dark:bg-neutral-800 bg-gray-100"
                  )}
                />
                <CustomItemEditor
                  item={item}
                  onSave={(updatedItem) => {
                    updateCustomItem(sectionId, item.id, updatedItem);
                  }}
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

export default CustomItem;
