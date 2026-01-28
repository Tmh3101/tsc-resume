"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";

// =====================================================
// Portfolio Section - Auto-sliding Project Showcase
// =====================================================

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    images: string[];
    color: string;
    link: string;
}

const projects: Project[] = [
    {
        id: "blockaithon",
        title: "BlockAiThon",
        category: "LandingPage",
        description: "Landing page cho cuộc thi Hackathon về AI & Blockchain với prize pool 10.000 USD",
        images: ["/portfolio/blockaithon.png"],
        color: "from-blue-600 to-indigo-600",
        link: "https://blockaithon.com/",
    },
    {
        id: "kathome",
        title: "KatHome In Town",
        category: "Web Development",
        description: "Website hệ thống homestay và căn hộ cho thuê tại Hà Nội với giao diện hiện đại",
        images: [
            "/portfolio/kathome-3.jpg",
            "/portfolio/kathome-1.jpg",
            "/portfolio/kathome-2.jpg",
        ],
        color: "from-emerald-600 to-teal-600",
        link: "https://kathomeintown.vn/",
    },
    {
        id: "solemate",
        title: "Solemate Official",
        category: "Creative Design",
        description: "Thiết kế banner và ấn phẩm marketing cho thương hiệu giày Solemate",
        images: [
            "/portfolio/solemate-1.png",
            "/portfolio/solemate-2.png",
            "/portfolio/solemate-3.png",
        ],
        color: "from-cyan-500 to-blue-500",
        link: "https://shopee.vn/solematehcm",
    },
];

export function Portfolio() {
    const [currentProject, setCurrentProject] = React.useState(0);
    const [currentImage, setCurrentImage] = React.useState(0);
    const [isAutoPlay, setIsAutoPlay] = React.useState(true);

    // Auto-slide effect
    React.useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            const project = projects[currentProject];
            if (currentImage < project.images.length - 1) {
                setCurrentImage((prev) => prev + 1);
            } else {
                // Move to next project
                setCurrentProject((prev) => (prev + 1) % projects.length);
                setCurrentImage(0);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentProject, currentImage, isAutoPlay]);

    const handleProjectChange = (index: number) => {
        setCurrentProject(index);
        setCurrentImage(0);
        setIsAutoPlay(false);
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const handlePrev = () => {
        const project = projects[currentProject];
        if (currentImage > 0) {
            setCurrentImage((prev) => prev - 1);
        } else {
            const prevProject = (currentProject - 1 + projects.length) % projects.length;
            setCurrentProject(prevProject);
            setCurrentImage(projects[prevProject].images.length - 1);
        }
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const handleNext = () => {
        const project = projects[currentProject];
        if (currentImage < project.images.length - 1) {
            setCurrentImage((prev) => prev + 1);
        } else {
            setCurrentProject((prev) => (prev + 1) % projects.length);
            setCurrentImage(0);
        }
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const project = projects[currentProject];

    return (
        <SectionWrapper id="portfolio" background="dark">
            <SectionTitle
                title="Dự Án Tiêu Biểu"
                subtitle="Những sản phẩm thực tế từ đội ngũ TSC - Kết quả của sự sáng tạo và công nghệ"
                light
            />

            <motion.div
                variants={itemVariants}
                className="relative max-w-6xl mx-auto"
            >
                {/* Main Slider Container */}
                <div
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10"
                    onMouseEnter={() => setIsAutoPlay(false)}
                    onMouseLeave={() => setIsAutoPlay(true)}
                >
                    {/* Project Tabs */}
                    <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
                        {projects.map((p, index) => (
                            <button
                                key={p.id}
                                onClick={() => handleProjectChange(index)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                    transition-all duration-300
                                    ${currentProject === index
                                        ? `bg-gradient-to-r ${p.color} text-white shadow-lg`
                                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                                    }
                                `}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>

                    {/* Image Slider */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentProject}-${currentImage}`}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={project.images[currentImage]}
                                    alt={`${project.title} - ${currentImage + 1}`}
                                    className="w-full h-full object-contain bg-black/20"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Project Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white mb-3`}>
                                        {project.category}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
                                        {project.title}
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base mt-2 max-w-lg mb-4">
                                        {project.description}
                                    </p>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm border border-white/10"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Truy cập website
                                    </a>
                                </div>

                                {/* Image Indicators */}
                                <div className="flex items-center gap-2">
                                    {project.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setCurrentImage(idx);
                                                setIsAutoPlay(false);
                                                setTimeout(() => setIsAutoPlay(true), 10000);
                                            }}
                                            className={`
                                                h-2 rounded-full transition-all duration-300
                                                ${currentImage === idx
                                                    ? "w-8 bg-white"
                                                    : "w-2 bg-white/40 hover:bg-white/60"
                                                }
                                            `}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Auto-play Indicator */}
                        {isAutoPlay && (
                            <div className="absolute top-4 right-4">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Cards Preview */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {projects.map((p, index) => (
                        <motion.button
                            key={p.id}
                            onClick={() => handleProjectChange(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative rounded-xl overflow-hidden aspect-video
                                ${currentProject === index ? "ring-2 ring-orange ring-offset-2 ring-offset-deep-blue" : "opacity-60 hover:opacity-100"}
                                transition-all duration-300
                            `}
                        >
                            <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-white text-xs md:text-sm font-medium truncate">
                                    {p.title}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
