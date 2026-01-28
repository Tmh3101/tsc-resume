"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";
import { FlipCard } from "@/components/ui/flip-card";

// =====================================================
// About Section - Giới thiệu TSC và SDGs
// =====================================================

// SDG official colors from UN
const sdgColors = {
    sdg8: "#A21942", // Dark red/maroon
    sdg9: "#FD6925", // Orange
    sdg17: "#19486A", // Dark blue
};

// Dữ liệu SDG cards
const sdgData = [
    {
        id: "sdg8",
        sdgNumber: 8,
        title: "Việc làm Bền vững & Thực chiến",
        subtitle: "Công việc tốt & Tăng trưởng kinh tế",
        description:
            "Giải quyết bài toán 'thừa thầy thiếu thợ' bằng cách trang bị bộ kỹ năng thực chiến (Thái độ - Chuyên môn - Quy trình). TSC cam kết tạo ra cơ hội thực tập và làm việc có trả phí, giúp sinh viên sẵn sàng gia nhập thị trường lao động cao cấp ngay khi ra trường.",
        image: "/sdg-8-icon.png",
        bgColor: sdgColors.sdg8,
    },
    {
        id: "sdg9",
        sdgNumber: 9,
        title: "Tiên phong Đổi mới Sáng tạo",
        subtitle: "Công nghiệp, Đổi mới & Hạ tầng",
        description:
            "Chúng tôi không chỉ gia công phần mềm, chúng tôi kiến tạo môi trường để sinh viên tự do thử nghiệm các công nghệ mới nhất (AI, Low-code) trên các bài toán thực tế. Mục tiêu chuyển giao ít nhất 10 sản phẩm số hóa hoàn thiện cho doanh nghiệp mỗi năm, thúc đẩy hạ tầng số tại ĐBSCL.",
        image: "/sdg-9-icon.png",
        bgColor: sdgColors.sdg9,
    },
    {
        id: "sdg17",
        sdgNumber: 17,
        title: "Kết nối Nguồn lực & Giá trị",
        subtitle: "Quan hệ đối tác vì các mục tiêu",
        description:
            "Xây dựng mạng lưới 'Doanh nghiệp đồng hành' bền chặt. Tại TSC, doanh nghiệp không chỉ là khách hàng mà còn là Mentor, cùng tham gia vào quá trình đào tạo. Chúng tôi là cầu nối tin cậy, rút ngắn khoảng cách giữa Giảng đường và Doanh nghiệp SME.",
        image: "/sdg-17-icon.png",
        bgColor: sdgColors.sdg17,
    },
];

export function About() {
    return (
        <SectionWrapper id="ve-chung-toi" background="light">
            {/* Section Title */}
            <SectionTitle
                title="Về Chúng Tôi"
                subtitle="TSC - Hệ sinh thái kết nối Sinh viên tài năng với Doanh nghiệp SME, thúc đẩy phát triển bền vững tại ĐBSCL"
            />

            {/* Introduction Text */}
            <motion.div
                variants={itemVariants}
                className="max-w-4xl mx-auto text-center mb-16"
            >
                <p className="text-lg text-gray-600 leading-relaxed">
                    <span className="font-semibold text-deep-blue">The Student Company (TSC)</span> ra đời với sứ mệnh
                    chuyển hóa kiến thức thành kỹ năng thực tiễn. Thông qua mô hình{" "}
                    <span className="font-semibold text-orange">&quot;Squad&quot;</span> linh hoạt,
                    chúng tôi kết nối nguồn lực sinh viên tài năng với các doanh nghiệp
                    SME, tạo ra cơ hội học hỏi và phát triển thực sự.
                </p>
            </motion.div>

            {/* SDG Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sdgData.map((sdg, index) => (
                    <motion.div
                        key={sdg.id}
                        variants={itemVariants}
                        custom={index}
                        className="h-[400px]"
                    >
                        <FlipCard
                            className="w-full h-full"
                            front={
                                <SDGCardFront
                                    sdgNumber={sdg.sdgNumber}
                                    title={sdg.title}
                                    subtitle={sdg.subtitle}
                                    image={sdg.image}
                                    bgColor={sdg.bgColor}
                                />
                            }
                            back={
                                <SDGCardBack
                                    sdgNumber={sdg.sdgNumber}
                                    title={sdg.title}
                                    description={sdg.description}
                                    bgColor={sdg.bgColor}
                                />
                            }
                        />
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}

// Mặt trước của SDG Card - Hiển thị icon chính thức của UN
interface SDGCardFrontProps {
    sdgNumber: number;
    title: string;
    subtitle: string;
    image: string;
    bgColor: string;
}

function SDGCardFront({
    sdgNumber,
    title,
    subtitle,
    image,
    bgColor,
}: SDGCardFrontProps) {
    return (
        <div
            className="w-full h-full rounded-2xl overflow-hidden flex flex-col shadow-xl relative"
            style={{ backgroundColor: bgColor }}
        >
            {/* SDG Badge - Top Left */}
            <div className="absolute top-4 left-4">
                <span
                    className="px-3 py-1 rounded-full text-sm font-bold bg-white/90"
                    style={{ color: bgColor }}
                >
                    SDG {sdgNumber}
                </span>
            </div>

            {/* SDG Official Icon with Circle - Center */}
            <div className="flex-1 flex items-center justify-center pt-6">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="relative w-28 h-28">
                        <Image
                            src={image}
                            alt={`SDG ${sdgNumber}`}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Content - Bottom */}
            <div className="px-6 pb-24 text-white text-center">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-outfit)]">
                    {title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-white/80">{subtitle}</p>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">
                Di chuột để xem thêm →
            </div>
        </div>
    );
}

// Mặt sau của SDG Card
interface SDGCardBackProps {
    sdgNumber: number;
    title: string;
    description: string;
    bgColor: string;
}

function SDGCardBack({ sdgNumber, title, description, bgColor }: SDGCardBackProps) {
    return (
        <div
            className="w-full h-full rounded-2xl p-8 bg-white border-2 flex flex-col items-center justify-center shadow-xl relative"
            style={{ borderColor: bgColor }}
        >
            {/* SDG Badge */}
            <div
                className="absolute top-4 left-4 rounded-full px-3 py-1 text-white"
                style={{ backgroundColor: bgColor }}
            >
                <span className="text-sm font-bold">SDG {sdgNumber}</span>
            </div>

            {/* Title */}
            <h3
                className="text-xl font-bold mb-4 text-center font-[family-name:var(--font-outfit)]"
                style={{ color: bgColor }}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center leading-relaxed text-sm">{description}</p>
        </div>
    );
}
