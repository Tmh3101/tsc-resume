"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, BookOpen, Rocket, Zap, GraduationCap } from "lucide-react";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";

// =====================================================
// Timeline Section - Quy trình IPIAL 5 bước
// =====================================================

// Dữ liệu timeline steps
const timelineSteps = [
    {
        id: "ideation",
        step: 1,
        title: "Ideation",
        subtitle: "Tuyển dụng & Định hướng",
        description: "Tuyển chọn sinh viên tiềm năng, đánh giá năng lực và định hướng lộ trình phát triển phù hợp.",
        icon: Lightbulb,
        color: "bg-orange",
    },
    {
        id: "preseed",
        step: 2,
        title: "Pre-seed",
        subtitle: "Đào tạo nền tảng",
        description: "Trang bị kiến thức nền, kỹ năng mềm và mindset làm việc chuyên nghiệp trong môi trường thực tế.",
        icon: BookOpen,
        color: "bg-blue-500",
    },
    {
        id: "incubation",
        step: 3,
        title: "Incubation",
        subtitle: "Làm dự án thật (MVP)",
        description: "Tham gia các dự án thực tế, xây dựng sản phẩm MVP dưới sự hướng dẫn của mentor có kinh nghiệm.",
        icon: Rocket,
        color: "bg-green-500",
    },
    {
        id: "acceleration",
        step: 4,
        title: "Acceleration",
        subtitle: "Tăng tốc phát triển",
        description: "Trở thành Key Member, đảm nhận vai trò cao hơn, mentoring thành viên mới và lead dự án.",
        icon: Zap,
        color: "bg-purple-500",
    },
    {
        id: "launch",
        step: 5,
        title: "IPO / Launch",
        subtitle: "Tốt nghiệp",
        description: "Tốt nghiệp TSC với portfolio ấn tượng, sẵn sàng khởi nghiệp hoặc gia nhập các công ty hàng đầu.",
        icon: GraduationCap,
        color: "bg-orange",
    },
];

export function Timeline() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Animate progress bar based on scroll
    const progressWidth = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

    return (
        <SectionWrapper id="lo-trinh" background="gradient">
            <SectionTitle
                title="Lộ Trình IPIAL"
                subtitle="5 bước phát triển từ sinh viên thành chuyên gia"
                light
            />

            {/* Timeline Container */}
            <div ref={containerRef} className="relative">
                {/* Desktop Timeline - Horizontal */}
                <div className="hidden lg:block">
                    {/* Steps Container with proper centering */}
                    <div className="relative">
                        {/* Progress Bar Background - positioned relative to icon centers */}
                        <div className="absolute top-[60px] left-[10%] right-[10%] h-1 bg-white/20 rounded-full z-0">
                            {/* Animated Progress */}
                            <motion.div
                                className="h-full bg-orange rounded-full origin-left"
                                style={{ width: progressWidth }}
                            />
                        </div>

                        {/* Steps - evenly distributed */}
                        <div className="grid grid-cols-5 gap-4">
                            {timelineSteps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    variants={itemVariants}
                                    custom={index}
                                    className="flex flex-col items-center"
                                >
                                    <TimelineStep {...step} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Timeline - Vertical */}
                <div className="lg:hidden relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20">
                        <motion.div
                            className="w-full bg-orange origin-top"
                            style={{ height: progressWidth }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-8">
                        {timelineSteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                variants={itemVariants}
                                custom={index}
                                className="relative pl-20"
                            >
                                <TimelineStepMobile {...step} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

// Desktop Step Component
interface TimelineStepProps {
    step: number;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

function TimelineStep({
    step,
    title,
    subtitle,
    description,
    icon: Icon,
    color,
}: TimelineStepProps) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group cursor-pointer flex flex-col items-center"
        >
            {/* Icon Circle */}
            <div
                className={`
          w-[120px] h-[120px] rounded-full ${color}
          flex items-center justify-center mb-6
          shadow-lg shadow-black/20
          group-hover:scale-110 transition-transform duration-300
          relative z-10
        `}
            >
                <Icon className="w-12 h-12 text-white" />

                {/* Step Number Badge */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-deep-blue font-bold text-sm">{step}</span>
                </div>
            </div>

            {/* Content Card */}
            <div className="glass-dark rounded-2xl p-6 text-center group-hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-outfit)]">
                    {title}
                </h3>
                <p className="text-orange font-medium text-sm mb-3">{subtitle}</p>
                <p className="text-white/70 text-sm leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

// Mobile Step Component
function TimelineStepMobile({
    step,
    title,
    subtitle,
    description,
    icon: Icon,
    color,
}: TimelineStepProps) {
    return (
        <>
            {/* Icon Circle - Positioned on the line */}
            <div
                className={`
          absolute left-8 w-8 h-8 rounded-full ${color}
          flex items-center justify-center
          shadow-lg -translate-x-1/2
          z-10
        `}
            >
                <span className="text-white font-bold text-sm">{step}</span>
            </div>

            {/* Content Card */}
            <div className="glass-dark rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white font-[family-name:var(--font-outfit)]">
                            {title}
                        </h3>
                        <p className="text-orange text-sm">{subtitle}</p>
                    </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{description}</p>
            </div>
        </>
    );
}
