"use client";

import Link from "next/link";
import Image from "next/image";

// =====================================================
// 404 Not Found Page
// Trang hiển thị khi không tìm thấy đường dẫn
// =====================================================

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0e3963] via-[#1a5490] to-[#0e3963] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f29427]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f29427]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Content Card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-10 shadow-2xl">
                    {/* 404 Badge - Top Right */}
                    <div className="absolute -top-5 -right-5 sm:-top-6 sm:-right-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#f29427] rounded-full border-2 border-white/30 shadow-lg">
                            <span className="text-white font-bold text-lg sm:text-xl">404</span>
                        </div>
                    </div>

                    {/* Logo */}
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-3 mb-8 transition-transform hover:scale-105"
                    >
                        <Image
                            src="/logo-tsc.png"
                            alt="TSC - The Student Company"
                            width={80}
                            height={80}
                            className="h-14 w-auto sm:h-16 drop-shadow-lg"
                            priority
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                            <span className="text-[#f29427]">T</span>SC
                        </span>
                    </Link>

                    {/* Illustration - Astronaut Lost in Space */}
                    <div className="mb-6 relative">
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
                            {/* Floating stars */}
                            <div className="absolute top-2 left-4 w-2 h-2 bg-[#f29427] rounded-full animate-pulse" />
                            <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                            <div className="absolute bottom-12 left-2 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                            <div className="absolute bottom-6 right-8 w-2 h-2 bg-[#f29427]/60 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                            
                            {/* Planet ring */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-white/10 animate-spin-slow" />
                            
                            {/* Main illustration */}
                            <svg 
                                className="w-full h-full mx-auto floating"
                                viewBox="0 0 200 200"
                                fill="none"
                            >
                                {/* Astronaut body */}
                                <ellipse cx="100" cy="110" rx="35" ry="45" fill="white" opacity="0.9"/>
                                
                                {/* Helmet */}
                                <circle cx="100" cy="65" r="30" fill="white" opacity="0.95"/>
                                <circle cx="100" cy="65" r="24" fill="#0e3963" opacity="0.8"/>
                                <circle cx="100" cy="65" r="20" fill="url(#visorGradient)"/>
                                
                                {/* Helmet reflection */}
                                <ellipse cx="92" cy="58" rx="6" ry="4" fill="white" opacity="0.4"/>
                                
                                {/* Backpack */}
                                <rect x="125" y="85" width="20" height="40" rx="5" fill="white" opacity="0.8"/>
                                <rect x="128" y="90" width="4" height="8" rx="2" fill="#f29427"/>
                                <rect x="128" y="102" width="4" height="8" rx="2" fill="#f29427"/>
                                
                                {/* Arms */}
                                <ellipse cx="60" cy="100" rx="12" ry="8" fill="white" opacity="0.85" transform="rotate(-20 60 100)"/>
                                <ellipse cx="140" cy="95" rx="12" ry="8" fill="white" opacity="0.85" transform="rotate(30 140 95)"/>
                                
                                {/* Legs */}
                                <ellipse cx="85" cy="155" rx="10" ry="18" fill="white" opacity="0.85" transform="rotate(-10 85 155)"/>
                                <ellipse cx="115" cy="158" rx="10" ry="18" fill="white" opacity="0.85" transform="rotate(15 115 158)"/>
                                
                                {/* Boots */}
                                <ellipse cx="82" cy="172" rx="12" ry="8" fill="#0e3963" opacity="0.8"/>
                                <ellipse cx="120" cy="175" rx="12" ry="8" fill="#0e3963" opacity="0.8"/>
                                
                                {/* Question marks floating */}
                                <text x="45" y="55" fill="#f29427" fontSize="20" fontWeight="bold" opacity="0.8">?</text>
                                <text x="150" y="70" fill="#f29427" fontSize="16" fontWeight="bold" opacity="0.6">?</text>
                                <text x="155" y="140" fill="white" fontSize="14" fontWeight="bold" opacity="0.4">?</text>
                                
                                {/* Gradient definitions */}
                                <defs>
                                    <linearGradient id="visorGradient" x1="80" y1="45" x2="120" y2="85">
                                        <stop offset="0%" stopColor="#1a5490"/>
                                        <stop offset="50%" stopColor="#0e3963"/>
                                        <stop offset="100%" stopColor="#082342"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        Oops! Trang không 
                        <span className="text-[#f29427]"> tồn tại</span>
                    </h1>
                    
                    {/* Description */}
                    <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
                        Đường dẫn bạn đang tìm kiếm có thể đã bị xóa, đổi tên
                        <br className="hidden sm:block" />
                        hoặc tạm thời không khả dụng.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="
                                w-full sm:w-auto inline-flex items-center justify-center gap-2
                                px-6 py-3 rounded-xl
                                bg-[#f29427] hover:bg-[#d47d1a]
                                text-white font-semibold
                                transition-all duration-200
                                shadow-lg hover:shadow-xl hover:scale-105
                            "
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Về Trang chủ
                        </Link>
                        
                        <button
                            onClick={() => typeof window !== 'undefined' && window.history.back()}
                            className="
                                w-full sm:w-auto inline-flex items-center justify-center gap-2
                                px-6 py-3 rounded-xl
                                bg-white/10 hover:bg-white/20
                                text-white font-semibold
                                border border-white/30
                                transition-all duration-200
                            "
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Footer text */}
                <p className="mt-8 text-white/40 text-sm">
                    © {new Date().getFullYear()} The Student Company. All rights reserved.
                </p>
            </div>
        </main>
    );
}
