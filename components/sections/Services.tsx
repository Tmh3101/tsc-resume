"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Palette, Users, Clock } from "lucide-react";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";

// =====================================================
// Services Section - Dịch vụ với Bento Grid Layout
// =====================================================

// Dữ liệu dịch vụ
const services = [
    {
        id: "web",
        title: "Phát triển Website",
        description: "Website Doanh nghiệp & Landing Page chuẩn SEO. Kiểm soát chất lượng (QC) bởi Tech Lead dày dạn kinh nghiệm.",
        icon: Globe,
        size: "large", // Chiếm 2 cột
        gradient: "from-deep-blue to-deep-blue-light",
    },
    {
        id: "design",
        title: "Thiết kế Sáng tạo",
        description: "Thiết kế bộ nhận diện thương hiệu, Sales Kit và ấn phẩm truyền thông hiện đại, trẻ trung.",
        icon: Palette,
        size: "medium",
        gradient: "from-orange to-orange-light",
    },
    {
        id: "staffing",
        title: "Cung ứng Nhân sự",
        description: "Cung ứng nhân sự và thực tập sinh đã qua 'thử lửa' tại các dự án thực tế của TSC.",
        icon: Users,
        size: "medium",
        gradient: "from-green-500 to-emerald-400",
    },
    {
        id: "assistant",
        title: "Trợ lý Dự án",
        description: "Thuê trợ lý theo giờ/dự án (Dev, Design, Admin). Giải quyết các tác vụ nhanh chóng, không tốn chi phí quản lý.",
        icon: Clock,
        size: "large",
        gradient: "from-purple-500 to-pink-500",
    },
];

export function Services() {
    return (
        <SectionWrapper id="dich-vu" background="light">
            <SectionTitle
                title="Dịch Vụ Của Chúng Tôi"
                subtitle="Giải pháp toàn diện cho doanh nghiệp SME với chất lượng cao và chi phí hợp lý"
            />

            {/* Bento Grid - Staggered Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                    // Staggered pattern: Row 1 (index 0,1): 2col + 1col, Row 2 (index 2,3): 1col + 2col
                    const isLargeOnLeft = index === 0 || index === 3;
                    const isLargeOnRight = index === 1 || index === 2;
                    const colSpan = service.size === "large"
                        ? "lg:col-span-2"
                        : "lg:col-span-1";

                    return (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            custom={index}
                            className={`
                                ${service.size === "large" ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1"}
                                min-h-[200px]
                            `}
                        >
                            <ServiceCard {...service} />
                        </motion.div>
                    );
                })}
            </div>

            {/* CTA Banner */}
            <motion.div
                variants={itemVariants}
                className="mt-12 glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(14, 57, 99, 0.95) 0%, rgba(26, 84, 144, 0.95) 100%)",
                }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-outfit)]">
                        Bạn cần giải pháp tùy chỉnh?
                    </h3>
                    <p className="text-white/80 max-w-2xl mx-auto mb-6">
                        Liên hệ ngay để thảo luận về dự án của bạn. Chúng tôi sẵn sàng lắng nghe
                        và đưa ra giải pháp phù hợp nhất.
                    </p>
                    <motion.a
                        href="#lien-he"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block gradient-button px-8 py-4 rounded-xl font-semibold text-white"
                    >
                        <span>Liên hệ tư vấn miễn phí</span>
                    </motion.a>
                </div>
            </motion.div>
        </SectionWrapper>
    );
}

// Service Card Component
interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
}

function ServiceCard({ title, description, icon: Icon, gradient }: ServiceCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`
        h-full rounded-3xl p-8 md:p-10
        bg-gradient-to-br ${gradient}
        text-white
        shadow-xl cursor-pointer
        relative overflow-hidden
        group
        flex flex-col justify-center
      `}
        >
            {/* Shine effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                    transform: "translateX(-100%)",
                    animation: "shine 1.5s ease-in-out infinite",
                }}
            />

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7" />
            </div>

            {/* Content */}
            <h3 className="text-xl md:text-2xl font-bold mb-3 font-[family-name:var(--font-outfit)]">
                {title}
            </h3>
            <p className="text-white/80 leading-relaxed">{description}</p>
        </motion.div>
    );
}
