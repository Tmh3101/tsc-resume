"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

// =====================================================
// Card Component - Thẻ với hiệu ứng glassmorphism
// =====================================================

type CardVariant = "default" | "glass" | "glass-dark" | "solid";

interface CustomCardProps {
    variant?: CardVariant;
    children: React.ReactNode;
    className?: string;
    hover?: boolean; // Bật hiệu ứng hover
    onClick?: () => void;
}

// Animation variants
const cardMotion: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
    },
};

// Style cho từng variant
const variantStyles: Record<CardVariant, string> = {
    default: `
    bg-white border border-gray-100
    shadow-lg shadow-gray-200/50
  `,
    glass: `
    glass rounded-2xl
  `,
    "glass-dark": `
    glass-dark rounded-2xl
  `,
    solid: `
    bg-deep-blue text-white
    rounded-2xl
  `,
};

export function CustomCard({
    variant = "default",
    children,
    className = "",
    hover = true,
    onClick,
}: CustomCardProps) {
    return (
        <motion.div
            variants={cardMotion}
            initial="initial"
            whileInView="animate"
            whileHover={hover ? "hover" : undefined}
            viewport={{ once: true, margin: "-50px" }}
            onClick={onClick}
            className={`
        p-6 rounded-2xl
        transition-shadow duration-300
        ${hover ? "cursor-pointer hover:shadow-xl" : ""}
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}

// =====================================================
// FlipCard Component - Thẻ lật 2 mặt
// =====================================================

interface FlipCardProps {
    front: React.ReactNode;
    back: React.ReactNode;
    className?: string;
}

export function FlipCard({ front, back, className = "" }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = React.useState(false);

    return (
        <div
            className={`relative perspective-1000 ${className}`}
            style={{ perspective: "1000px" }}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                {/* Mặt trước */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {front}
                </div>

                {/* Mặt sau */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    {back}
                </div>
            </motion.div>
        </div>
    );
}
