"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// =====================================================
// Admin Login Page
// =====================================================

export default function AdminLoginPage() {
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
            setError("Email hoặc mật khẩu không đúng");
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
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
                        <span className="text-orange">T</span>SC Admin
                    </h1>
                    <p className="text-white/60 mt-2">Đăng nhập để quản lý ứng viên</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <Input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-12"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500" />
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
                            Đăng nhập
                        </Button>
                    </form>

                    {/* Demo Note */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Tạo tài khoản admin trong Supabase Dashboard → Authentication → Users
                    </p>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                        ← Quay về trang chủ
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
