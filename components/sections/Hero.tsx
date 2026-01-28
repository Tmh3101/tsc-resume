"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// =====================================================
// Hero Section - Ấn tượng đầu tiên với particles background
// =====================================================

export function Hero() {
    // Animation variants cho text
    const textVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.8,
                ease: "easeOut" as const,
            },
        }),
    };

    // Scroll to form section
    const scrollToForm = () => {
        const formSection = document.getElementById("ung-tuyen");
        if (formSection) {
            formSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Scroll to services section
    const scrollToServices = () => {
        const servicesSection = document.getElementById("dich-vu");
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden particles-bg"
            style={{
                background: "linear-gradient(135deg, #082342 0%, #0e3963 50%, #1a5490 100%)",
            }}
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Floating Circles Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-orange/20"
                        style={{
                            width: `${60 + i * 40}px`,
                            height: `${60 + i * 40}px`,
                            left: `${10 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                {/* Badge */}
                <motion.div
                    custom={0}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                >
                    <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
                    <span className="text-white/90 text-sm font-medium">
                        Hệ sinh thái tiên phong tại ĐBSCL
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    custom={1}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)] leading-tight"
                >
                    <span className="block mt-2 pb-1 text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-orange to-orange-light bg-clip-text text-transparent">
                        Bệ Phóng Năng Lực & Đổi Mới Sáng Tạo
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto mb-10 leading-relaxed"
                >
                    Hệ sinh thái tiên phong tại ĐBSCL giúp sinh viên chuyển hóa kiến thức thành kỹ năng thực chiến, cung cấp giải pháp công nghệ và nhân sự chất lượng cao cho doanh nghiệp.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    custom={3}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={scrollToForm}
                        className="min-w-[200px] rounded-lg px-8 py-6"
                    >
                        Dành cho Sinh Viên
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={scrollToServices}
                        className="min-w-[200px] rounded-lg px-8 py-6"
                    >
                        Dành cho Doanh Nghiệp
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    custom={4}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { value: "50+", label: "Sinh viên tham gia" },
                        { value: "10+", label: "Dự án hoàn thành" },
                        { value: "5+", label: "Đối tác doanh nghiệp" },
                        { value: "100%", label: "Cam kết chất lượng" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-orange mb-2 font-[family-name:var(--font-outfit)]">
                                {stat.value}
                            </div>
                            <div className="text-white/70 text-sm md:text-base">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ChevronDown className="w-8 h-8 text-white/50" />
            </motion.div>
        </section>
    );
}
