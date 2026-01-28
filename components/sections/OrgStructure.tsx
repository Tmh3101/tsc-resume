"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, Code, Palette, Briefcase, BarChart3, Sparkles, User } from "lucide-react";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";

// =====================================================
// Org Structure Section - Cơ cấu tổ chức mô hình Squad
// Enhanced Version with Wow Effects
// =====================================================

// Dữ liệu Mentors
const mentors = [
    { id: "ceo", role: "CEO", icon: Crown, color: "from-orange to-orange-light" },
    { id: "tech", role: "Tech Lead", icon: Code, color: "from-blue-500 to-blue-400" },
    { id: "creative", role: "Creative Lead", icon: Palette, color: "from-pink-500 to-pink-400" },
    { id: "ops", role: "Ops Manager", icon: Briefcase, color: "from-green-500 to-green-400" },
    { id: "sales", role: "Sales Manager", icon: BarChart3, color: "from-purple-500 to-purple-400" },
];

// Dữ liệu Talent Pool positions
const talentPositions = [
    { id: 1, type: "dev", color: "bg-blue-400" },
    { id: 2, type: "design", color: "bg-pink-400" },
    { id: 3, type: "content", color: "bg-green-400" },
    { id: 4, type: "dev", color: "bg-blue-400" },
    { id: 5, type: "design", color: "bg-pink-400" },
    { id: 6, type: "dev", color: "bg-blue-400" },
    { id: 7, type: "content", color: "bg-green-400" },
    { id: 8, type: "design", color: "bg-pink-400" },
    { id: 9, type: "dev", color: "bg-blue-400" },
    { id: 10, type: "content", color: "bg-green-400" },
    { id: 11, type: "dev", color: "bg-blue-400" },
    { id: 12, type: "design", color: "bg-pink-400" },
];

export function OrgStructure() {
    const [isHoveringProject, setIsHoveringProject] = React.useState(false);

    return (
        <SectionWrapper id="to-chuc" background="white">
            <SectionTitle
                title="Mô Hình Squad Linh Hoạt"
                subtitle="Sự kết hợp hoàn hảo giữa Ban Quản lý Chuyên môn và Đội ngũ Thực thi Năng động"
            />

            {/* Organization Chart */}
            <motion.div
                variants={itemVariants}
                className="relative max-w-5xl mx-auto flex flex-col items-center"
            >
                {/* Mentors Section */}
                <div className="w-full mb-8 flex flex-col items-center">
                    <div className="text-center mb-8">
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-blue/5 backdrop-blur-sm rounded-full border border-deep-blue/10"
                        >
                            <Crown className="w-5 h-5 text-orange" />
                            <span className="font-bold text-deep-blue text-lg">The Mentors</span>
                        </motion.span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {mentors.map((mentor, index) => (
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                className="flex flex-col items-center"
                            >
                                <div
                                    className={`
                                        w-20 h-20 md:w-24 md:h-24 rounded-2xl 
                                        bg-gradient-to-br ${mentor.color}
                                        flex items-center justify-center mb-3
                                        shadow-xl
                                        border-2 border-white/50
                                        transition-all duration-300
                                        hover:shadow-2xl hover:border-white/80
                                    `}
                                >
                                    <mentor.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                                </div>
                                <span className="text-sm md:text-base font-semibold text-deep-blue/80">
                                    {mentor.role}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Animated Connection Line - Top */}
                <div className="relative w-1 h-16 md:h-20 flex flex-col items-center">
                    <motion.div
                        className="w-1 h-full bg-gradient-to-b from-deep-blue/10 to-orange/60 rounded-full"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute w-3 h-3 rounded-full bg-orange shadow-lg shadow-orange/50"
                        animate={{ y: [0, 50, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Project Box - Interactive Center Piece */}
                <motion.div
                    className="relative my-4 w-full max-w-sm mx-auto flex justify-center"
                    onMouseEnter={() => setIsHoveringProject(true)}
                    onMouseLeave={() => setIsHoveringProject(false)}
                >
                    {/* Glow Effect Behind */}
                    <motion.div
                        className="absolute inset-0 bg-orange/30 rounded-3xl blur-2xl"
                        animate={{
                            scale: isHoveringProject ? 1.2 : 1,
                            opacity: isHoveringProject ? 0.8 : 0.4,
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    <motion.div
                        animate={{
                            scale: isHoveringProject ? 1.05 : 1,
                            boxShadow: isHoveringProject
                                ? "0 25px 50px rgba(242, 148, 39, 0.5)"
                                : "0 15px 40px rgba(242, 148, 39, 0.3)",
                        }}
                        className="relative w-full p-8 rounded-3xl bg-gradient-to-br from-orange via-orange-light to-yellow-400 text-white text-center cursor-pointer border-2 border-white/30"
                    >
                        {/* Sparkle Animation */}
                        <motion.div
                            className="absolute top-3 right-3"
                            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Sparkles className="w-6 h-6 text-white/70" />
                        </motion.div>

                        <motion.div
                            animate={{ scale: isHoveringProject ? 1.1 : 1 }}
                            className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4"
                        >
                            <Briefcase className="w-8 h-8" />
                        </motion.div>
                        <h4 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-outfit)]">
                            DỰ ÁN
                        </h4>
                        <p className="text-white/90 text-sm md:text-base mt-2">
                            {isHoveringProject ? "Squad đang hình thành!" : "Hover để xem Squad hình thành"}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Animated Connection Line - Bottom */}
                <div className="relative w-1 h-16 md:h-20 flex flex-col items-center">
                    <motion.div
                        className="w-1 h-full bg-gradient-to-b from-orange/60 to-deep-blue/10 rounded-full"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                        className="absolute w-3 h-3 rounded-full bg-deep-blue shadow-lg shadow-deep-blue/20"
                        animate={{ y: [50, 0, 50] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Talent Pool Section */}
                <div className="w-full flex flex-col items-center">
                    <div className="text-center mb-8">
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-blue/5 backdrop-blur-sm rounded-full border border-deep-blue/10"
                        >
                            <Sparkles className="w-5 h-5 text-orange" />
                            <span className="font-bold text-deep-blue text-lg">The Talent Pool</span>
                        </motion.span>
                    </div>

                    {/* Talent Dots Grid - Centered */}
                    <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto">
                        {talentPositions.map((talent, index) => {
                            // Chọn 4 chấm ở giữa (index 4, 5, 6, 7)
                            const isMiddle = index >= 2 && index <= 5;
                            return (
                                <motion.div
                                    key={talent.id}
                                    className={`
                                        w-12 h-12 md:w-14 md:h-14 rounded-full ${talent.color}
                                        shadow-lg
                                        border-2 border-white
                                        transition-all duration-300
                                        flex items-center justify-center
                                    `}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 0.7, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    animate={{
                                        opacity: isHoveringProject ? 1 : 0.7,
                                        scale: isHoveringProject && isMiddle ? 1.2 : 1,
                                        y: isHoveringProject && isMiddle ? -120 : 0,
                                        x: 0, // Hội tụ về tâm
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                                    }}
                                    whileHover={{ scale: 1.2, opacity: 1 }}
                                >
                                    <User className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Legend - Centered */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-400 shadow-md" />
                            <span className="text-sm md:text-base text-muted font-medium">Developer</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-pink-400 shadow-md" />
                            <span className="text-sm md:text-base text-muted font-medium">Designer</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-400 shadow-md" />
                            <span className="text-sm md:text-base text-muted font-medium">Content</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
