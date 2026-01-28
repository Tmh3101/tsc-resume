"use client";

import React from "react";
import { motion, useInView, type Variants } from "framer-motion";

// =====================================================
// SectionWrapper - Wrapper với scroll reveal animation
// =====================================================

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    background?: "white" | "light" | "dark" | "gradient";
}

// Animation variants cho container
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Animation variants cho children
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
        },
    },
};

// Background styles
const bgStyles: Record<string, string> = {
    white: "bg-white",
    light: "bg-gray-50",
    dark: "bg-deep-blue text-white",
    gradient: "bg-gradient-to-br from-deep-blue-dark via-deep-blue to-deep-blue-light text-white",
};

export function SectionWrapper({
    children,
    className = "",
    id,
    background = "white",
}: SectionWrapperProps) {
    const ref = React.useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px 0px"
    });

    return (
        <section
            ref={ref}
            id={id}
            className={`
        section-padding
        ${bgStyles[background]}
        ${className}
      `}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="max-w-7xl mx-auto"
            >
                {children}
            </motion.div>
        </section>
    );
}

// =====================================================
// AnimatedItem - Wrapper cho từng item với animation
// =====================================================

interface AnimatedItemProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedItem({
    children,
    className = "",
    delay = 0,
}: AnimatedItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// =====================================================
// SectionTitle - Tiêu đề section với gradient
// =====================================================

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    center?: boolean;
    light?: boolean;
}

export function SectionTitle({
    title,
    subtitle,
    center = true,
    light = false,
}: SectionTitleProps) {
    return (
        <motion.div
            variants={itemVariants}
            className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}
        >
            <h2
                className={`
          text-3xl md:text-4xl lg:text-5xl font-bold mb-4
          font-[family-name:var(--font-outfit)]
          ${light ? "text-white" : "gradient-text"}
        `}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`
            text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed
            ${light ? "text-white/80" : "text-gray-600"}
          `}
                >
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
