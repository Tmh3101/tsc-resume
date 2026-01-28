"use client";

import { motion, Reorder, useDragControls } from "framer-motion";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuSection } from "@/types/resume";

interface LayoutItemProps {
  item: MenuSection;
  isBasic?: boolean;
  activeSection: string;
  setActiveSection: (id: string) => void;
  toggleSectionVisibility: (id: string) => void;
  updateMenuSections: (sections: MenuSection[]) => void;
  menuSections: MenuSection[];
}

const LayoutItem = ({
  item,
  isBasic = false,
  activeSection,
  setActiveSection,
  toggleSectionVisibility,
  updateMenuSections,
  menuSections
}: LayoutItemProps) => {
  const dragControls = useDragControls();

  if (isBasic) {
    return (
      <div
        className={cn(
          "rounded-lg group border mb-2 hover:border-orange transition-colors cursor-pointer",
          "dark:hover:bg-neutral-800 dark:bg-neutral-900/50 dark:border-neutral-800",
          "hover:bg-orange/5 bg-white border-gray-100",
          activeSection === item.id &&
            "border-orange dark:border-orange bg-orange/5"
        )}
        onClick={() => setActiveSection(item.id)}
      >
        <div className="flex items-center p-2.5 space-x-3">
          <span
            className={cn(
              "text-base ml-[12px]",
              "dark:text-neutral-300",
              "text-gray-600"
            )}
          >
            {item.icon}
          </span>
          <span className={cn(
            "text-sm flex-1 cursor-pointer",
            activeSection === item.id && "text-orange font-medium"
          )}>
            {item.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Reorder.Item
      id={item.id}
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        "rounded-lg group border hover:border-orange flex overflow-hidden transition-colors",
        "dark:hover:bg-neutral-800 dark:bg-neutral-900/50 dark:border-neutral-800 dark:hover:border-orange",
        "hover:bg-orange/5 bg-white border-gray-100",
        activeSection === item.id &&
          "border-orange dark:border-orange bg-orange/5"
      )}
      whileHover={{ scale: 1.01 }}
      whileDrag={{ scale: 1.02 }}
    >
      <div
        onPointerDown={(event) => {
          dragControls.start(event);
        }}
        className={cn(
          "w-7 flex items-center justify-center touch-none shrink-0",
          "border-gray-100 dark:border-neutral-800",
          "cursor-grab hover:bg-orange/10 dark:hover:bg-orange/20"
        )}
      >
        <GripVertical
          className={cn(
            "w-3.5 h-3.5",
            "text-gray-400 dark:text-neutral-400",
            "transform transition-transform group-hover:scale-110"
          )}
        />
      </div>

      <div
        className="flex select-none items-center p-2.5 space-x-3 flex-1 cursor-pointer"
        onClick={() => setActiveSection(item.id)}
      >
        <div className="flex flex-1 items-center">
          <span
            className={cn(
              "text-base mr-2",
              "dark:text-neutral-300",
              "text-gray-600"
            )}
          >
            {item.icon}
          </span>
          <span className={cn(
            "text-sm flex-1",
            activeSection === item.id && "text-orange font-medium"
          )}>
            {item.title}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility(item.id);
            }}
            className={cn(
              "p-1.5 rounded-md mr-2 hover:text-orange",
              "hover:bg-orange/10 text-gray-600"
            )}
          >
            {item.enabled ? (
              <Eye className="w-4 h-4 text-orange" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              updateMenuSections(
                menuSections.filter((section) => section.id !== item.id)
              );
              setActiveSection(
                menuSections[
                  menuSections.findIndex((s) => s.id === item.id) - 1
                ].id
              );
            }}
            className={cn(
              "p-1.5 rounded-md",
              "hover:bg-red-50 text-red-500 hover:text-red-600"
            )}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default LayoutItem;
