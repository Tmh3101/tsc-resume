"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// =====================================================
// Dock Component - Thanh công cụ dạng macOS dock
// =====================================================

interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "middle" | "right";
  magnification?: number;
  distance?: number;
}

interface DockIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      children,
      className,
      direction = "middle",
      magnification = 1.5,
      distance = 100,
      ...props
    },
    ref
  ) => {
    const [mouseX, setMouseX] = React.useState<number | null>(null);
    const dockRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = dockRef.current?.getBoundingClientRect();
      if (rect) {
        setMouseX(e.clientX - rect.left);
      }
    };

    const handleMouseLeave = () => {
      setMouseX(null);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-auto items-end gap-1.5 rounded-2xl border border-gray-200/80 bg-white/95 p-2 backdrop-blur-lg shadow-lg",
          "dark:border-neutral-700/50 dark:bg-neutral-900/95",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div
          ref={dockRef}
          className={cn(
            "flex items-end gap-2",
            direction === "left" && "justify-start",
            direction === "middle" && "justify-center",
            direction === "right" && "justify-end"
          )}
        >
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement<DockIconProps>(child)) {
              return React.cloneElement(child, {
                ...child.props,
                // Truyền thêm props cho DockIcon nếu cần
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }
);
Dock.displayName = "Dock";

const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(
  ({ children, className, size = 36, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center justify-center rounded-xl bg-gray-50 p-1.5 transition-all duration-200 hover:bg-orange/10 hover:text-orange",
          "dark:bg-neutral-800 dark:hover:bg-orange/20",
          className
        )}
        style={{ width: size, height: size }}
      >
        {children}
      </motion.div>
    );
  }
);
DockIcon.displayName = "DockIcon";

export { Dock, DockIcon };
