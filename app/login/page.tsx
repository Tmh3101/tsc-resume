"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

// =====================================================
// Login Page - Admin Authentication
// =====================================================

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data.session) {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: "linear-gradient(135deg, #082342 0%, #0e3963 50%, #1a5490 100%)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange to-orange-light flex items-center justify-center shadow-lg"
                    >
                        <LogIn className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-inter)]">
                        <span className="text-orange">TSC</span> Admin
                    </h1>
                    <p className="text-white/60 mt-2">
                        Đăng nhập để quản lý hệ thống
                    </p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-2xl"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@thestudentcompany.vn"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span className="text-red-700 text-sm">{error}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                <LogIn className="w-5 h-5" />
                                Đăng nhập vào Admin
                            </span>
                        </Button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Tài khoản admin được tạo trong{" "}
                            <span className="font-medium text-deep-blue">
                                Supabase Dashboard
                            </span>
                        </p>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <a
                        href="/"
                        className="text-white/60 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
                    >
                        ← Quay về trang chủ
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
