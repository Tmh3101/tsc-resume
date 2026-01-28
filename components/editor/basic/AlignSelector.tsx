import React from "react";
import { cn } from "@/lib/utils";

interface AlignSelectorProps {
  value: "left" | "center" | "right";
  onChange: (value: "left" | "center" | "right") => void;
}

const AlignSelector: React.FC<AlignSelectorProps> = ({ value, onChange }) => {
  const layouts = [
    {
      value: "left",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="15" cy="24" r="6" className="fill-current" />
          <rect x="27" y="21" width="15" height="2" className="fill-current" />
          <rect x="27" y="25" width="12" height="2" className="fill-current" />
          <rect x="27" y="29" width="13" height="2" className="fill-current" />
        </svg>
      ),
      tooltip: "Căn trái",
    },
    {
      value: "center",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="15" r="6" className="fill-current" />
          <rect
            x="16.5"
            y="27"
            width="15"
            height="2"
            className="fill-current"
          />
          <rect x="18" y="31" width="12" height="2" className="fill-current" />
          <rect x="17" y="35" width="14" height="2" className="fill-current" />
        </svg>
      ),
      tooltip: "Căn giữa",
    },
    {
      value: "right",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="33" cy="24" r="6" className="fill-current" />
          <rect x="6" y="21" width="15" height="2" className="fill-current" />
          <rect x="9" y="25" width="12" height="2" className="fill-current" />
          <rect x="8" y="29" width="13" height="2" className="fill-current" />
        </svg>
      ),
      tooltip: "Căn phải",
    },
  ];

  return (
    <div className="inline-flex p-0 bg-gray-200 rounded-lg gap-1"> 
      {layouts.map((layout) => (
        <button
          key={layout.value}
          onClick={() => onChange(layout.value as "left" | "center" | "right")}
          title={layout.tooltip}
          className={cn(
            "p-2 rounded-lg transition-all duration-200 cursor-pointer",
            "hover:ring-1 hover:ring-orange/30",
            value === layout.value
              ? "bg-orange shadow-sm text-white ring-1 ring-orange/30"
              : "text-deep-blue"
          )}
        >
          {layout.icon}
        </button>
      ))}
    </div>
  );
};

export default AlignSelector;
