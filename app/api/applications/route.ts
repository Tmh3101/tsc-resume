import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { applicationSchema } from "@/lib/validations/application";
import { sendApplicationNotification } from "@/lib/email";

// =====================================================
// API Route: POST /api/applications
// Xử lý submit form ứng tuyển
// =====================================================

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate với Zod schema
        const validationResult = applicationSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: "Dữ liệu không hợp lệ",
                    errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Tạo Supabase client
        const supabase = createRouteHandlerClient();

        // Insert vào database
        const { data: insertedData, error } = await supabase
            .from("applications")
            .insert({
                full_name: data.full_name,
                phone: data.phone,
                email: data.email,
                university: data.university || null,
                major: data.major,
                portfolio_link: data.portfolio_link || null,
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", JSON.stringify(error, null, 2));
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            console.error("Error details:", error.details);
            console.error("Error hint:", error.hint);

            // Xử lý trùng email
            if (error.code === "23505") {
                return NextResponse.json(
                    { message: "Email này đã được đăng ký trước đó" },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                {
                    message: "Có lỗi xảy ra khi lưu dữ liệu",
                    error: error.message,
                    hint: error.hint,
                    code: error.code
                },
                { status: 500 }
            );
        }

        // Send email notification (fire and forget - don't await to not block response)
        sendApplicationNotification({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            university: data.university,
            major: data.major,
            portfolio_link: data.portfolio_link,
        }).catch((err) => console.error("Email notification error:", err));

        return NextResponse.json(
            {
                message: "Đăng ký thành công!",
                data: insertedData,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { message: "Có lỗi xảy ra, vui lòng thử lại" },
            { status: 500 }
        );
    }
}
