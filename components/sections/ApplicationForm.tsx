"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import {
    applicationSchema,
    type ApplicationFormData,
    majorOptions
} from "@/lib/validations/application";
import { SectionWrapper, SectionTitle, itemVariants } from "@/components/ui/SectionWrapper";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

// =====================================================
// Application Form Section - Form ứng tuyển Talent Pool
// =====================================================

type FormStatus = "idle" | "loading" | "uploading" | "success" | "error";

export function ApplicationForm() {
    const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [cvFile, setCvFile] = React.useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            email: "",
            university: "",
            major: undefined,
            portfolio_link: "",
        },
    });

    // Upload file to Supabase Storage
    const uploadFile = async (file: File): Promise<string | null> => {
        try {
            const supabase = createClient();

            // Tạo tên file unique với timestamp
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${timestamp}_${sanitizedName}`;

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from("cv_uploads")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw new Error("Không thể tải lên file. Vui lòng thử lại.");
            }

            // Lấy public URL
            const { data: urlData } = supabase.storage
                .from("cv_uploads")
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    };

    // Submit handler
    const onSubmit = async (data: ApplicationFormData) => {
        setFormStatus("loading");
        setErrorMessage("");

        try {
            let cvUrl = data.portfolio_link || "";

            // Upload file nếu có
            if (cvFile) {
                setFormStatus("uploading");
                const uploadedUrl = await uploadFile(cvFile);
                if (uploadedUrl) {
                    cvUrl = uploadedUrl;
                }
            }

            // Gọi API route để submit form
            const response = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    portfolio_link: cvUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                const errorMsg = errorData.error
                    ? `${errorData.message}: ${errorData.error}${errorData.hint ? ` (${errorData.hint})` : ''}`
                    : errorData.message || "Có lỗi xảy ra";
                throw new Error(errorMsg);
            }

            setFormStatus("success");
            reset();
            setCvFile(null);

            // Reset sau 5 giây
            setTimeout(() => {
                setFormStatus("idle");
            }, 5000);
        } catch (error) {
            console.error("Form submission error:", error);
            setFormStatus("error");
            setErrorMessage(
                error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại"
            );
        }
    };

    return (
        <SectionWrapper id="ung-tuyen" background="gradient">
            <div className="max-w-5xl mx-auto">
                <SectionTitle
                    title="Gia Nhập Talent Pool"
                    subtitle="Đăng ký ngay để trở thành một phần của TSC và bắt đầu hành trình phát triển sự nghiệp"
                    light
                />

                {/* Form Container */}
                <motion.div
                    variants={itemVariants}
                    className="glass rounded-3xl p-8 md:p-12"
                >
                    {formStatus === "success" ? (
                        <SuccessMessage />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Row 1: Name & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <Input
                                    label="Họ và tên"
                                    placeholder="Nguyễn Văn A"
                                    error={errors.full_name?.message}
                                    required
                                    variant="glass"
                                    {...register("full_name")}
                                />
                                <Input
                                    label="Số điện thoại"
                                    placeholder="0912345678"
                                    error={errors.phone?.message}
                                    required
                                    variant="glass"
                                    {...register("phone")}
                                />
                            </div>

                            {/* Row 2: Email & University */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="email@example.com"
                                    error={errors.email?.message}
                                    required
                                    variant="glass"
                                    {...register("email")}
                                />
                                <Input
                                    label="Trường Đại học"
                                    placeholder="Đại học Cần Thơ"
                                    error={errors.university?.message}
                                    required
                                    variant="glass"
                                    {...register("university")}
                                />
                            </div>

                            {/* Row 3: Major */}
                            <Controller
                                name="major"
                                control={control}
                                render={({ field }) => (
                                    <FormSelect
                                        label="Vị trí ứng tuyển"
                                        options={majorOptions}
                                        placeholder="Chọn vị trí bạn muốn ứng tuyển"
                                        error={errors.major?.message}
                                        required
                                        variant="glass"
                                        {...field}
                                    />
                                )}
                            />

                            {/* Row 4: File Upload for CV */}
                            <FileUpload
                                label="CV / Portfolio"
                                onChange={(file) => setCvFile(file)}
                                value={cvFile}
                                isUploading={formStatus === "uploading"}
                                helperText="Tải lên CV hoặc Portfolio của bạn (PDF, DOC, DOCX - tối đa 5MB)"
                                variant="glass"
                            />

                            {/* Error Message */}
                            {formStatus === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{errorMessage}</p>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={formStatus === "loading" || formStatus === "uploading"}
                                    className="w-full h-14 text-base font-semibold rounded-lg"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <Send className="w-5 h-5" />
                                        {formStatus === "uploading" ? "Đang tải lên CV..." : "Gửi đơn ứng tuyển"}
                                    </span>
                                </Button>
                            </div>

                            {/* Privacy Note */}
                            <p className="text-center text-white/60 text-sm">
                                Bằng việc gửi form, bạn đồng ý cho phép TSC liên hệ qua email và số điện thoại
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>
        </SectionWrapper>
    );
}

// Success Message Component
function SuccessMessage() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
            >
                <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-inter)]">
                Đăng ký thành công!
            </h3>
            <p className="text-white/80 max-w-md mx-auto">
                Cảm ơn bạn đã quan tâm đến TSC. Chúng tôi sẽ xem xét hồ sơ và liên hệ với bạn
                trong thời gian sớm nhất.
            </p>
        </motion.div>
    );
}
