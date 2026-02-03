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

                        <h2>3. MẬT KHẨU VÀ BẢO MẬT</h2>
                        <br />
                        <p>
                            Quyền sở hữu tài khoản thuộc về TSC. Bạn đồng ý rằng tất cả các nội dung hiển thị trên dịch vụ TSC, 
                            bao gồm nhưng không giới hạn các thông tin mà bạn cung cấp cho TSC để hiển thị, sơ yếu lý lịch, 
                            lịch sử truy cập, các hình ảnh, dữ liệu mà TSC nhận được, hoặc thu thập được.
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

                        <h2>5. TUYÊN BỐ VỀ QUYỀN SỞ HỮU TRÍ TUỆ</h2>
                        <br />
                        <p>
                            Bạn tuyên bố và đảm bảo rằng bạn sở hữu Nội dung mà bạn đăng lên hoặc thông qua Dịch vụ hay nói cách 
                            khác, bạn có quyền cấp các quyền và giấy phép được quy định trong các Điều Khoản Sử Dụng này.
                        </p>
                        <br />
                        <p>
                            <strong>Tài sản của TSC:</strong> Giao diện ứng dụng, mã nguồn, logo thương hiệu và các mẫu thiết kế CV 
                            (Classic, Modern, Timeline...) thuộc bản quyền của TSC. Nghiêm cấm sao chép cho mục đích thương mại.
                        </p>
                        <br />
                        <p>
                            <strong>Tài sản của bạn:</strong> Bạn giữ toàn quyền sở hữu đối với nội dung thông tin cá nhân trong CV 
                            do bạn tạo ra.
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
                            Tính năng <strong>Resume Analyzer</strong> sử dụng công nghệ AI (Cerebras 120B) để đưa ra phân tích. 
                            Các kết quả chấm điểm và gợi ý chỉ mang tính chất tham khảo nhằm hỗ trợ bạn cải thiện hồ sơ.
                        </p>
                        <br />
                        <p>
                            TSC không cam kết hay đảm bảo việc sử dụng công cụ này sẽ giúp bạn chắc chắn nhận được việc làm.
                        </p>
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
                        <p>
                            Nếu bạn có câu hỏi về Điều Khoản Sử Dụng này, vui lòng liên hệ với chúng tôi để được giải đáp nhanh nhất.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}