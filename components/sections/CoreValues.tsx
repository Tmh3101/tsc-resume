"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Brain, Handshake } from "lucide-react";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";

// =====================================================
// Core Values Section - Giá trị cốt lõi T-S-C
// =====================================================

// Dữ liệu Core Values
const coreValues = [
    {
        letter: "T",
        title: "TRUST",
        subtitle: "Tín - Cam kết trọn vẹn",
        description: "Hành động chính trực. TSC chinh phục niềm tin bằng kết quả thực tế và sự minh bạch trong từng dòng code, từng sản phẩm bàn giao.",
        icon: ShieldCheck,
        gradient: "from-orange to-orange-dark",
    },
    {
        letter: "S",
        title: "SMART",
        subtitle: "Trí - Tư duy đổi mới",
        description: "Giải pháp thông minh. Chúng tôi luôn tìm kiếm cách làm Faster - Better - Smarter để tối ưu hóa hiệu quả cho khách hàng.",
        icon: Brain,
        gradient: "from-deep-blue to-deep-blue-light",
    },
    {
        letter: "C",
        title: "CONNECTION",
        subtitle: "Kết - Kết nối giá trị",
        description: "Cùng phát triển. Tạo ra hệ sinh thái Win-Win nơi sinh viên có đất diễn và doanh nghiệp có nhân tài chất lượng.",
        icon: Handshake,
        gradient: "from-green-500 to-teal-500",
    },
];

export function CoreValues() {
    return (
        <SectionWrapper id="gia-tri" background="white">
            {/* Section Title */}
            <SectionTitle
                title="Giá Trị Cốt Lõi"
                subtitle="Ba trụ cột định hình văn hóa và cách thức hoạt động của TSC"
            />

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {coreValues.map((value, index) => (
                    <motion.div
                        key={value.letter}
                        variants={itemVariants}
                        custom={index}
                    >
                        <ValueCard {...value} />
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}

// Value Card Component
interface ValueCardProps {
    letter: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
}

function ValueCard({
    letter,
    title,
    subtitle,
    description,
    icon: Icon,
    gradient,
}: ValueCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative h-full"
        >
            {/* Card Container */}
            <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg border border-gray-100 overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl">
                {/* Background Gradient (appears on hover) */}
                <div
                    className={`
            absolute inset-0 bg-gradient-to-br ${gradient}
            opacity-0 group-hover:opacity-5 transition-opacity duration-300
          `}
                />

                {/* Large Letter Background */}
                <div
                    className={`
            absolute -top-4 -right-4 text-[160px] font-black
            bg-gradient-to-br ${gradient} bg-clip-text text-transparent
            opacity-10 group-hover:opacity-20 transition-opacity duration-300
            font-[family-name:var(--font-outfit)] leading-none select-none
          `}
                >
                    {letter}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Icon Container */}
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className={`
              w-16 h-16 rounded-2xl mb-6
              bg-gradient-to-br ${gradient}
              flex items-center justify-center
              shadow-lg
            `}
                    >
                        <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-deep-blue mb-1 font-[family-name:var(--font-outfit)]">
                        {title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-orange font-medium mb-4">{subtitle}</p>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">{description}</p>

                    {/* Bottom accent line */}
                    <div
                        className={`
              absolute bottom-0 left-0 right-0 h-1
              bg-gradient-to-r ${gradient}
              transform scale-x-0 group-hover:scale-x-100
              transition-transform duration-300 origin-left
            `}
                    />
                </div>
            </div>
        </motion.div>
    );
}
