import { Resend } from "resend";

// =====================================================
// Email Service - Resend Integration with tsc.works domain
// =====================================================

// Lazy initialization - only create Resend client when needed
// This prevents build errors when RESEND_API_KEY is not set
let resendClient: Resend | null = null;

function getResendClient(): Resend {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("RESEND_API_KEY environment variable is not set");
        }
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

// Sender configuration - verified domain
const SENDER_EMAIL = "The Student Company <noreply@tsc.works>";

// Major labels mapping
const majorLabels: Record<string, string> = {
    dev: "Developer (Lập trình viên)",
    design: "Designer (Thiết kế)",
    content: "Content Creator (Sáng tạo nội dung)",
    other: "Khác",
};

interface ApplicationData {
    full_name: string;
    email: string;
    phone: string;
    university?: string | null;
    major: string;
    portfolio_link?: string | null;
}

/**
 * Send all application-related emails
 * 1. Admin notification (to multiple admins)
 * 2. Student confirmation
 */
export async function sendApplicationEmails(data: ApplicationData) {
    // Run both emails in parallel
    await Promise.allSettled([
        sendAdminNotification(data),
        sendStudentConfirmation(data),
    ]);
}

/**
 * Send email notification to Admin(s) when a new application is submitted
 * Supports multiple recipients via comma-separated env var
 */
async function sendAdminNotification(data: ApplicationData) {
    const adminEmailsString = process.env.ADMIN_EMAIL_NOTIFICATIONS;

    if (!adminEmailsString) {
        console.warn("ADMIN_EMAIL_NOTIFICATIONS not set, skipping admin notification");
        return;
    }

    // Support multiple emails separated by comma
    const adminEmails = adminEmailsString.split(",").map(email => email.trim()).filter(Boolean);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.tsc.works";

    const emailHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0e3963 0%, #1a5490 100%); padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
                                🎉 Có ứng viên mới gia nhập Talent Pool!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
                                Xin chào Admin,<br><br>
                                Một ứng viên mới vừa nộp đơn ứng tuyển vào TSC. Dưới đây là thông tin chi tiết:
                            </p>
                            
                            <!-- Info Table -->
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 500; width: 140px;">Họ và tên</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">${data.full_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 500;">Email</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                                        <a href="mailto:${data.email}" style="color: #0e3963; text-decoration: none;">${data.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 500;">Số điện thoại</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                                        <a href="tel:${data.phone}" style="color: #0e3963; text-decoration: none;">${data.phone}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 500;">Trường ĐH</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.university || "Không cung cấp"}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 500;">Vị trí</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                                        <span style="display: inline-block; background: #fef3cd; color: #b45309; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                                            ${majorLabels[data.major] || data.major}
                                        </span>
                                    </td>
                                </tr>
                                ${data.portfolio_link ? `
                                <tr>
                                    <td style="padding: 12px; color: #6b7280; font-weight: 500;">CV/Portfolio</td>
                                    <td style="padding: 12px; color: #111827;">
                                        <a href="${data.portfolio_link}" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; color: #1d4ed8; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                                            📄 Xem CV/Portfolio
                                        </a>
                                    </td>
                                </tr>
                                ` : ""}
                            </table>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin-top: 32px;">
                                <a href="${baseUrl}/admin/applications" style="display: inline-block; background: linear-gradient(135deg, #f29427 0%, #f5a623 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(242, 148, 39, 0.4);">
                                    Xem trong Admin Dashboard →
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                Email này được gửi tự động từ hệ thống TSC.<br>
                                © ${new Date().getFullYear()} The Student Company
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    try {
        await getResendClient().emails.send({
            from: SENDER_EMAIL,
            to: adminEmails,
            subject: `[TSC New App] Ứng viên mới: ${data.full_name}`,
            html: emailHtml,
        });
        console.log(`✅ Admin notification sent to ${adminEmails.join(", ")} for ${data.full_name}`);
    } catch (error) {
        console.error("❌ Failed to send admin notification:", error);
    }
}

/**
 * Send confirmation email to the student who applied
 */
async function sendStudentConfirmation(data: ApplicationData) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.tsc.works";

    const emailHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0e3963 0%, #1a5490 100%); padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
                                ✅ Xác nhận ứng tuyển thành công!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                                Xin chào <strong>${data.full_name}</strong>,<br><br>
                                Cảm ơn bạn đã quan tâm và ứng tuyển vào <strong>The Student Company (TSC)</strong>! 🎉
                            </p>
                            
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="color: #166534; font-size: 15px; margin: 0; line-height: 1.6;">
                                    📋 <strong>Chúng tôi đã nhận được hồ sơ của bạn!</strong><br><br>
                                    Đội ngũ TSC sẽ xem xét và phản hồi trong thời gian sớm nhất. 
                                    Trong thời gian chờ đợi, hãy theo dõi email để nhận thông tin cập nhật nhé.
                                </p>
                            </div>
                            
                            <!-- Summary -->
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
                                <strong>Thông tin đã đăng ký:</strong>
                            </p>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f9fafb; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 12px 16px; color: #6b7280; font-size: 14px;">Vị trí:</td>
                                    <td style="padding: 12px 16px; color: #111827; font-size: 14px; font-weight: 500;">${majorLabels[data.major] || data.major}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; color: #6b7280; font-size: 14px;">Email:</td>
                                    <td style="padding: 12px 16px; color: #111827; font-size: 14px;">${data.email}</td>
                                </tr>
                            </table>
                            
                            <!-- CTA -->
                            <div style="text-align: center; margin-top: 32px;">
                                <a href="${baseUrl}" style="display: inline-block; background: linear-gradient(135deg, #f29427 0%, #f5a623 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(242, 148, 39, 0.4);">
                                    Tìm hiểu thêm về TSC →
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                Thân ái,<br>
                                <strong>The Student Company</strong><br><br>
                                <span style="font-size: 12px;">
                                    Nếu bạn có thắc mắc, vui lòng phản hồi email này hoặc liên hệ 
                                    <a href="mailto:admin@tsc.works" style="color: #0e3963;">admin@tsc.works</a>
                                </span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    try {
        await getResendClient().emails.send({
            from: SENDER_EMAIL,
            to: data.email,
            subject: "[TSC] Xác nhận ứng tuyển thành công",
            html: emailHtml,
        });
        console.log(`✅ Confirmation email sent to student: ${data.email}`);
    } catch (error) {
        console.error("❌ Failed to send student confirmation:", error);
    }
}

// Keep the old function name for backward compatibility
export async function sendApplicationNotification(data: ApplicationData) {
    return sendApplicationEmails(data);
}
