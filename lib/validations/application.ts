import { z } from "zod";

// =====================================================
// Application Form Validation Schema
// Matches Supabase table: applications
// =====================================================

// Major options tuple (maps to 'major' column in Supabase)
const majors = ["dev", "design", "content", "other"] as const;

// Schema validate form ứng tuyển
export const applicationSchema = z.object({
    full_name: z
        .string()
        .min(2, "Họ tên phải có ít nhất 2 ký tự")
        .max(100, "Họ tên không được quá 100 ký tự"),

    phone: z
        .string()
        .regex(
            /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/,
            "Số điện thoại không hợp lệ (VD: 0912345678)"
        ),

    email: z
        .string()
        .email("Email không hợp lệ")
        .max(255, "Email không được quá 255 ký tự"),

    university: z
        .string()
        .max(255, "Tên trường không được quá 255 ký tự")
        .optional()
        .or(z.literal("")),

    major: z.enum(majors, {
        message: "Vui lòng chọn vị trí ứng tuyển",
    }),

    portfolio_link: z
        .string()
        .url("URL không hợp lệ")
        .optional()
        .or(z.literal("")),
});

// Type inference từ schema
export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Options cho select major
export const majorOptions = [
    { value: "dev", label: "Developer (Lập trình viên)" },
    { value: "design", label: "Designer (Thiết kế)" },
    { value: "content", label: "Content Creator (Sáng tạo nội dung)" },
    { value: "other", label: "Khác" },
];
