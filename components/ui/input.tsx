import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  variant?: "default" | "glass"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, variant = "default", ...props }, ref) => {
    const isGlass = variant === "glass"
    
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(
            "block text-sm font-medium",
            isGlass ? "text-white" : "text-gray-700 dark:text-gray-300"
          )}>
            {label}
            {props.required && <span className="text-orange ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            "h-12 w-full min-w-0 rounded-xl px-4 py-3 text-base transition-all duration-300 outline-none",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            // Glass variant cho dark background
            isGlass ? [
              "bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50",
              "focus:border-orange focus:ring-2 focus:ring-orange/30 focus:bg-white/15",
              "hover:border-white/40",
            ] : [
              "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400",
              "focus:border-orange focus:ring-2 focus:ring-orange/20",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400",
            ],
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className={cn(
            "text-sm mt-1",
            isGlass ? "text-red-300" : "text-red-500"
          )}>{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
