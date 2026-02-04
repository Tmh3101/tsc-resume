"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                            Chính Sách Bảo Mật Thông Tin Người Dùng
                        </h1>
                        <p className="text-gray-600">
                            Ngày cập nhật: 03/02/2026 | Ngày hiệu lực: 03/02/2026
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none">
                        <p className="lead">
                            Sự riêng tư của bạn là yếu tố quan trọng đối với The Student Company (TSC). Vui lòng đọc kỹ 
                            Chính Sách Bảo Mật Thông Tin Người Dùng này vì nó là một phần của Điều Khoản Sử Dụng nhằm quản lý 
                            việc sử dụng các Dịch vụ trên nền tảng TSC.
                        </p>
                        <br />

                        <h2>1. THU THẬP DỮ LIỆU CÁ NHÂN</h2>
                        <br />
                        
                        <h3>1.1. Khi đăng ký Dịch vụ của TSC</h3>
                        <br />
                        <p>
                            Để cung cấp dịch vụ tạo và phân tích CV, TSC thu thập các dữ liệu sau:
                        </p>
                        <ul>
                            <li>
                                - <strong>Thông tin định danh:</strong> Họ tên, địa chỉ email, (được cung cấp bởi 
                                Google/GitHub khi bạn đăng nhập).
                            </li>
                            <li>
                                - <strong>Dữ liệu hồ sơ (CV):</strong> Các thông tin bạn nhập vào Resume Builder bao gồm: Số 
                                điện thoại, địa chỉ, lịch sử học vấn, kinh nghiệm làm việc, dự án, kỹ năng chuyên môn và hình ảnh cá nhân.
                            </li>
                            <li>
                                - <strong>Dữ liệu sử dụng:</strong> Nhật ký hệ thống về việc tạo, chỉnh sửa và xuất file PDF.
                            </li>
                        </ul>
                        <br />

                        <h3>1.2. Từ việc sử dụng các Dịch vụ của TSC</h3>
                        <br />
                        <p>
                            Từ việc truy cập và đồng ý với các nội dung điều khoản của Chính Sách Bảo Mật này, bạn đã cho phép 
                            TSC được thu thập, xử lý và kiểm soát các Dữ liệu Cá nhân của bạn cho các mục đích được nêu trong 
                            chính sách này.
                        </p>
                        <br />

                        <h2>2. MỤC ĐÍCH THU THẬP VÀ SỬ DỤNG DỮ LIỆU CÁ NHÂN</h2>
                        <br />
                        <p>Mục đích TSC xử lý Dữ liệu Cá nhân của bạn như sau:</p>
                        <ul>
                            <li>
                                - <strong>Cung cấp dịch vụ:</strong> Lưu trữ và hiển thị CV của bạn trên Dashboard.
                            </li>
                            <li>
                                - <strong>Phân tích AI:</strong> Sử dụng nội dung CV để chấm điểm ATS và gợi ý chỉnh sửa 
                                thông qua tính năng Resume Analyzer.
                            </li>
                        </ul>
                        <br />

                        <h2>3. CHIA SẺ DỮ LIỆU VỚI BÊN THỨ BA</h2>
                        <br />
                        <p>
                            TSC cam kết minh bạch và bảo vệ tuyệt đối dữ liệu cá nhân của bạn khi hợp tác với các đối tác công nghệ. Dữ liệu CV của bạn chỉ được gửi qua API để xử lý (inference) và <strong>tuyệt đối không</strong> được sử dụng để huấn luyện (train) bất kỳ mô hình công cộng nào của đối tác. Chúng tôi chỉ hợp tác với các đơn vị có chính sách <strong>Zero-retention</strong> (không lưu trữ dữ liệu) đối với API AI.
                        </p>
                        <br />
                        <ul>
                            <li>
                                - <strong>Cerebras AI:</strong> Đối tác xử lý ngôn ngữ tự nhiên (NLP) cho tính năng phân tích CV. Dữ liệu CV chỉ được gửi qua API để phân tích, <strong>không lưu trữ, không sử dụng để huấn luyện mô hình công cộng</strong>. Cerebras AI áp dụng <strong>Zero-retention policy</strong> cho mọi dữ liệu truyền qua API.
                            </li>
                            <li>
                                - <strong>Supabase:</strong> Đối tác cung cấp hạ tầng lưu trữ đám mây và xác thực bảo mật. Dữ liệu cá nhân và hồ sơ của bạn được lưu trữ an toàn trên hệ thống Supabase, tuân thủ các quy định bảo mật hiện hành.
                            </li>
                            <li>
                                - <strong>Nutrient:</strong> Đối tác xử lý chuyển đổi và xuất file PDF. Dữ liệu chỉ được sử dụng cho mục đích chuyển đổi định dạng, không lưu trữ lâu dài.
                            </li>
                        </ul>
                        <br />

                        <h2>4. QUYỀN CỦA BẠN ĐỐI VỚI CƠ SỞ DỮ LIỆU</h2>
                        <br />
                        
                        <p>Bạn có toàn quyền kiểm soát dữ liệu của mình:</p>
                        <ul>
                            <li>- <strong>Quyền truy cập:</strong> Xem và kiểm tra dữ liệu cá nhân của bạn bất kỳ lúc nào.</li>
                            <li>- <strong>Quyền khiếu nại:</strong> Liên hệ với chúng tôi nếu có bất kỳ lo ngại nào về quyền riêng tư.</li>
                        </ul>
                        <br />

                        <h2>5. LƯU TRỮ DỮ LIỆU CÁ NHÂN</h2>
                        <br />
                        
                        <p>
                            TSC sẽ lưu trữ Dữ liệu Cá nhân của bạn trong khoảng thời gian cần thiết để thực hiện các mục đích 
                            xử lý đã nêu trong chính sách này. Trong một số trường hợp đặc biệt, dữ liệu có thể được lưu trữ 
                            lâu hơn nếu có yêu cầu pháp lý buộc chúng tôi phải giữ lại thông tin.
                        </p>
                        <br />

                        <h2>6. BẢO MẬT DỮ LIỆU CÁ NHÂN</h2>
                        <br />
                        
                        <ul>
                            <li>
                                TSC đảm bảo bảo mật Dữ liệu Cá nhân của bạn. TSC có quy trình kỹ thuật và vật chất 
                                thích hợp để chống mất mát, trộm cắp và lạm dụng, cũng như chống lại việc truy cập trái phép, thay đổi và tiêu hủy thông tin.
                            </li>
                            <br />
                            <li>
                                Tuy nhiên, không có phương pháp truyền tải qua Internet hoặc phương pháp lưu trữ điện tử nào là 
                                an toàn 100%. Do đó, chúng tôi không thể đảm bảo bảo mật tuyệt đối.
                            </li>
                        </ul>
                        <br />

                        <h2>7. NGHĨA VỤ CỦA BẠN</h2>
                        <br />
                        
                        <ul>
                            <li>
                                Trong trường hợp bạn cung cấp Dữ liệu Cá nhân của một người nào đó khác cho TSC, bạn nên 
                                thông báo những người này về việc cung cấp Dữ liệu Cá nhân của họ cho TSC.
                            </li>
                            <br />
                            <li>
                                Bạn phải giữ bí mật thông tin đăng nhập và thông báo ngay cho TSC nếu phát hiện có dấu hiệu 
                                tài khoản bị xâm phạm.
                            </li>
                        </ul>
                        <br />

                        <h2>8. HẬU QUẢ, THIỆT HẠI KHÔNG MONG MUỐN CÓ KHẢ NĂNG XẢY RA</h2>
                        <br />
                        
                        <ul>
                            <li>Các đối tượng lừa đảo sử dụng Dữ liệu Cá nhân của bạn để thực hiện các mục tiêu bất hợp pháp 
                                sau khi được bạn chia sẻ.</li>
                            <br />
                            <li>Rò rỉ thông tin do lỗi kỹ thuật hoặc tấn công mạng bên ngoài.</li>
                        </ul>
                        <br />
                        <h2>9. LIÊN HỆ</h2>
                        <br />
                        <div className="space-y-2">
                            <p>
                                Nếu bạn có bất kỳ câu hỏi, yêu cầu hoặc khiếu nại liên quan đến Chính Sách Bảo Mật này, vui lòng liên hệ với đơn vị quản lý dữ liệu cá nhân của chúng tôi qua các thông tin sau:
                            </p>
                            <ul>
                                <li>- <strong>Email:</strong> <a href="mailto:kynd@titops.com" className="text-blue-600 underline">kynd@titops.com</a></li>
                                <li>- <strong>Hotline:</strong> <a href="tel:+84783767845" className="text-blue-600 underline">+84 783 767 845</a></li>
                                <li>- <strong>Địa chỉ:</strong> Ninh Kiều, Cần Thơ, Việt Nam</li>
                                <li>- <strong>Đơn vị quản lý:</strong> The Student Company (TSC)</li>
                            </ul>
                            <p>
                                Chúng tôi sẽ phản hồi và hỗ trợ bạn trong thời gian sớm nhất có thể.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}