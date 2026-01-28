import Link from "next/link";
import Image from "next/image";

// =====================================================
// Maintenance Page
// Hiển thị khi hệ thống đang bảo trì
// =====================================================

export default function MaintenancePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0e3963] via-[#1a5490] to-[#0e3963] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f29427]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f29427]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Content Card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-10 shadow-2xl">
                    {/* Maintenance Icon - Top Right */}
                    <div className="absolute -top-5 -right-5 sm:-top-6 sm:-right-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0e3963] backdrop-blur-sm rounded-full border-2 border-[#f29427]/50 shadow-lg">
                            <svg 
                                className="w-7 h-7 sm:w-8 sm:h-8 text-[#f29427] animate-spin-slow" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                                />
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                />
                            </svg>
                        </div>
                    </div>
                    <div 
                        className="inline-flex items-center gap-3 mb-8 transition-transform hover:scale-105"
                    >
                        <Image
                            src="/logo-tsc.png"
                            alt="TSC - The Student Company"
                            width={80}
                            height={80}
                            className="h-16 w-auto drop-shadow-lg"
                            priority
                        />
                        <span className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                            <span className="text-[#f29427]">T</span>SC
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        Hệ thống đang 
                        <span className="text-[#f29427]"> bảo trì</span>
                    </h1>
                    
                    <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed">
                        Chúng tôi đang cập nhật hệ thống để mang đến trải nghiệm tốt hơn.
                        <br className="hidden sm:block" />
                        Vui lòng quay lại sau.
                    </p>

                    {/* Animated dots */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <span className="w-3 h-3 bg-[#f29427] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-3 h-3 bg-[#f29427] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-3 h-3 bg-[#f29427] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/20 pt-6">
                        <p className="text-white/60 text-sm">
                            Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ:
                        </p>
                        <a 
                            href="mailto:kynd@titops.com"
                            className="inline-flex items-center gap-2 mt-2 text-[#f29427] hover:text-[#ffb54d] transition-colors font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            kynd@titops.com
                        </a>
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
