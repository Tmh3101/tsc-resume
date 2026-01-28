"use client"

import * as React from "react"
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label?: string
  options: SelectOption[]
  placeholder?: string
  error?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
  disabled?: boolean
  className?: string
  variant?: "default" | "glass"
}

const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, options, placeholder, error, required, value, onChange, onBlur, name, disabled, className, variant = "default" }, ref) => {
    const isGlass = variant === "glass"
    
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(
            "block text-sm font-medium",
            isGlass ? "text-white" : "text-gray-700 dark:text-gray-300"
          )}>
            {label}
            {required && <span className="text-orange ml-1">*</span>}
          </label>
        )}
        <SelectPrimitive
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          name={name}
        >
          <SelectTrigger
            ref={ref}
            onBlur={onBlur}
            className={cn(
              "h-11 w-full rounded-xl px-4 py-6 transition-all duration-300",
              isGlass ? [
                "bg-white/10 backdrop-blur-sm border border-white/20 text-white",
                "focus:border-orange focus:ring-2 focus:ring-orange/30 focus:bg-white/15",
                "hover:border-white/40",
                "[&>span]:placeholder:text-white/50",
                "[&_svg]:text-white/70",
              ] : [
                "bg-white border border-gray-200 text-gray-900",
                "focus:border-orange focus:ring-2 focus:ring-orange/20",
                "dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              ],
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
          >
            <SelectValue placeholder={placeholder} className={isGlass ? "text-white/50" : ""} />
          </SelectTrigger>
          <SelectContent 
            className="rounded-xl border border-gray-200 shadow-xl bg-white/90 max-h-60 overflow-auto"
            position="popper"
            side="bottom"
            sideOffset={4}
            align="start"
          >
            <SelectGroup>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="rounded-lg py-3 px-4 focus:bg-orange/10 focus:text-orange cursor-pointer text-gray-700 hover:bg-gray-50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectPrimitive>
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
FormSelect.displayName = "FormSelect"

export { FormSelect }
