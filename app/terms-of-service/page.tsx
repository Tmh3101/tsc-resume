"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Quay lại</span>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo-tsc.png"
                            alt="TSC Logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="text-xl font-bold">
                            <span className="text-orange-500">T</span>SC
                        </span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Điều Khoản Sử Dụng Dịch Vụ
                        </h1>
                        <p className="text-gray-600">
                            Ngày cập nhật: 03/02/2026 | Ngày hiệu lực: 03/02/2026
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none">
                        <h2>1. ĐIỀU KHOẢN CHUNG</h2>
                        <br />
                        <p>
                            Bằng cách truy cập hoặc sử dụng trang web TSC, các dịch vụ, hoặc bất kỳ ứng dụng nào 
                            do The Student Company ("TSC") cung cấp (gọi chung là "Dịch vụ"), dù truy cập bằng cách nào, bạn đồng ý 
                            chịu sự ràng buộc của Điều Khoản Sử Dụng Dịch Vụ với Người Dùng này ("Điều Khoản Sử Dụng"). Dịch vụ 
                            do TSC sở hữu hoặc kiểm soát. Các Điều Khoản Sử Dụng này ảnh hưởng đến quyền và nghĩa vụ pháp lý của bạn.
                        </p>
                        <p>
                            Nếu bạn không đồng ý chịu sự ràng buộc của tất cả các Điều Khoản Sử Dụng này, bạn không thể truy cập 
                            hay sử dụng Dịch vụ. Nếu Bạn có bất kỳ câu hỏi nào liên quan đến Điều Khoản Sử Dụng này, vui lòng 
                            liên hệ chúng tôi.
                        </p>
                        <br />
                        <h2>2. ĐĂNG KÝ VÀ XÁC THỰC NGƯỜI DÙNG</h2>
                        <br />
                        <p>
                            Để sử dụng Dịch vụ bạn phải tạo một tài khoản theo yêu cầu của TSC, bạn cam kết rằng việc sử dụng 
                            tài khoản phải tuân thủ các quy định của TSC, đồng thời tất cả các thông tin bạn cung cấp cho chúng tôi 
                            là đúng, chính xác, mới nhất và đầy đủ tại thời điểm được yêu cầu.
                        </p>
                        <br />
                        <p>
                            TSC có thể chấm dứt quyền sử dụng một hoặc tất cả các dịch vụ của bạn mà không cần thông báo trước 
                            trong trường hợp bạn vi phạm các Quy chế của TSC hoặc có những hành vi ảnh hưởng đến hoạt động 
                            kinh doanh của TSC.
                        </p>
                        <br />

                        <h2>3. TÀI KHOẢN VÀ BẢO MẬT</h2>
                        <br />
                        <p>
                            Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản của mình (Google/GitHub). TSC chỉ cung cấp nền tảng để bạn lưu trữ, chỉnh sửa và quản lý dữ liệu hồ sơ cá nhân. Mọi hành vi để lộ, mất cắp thông tin đăng nhập dẫn đến rủi ro hoặc tổn thất, bạn hoàn toàn chịu trách nhiệm. Nếu phát hiện truy cập trái phép, bạn cần thông báo ngay cho TSC để được hỗ trợ kịp thời.
                        </p>
                        <br />

                        <h2>4. QUYỀN TRUY CẬP VÀ THU THẬP THÔNG TIN</h2>
                        <br />
                        <p>
                            Khi sử dụng dịch vụ TSC, bạn thừa nhận rằng bạn đồng ý cho chúng tôi có quyền thu thập các thông tin 
                            của bạn bao gồm:
                        </p>
                        <ul>
                            <li>- Thông tin cá nhân cơ bản: Họ tên, email, số điện thoại</li>
                            <li>- Thông tin hồ sơ nghề nghiệp: Kinh nghiệm làm việc, học vấn, kỹ năng</li>
                            <li>- Thông tin chung: Định hướng nghề nghiệp, mục tiêu công việc, trình độ năng lực</li>
                        </ul>
                        <br />

                        <h2>5. QUYỀN SỞ HỮU TRÍ TUỆ &amp; CẤP PHÉP SỬ DỤNG</h2>
                        <br />
                        <p>
                            <strong>5.1. Tài sản của TSC:</strong> Toàn bộ giao diện, mã nguồn, logo thương hiệu và các mẫu thiết kế CV (Classic, Modern, Timeline...) là tài sản trí tuệ độc quyền của TSC. Bạn không được phép sao chép, bán lại hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của TSC.
                        </p>
                        <br />
                        <p>
                            <strong>5.2. Tài sản của bạn:</strong> Bạn giữ toàn quyền sở hữu đối với nội dung văn bản, hình ảnh và dữ liệu hồ sơ cá nhân mà bạn nhập vào hệ thống.
                        </p>
                        <br />
                        <p>
                            <strong>5.3. Cấp phép cho TSC:</strong> Để TSC có thể cung cấp dịch vụ (lưu trữ, sao lưu, phân tích AI, hiển thị trên Dashboard), bạn đồng ý cấp cho TSC một giấy phép (license) miễn phí, không độc quyền để lưu trữ, sao chép, xử lý dữ liệu của bạn trong phạm vi cung cấp dịch vụ.
                        </p>
                        <br />

                        <h2>6. TRÁCH NHIỆM NGƯỜI DÙNG</h2>
                        <br />
                        <ul>
                            <li>- Bạn cam kết cung cấp thông tin trung thực, chính xác về kinh nghiệm và kỹ năng của bản thân.</li>
                            <li>- Không sử dụng nền tảng để phát tán nội dung độc hại, lừa đảo hoặc vi phạm pháp luật.</li>
                            <li>- Tự bảo mật tài khoản đăng nhập (Google/GitHub) của mình.</li>
                        </ul>
                        <br />

                        <h2>7. TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM VỀ AI</h2>
                        <br />
                        <p>
                            Tính năng <strong>Resume Analyzer</strong> sử dụng công nghệ AI tiên tiến (Cerebras 120B) để hỗ trợ bạn phân tích và cải thiện hồ sơ. Tuy nhiên:
                        </p>
                        <ul>
                            <li>Kết quả phân tích chỉ mang tính chất tham khảo.</li>
                            <li>AI có thể tạo ra nội dung không chính xác (hallucinations), bạn cần tự kiểm chứng lại thông tin trước khi gửi CV đi ứng tuyển.</li>
                            <li>TSC không cam kết hay đảm bảo việc sử dụng công cụ này sẽ giúp bạn chắc chắn nhận được việc làm.</li>
                        </ul>
                        <br />
                        <h2>8. HÀNH VI BỊ NGHIÊM CẤM</h2>
                        <br />
                        <ul>
                            <li>Không sử dụng bot, crawler hoặc các công cụ tự động để gửi lượng lớn yêu cầu đến máy chủ (spam API, spam phân tích CV).</li>
                            <li>Không cố tình nhập liệu nội dung độc hại, virus, hoặc trái thuần phong mỹ tục vào CV.</li>
                            <li>Không sao chép, dịch ngược (reverse engineer) mã nguồn, giao diện hoặc bất kỳ thành phần nào của nền tảng TSC.</li>
                        </ul>
                        <br />

                        <h2>8. THAY ĐỔI DỊCH VỤ</h2>
                        <br />
                        <p>
                            Chúng tôi có quyền cập nhật, bảo trì hoặc thay đổi tính năng hệ thống để nâng cao trải nghiệm. 
                            Trong trường hợp bảo trì, chúng tôi sẽ có thông báo cụ thể trên trang chủ.
                        </p>
                        <br />

                        <h2>9. LIÊN HỆ</h2>
                        <br />
                        <div className="space-y-2">
                            <p>Nếu bạn có bất kỳ câu hỏi, yêu cầu hoặc khiếu nại liên quan đến Điều Khoản Sử Dụng, vui lòng liên hệ với chúng tôi qua các thông tin sau:</p>
                            <ul>
                                <li>- <strong>Email:</strong> <a href="mailto:kynd@titops.com" className="text-blue-600 underline">kynd@titops.com</a></li>
                                <li>- <strong>Hotline:</strong> <a href="tel:+84783767845" className="text-blue-600 underline">+84 783 767 845</a></li>
                                <li>- <strong>Địa chỉ:</strong> Ninh Kiều, Cần Thơ, Việt Nam</li>
                            </ul>
                            <p>Chúng tôi sẽ phản hồi và hỗ trợ bạn trong thời gian sớm nhất có thể.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}