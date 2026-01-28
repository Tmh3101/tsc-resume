"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, FolderOpen, FilePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// =====================================================
// Navbar Component - Navigation bar với mobile menu
// =====================================================

const navLinks = [
    { href: "#ve-chung-toi", label: "Về chúng tôi" },
    { href: "#gia-tri", label: "Giá trị" },
    { href: "#lo-trinh", label: "Lộ trình" },
    { href: "#dich-vu", label: "Dịch vụ" },
    { href: "#portfolio", label: "Dự án" },
    { href: "#to-chuc", label: "Tổ chức" },
];

// CV Tools dropdown items
const cvToolsItems = [
    { href: "/dashboard", label: "Quản lý CV", icon: FolderOpen, description: "Xem và quản lý các CV của bạn" },
    { href: "/dashboard/templates", label: "Tạo CV", icon: FilePlus, description: "Tạo CV mới từ templates" },
    { href: "/resume", label: "Phân tích CV với AI", icon: Sparkles, description: "Nhận feedback từ AI" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isCVDropdownOpen, setIsCVDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Detect scroll để đổi background navbar
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu khi resize
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close dropdown khi click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCVDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Floating Navbar Container */}
            <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`
                        max-w-6xl mx-auto rounded-2xl
                        transition-all duration-300
                        ${isScrolled
                            ? "bg-deep-blue/90 backdrop-blur-xl shadow-2xl shadow-black/20 border border-white/10"
                            : "bg-deep-blue/60 backdrop-blur-md border border-white/5"
                        }
                    `}
                >
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between h-14 md:h-16">
                            {/* Logo */}
                            <a href="#hero" className="flex items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="TSC Logo"
                                    width={40}
                                    height={40}
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                                <span className="text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-inter)]">
                                    <span className="text-orange">T</span>SC
                                </span>
                            </a>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-8">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-white/80 hover:text-orange transition-colors duration-300 text-base font-medium"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>

                            {/* Desktop CTA */}
                            <div className="hidden md:flex items-center gap-3">
                                {/* CV Tools Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsCVDropdownOpen(!isCVDropdownOpen)}
                                        className={`
                                            flex items-center gap-2 pl-4 pr-3 py-1.5 text-sm font-medium rounded-lg
                                            text-white hover:text-orange
                                            border border-white/20 hover:border-orange
                                            transition-all duration-300
                                            ${isCVDropdownOpen ? 'bg-white/10 border-orange text-orange' : 'hover:bg-white/10'}
                                        `}
                                    >
                                        <span>CV Tools</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 mt-0.5 ${isCVDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isCVDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                                            >
                                                <div className="p-2">
                                                    {cvToolsItems.map((item) => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                onClick={() => setIsCVDropdownOpen(false)}
                                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                                            >
                                                                <div className="p-2 rounded-lg bg-deep-blue/5 group-hover:bg-orange/10 transition-colors">
                                                                    <Icon className="w-5 h-5 text-deep-blue group-hover:text-orange transition-colors" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-orange transition-colors">
                                                                        {item.label}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                                        {item.description}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button variant="primary" size="sm">
                                    <a href="#ung-tuyen">Ứng tuyển ngay</a>
                                </Button>
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-white"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </motion.nav>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 md:hidden"
                        >
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Menu Panel */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", duration: 0.3 }}
                                className="absolute top-0 right-0 w-3/4 h-full bg-deep-blue-dark p-6 pt-20"
                            >
                                <div className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-white text-lg py-2 border-b border-white/10 hover:text-orange transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ))}

                                    <div className="mt-6 flex flex-col gap-3">
                                        {/* CV Tools Section - Mobile */}
                                        <div className="border-b border-white/10 pb-4 mb-2">
                                            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">CV Tools</p>
                                            {cvToolsItems.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 py-2.5 text-white/80 hover:text-orange transition-colors"
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-base">{item.label}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-full"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <a href="#ung-tuyen">Ứng tuyển ngay</a>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
