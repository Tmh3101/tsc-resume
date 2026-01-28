"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Heart, ExternalLink, Facebook, Linkedin, Github } from "lucide-react";

// =====================================================
// Footer Section
// =====================================================

// Navigation links
const quickLinks = [
    { href: "#ve-chung-toi", label: "Về chúng tôi" },
    { href: "#gia-tri", label: "Giá trị cốt lõi" },
    { href: "#lo-trinh", label: "Lộ trình IPIAL" },
    { href: "#dich-vu", label: "Dịch vụ" },
    { href: "#portfolio", label: "Dự án" },
    { href: "#ung-tuyen", label: "Ứng tuyển" },
];

// Social links
const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "GitHub", href: "#", icon: Github },
];

export function Footer() {
    return (
        <footer id="lien-he" className="bg-deep-blue-dark text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        {/* Logo */}
                        <div className="mb-6 -mt-4">
                            <Image
                                src="/logo.png"
                                alt="TSC Logo"
                                width={86}
                                height={86}
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
                            <span className="text-orange">The</span> Student Company
                        </h3>
                        <p className="text-white/70 leading-relaxed mb-2">
                            Hệ sinh thái khởi nghiệp và việc làm thực chiến cho sinh viên tại ĐBSCL.
                        </p>
                        <p className="text-orange font-medium italic text-sm mb-6">
                            "Where Talents Bloom"
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange transition-colors duration-300"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-lg font-semibold mb-4 font-[family-name:var(--font-outfit)]">
                            Liên kết nhanh
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-white/70 hover:text-orange transition-colors duration-300 inline-flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-lg font-semibold mb-4 font-[family-name:var(--font-outfit)]">
                            Thông tin liên hệ
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/70 text-sm">Hotline</p>
                                    <a
                                        href="tel:+84783767845"
                                        className="text-white hover:text-orange transition-colors"
                                    >
                                        +84 783 767 845
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/70 text-sm">Email</p>
                                    <a
                                        href="mailto:kynd@titops.com"
                                        className="text-white hover:text-orange transition-colors"
                                    >
                                        kynd@titops.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/70 text-sm">Địa chỉ</p>
                                    <p className="text-white">Quận Ninh Kiều, TP. Cần Thơ, Việt Nam</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                    {/* CTA Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bg-gradient-to-br from-orange/20 to-orange/5 rounded-2xl p-6 border border-orange/20">
                            <h4 className="text-lg font-semibold mb-3 font-[family-name:var(--font-outfit)]">
                                Sẵn sàng bắt đầu?
                            </h4>
                            <p className="text-white/70 text-sm mb-4">
                                Gia nhập TSC ngay hôm nay để bắt đầu hành trình phát triển sự nghiệp của bạn.
                            </p>
                            <motion.a
                                href="#ung-tuyen"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-block w-full text-center gradient-button px-6 py-3 rounded-xl font-semibold text-white"
                            >
                                <span>Ứng tuyển ngay</span>
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/60 text-sm text-center md:text-left">
                            © 2025 The Student Company. All rights reserved.
                        </p>
                        <p className="text-white/60 text-sm flex items-center gap-1">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by TSC Team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
