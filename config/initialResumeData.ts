import { DEFAULT_FIELD_ORDER } from ".";
import { GlobalSettings, DEFAULT_CONFIG } from "../types/resume";

const initialGlobalSettings: GlobalSettings = {
  baseFontSize: 16,
  pagePadding: 32,
  paragraphSpacing: 12,
  lineHeight: 1.5,
  sectionSpacing: 10,
  headerSize: 18,
  subheaderSize: 16,
  useIconMode: true,
  themeColor: "#000000",
  centerSubtitle: true,
};

export const initialResumeState = {
  title: "Tạo CV mới",
  basic: {
    name: "Nguyễn Văn A",
    title: "Kỹ sư Frontend cao cấp",
    employementStatus: "Đang tìm việc",
    email: "nguyenvana@example.com",
    phone: "090-123-4567",
    location: "Quận Triều Dương, Bắc Kinh",
    birthDate: "1995-01",
    fieldOrder: DEFAULT_FIELD_ORDER,
    icons: {
      email: "Mail",
      phone: "Phone",
      birthDate: "CalendarRange",
      employementStatus: "Briefcase",
      location: "MapPin",
    },
    photoConfig: DEFAULT_CONFIG,
    customFields: [
      {
        id: "personal",
        label: "Trang web cá nhân",
        value: "https://nguyenvana.dev",
        icon: "Globe",
      },
    ],
    photo: "/avatar.png",
    githubKey: "",
    githubUseName: "",
    githubContributionsVisible: false,
  },
  education: [
    {
      id: "1",
      school: "Đại học Bắc Kinh",
      major: "Khoa học Máy tính",
      degree: "Cử nhân",
      startDate: "2013-09",
      endDate: "2017-06",
      visible: true,
      gpa: "",
      description: `<ul class="custom-list">
        <li>Môn học chính: Cấu trúc dữ liệu, Thiết kế thuật toán, Hệ điều hành, Mạng máy tính, Kỹ thuật phát triển Web</li>
        <li>Xếp hạng top 5% chuyên ngành, nhận học bổng hạng nhất liên tiếp 3 năm</li>
        <li>Giữ chức Trưởng ban Kỹ thuật của Hiệp hội Máy tính, tổ chức nhiều buổi chia sẻ kỹ thuật</li>
        <li>Tham gia đóng góp cho dự án mã nguồn mở, đạt chứng nhận GitHub Campus Expert</li>
      </ul>`,
    },
  ],
  skillContent: `<div class="skill-content">
  <ul class="custom-list">
    <li>Framework Frontend: Thành thạo React, Vue.js, cũng quen thuộc với Next.js, Nuxt.js và các framework SSR khác</li>
    <li>Ngôn ngữ: TypeScript, JavaScript(ES6+), HTML5, CSS3</li>
    <li>UI/Style: Thành thạo TailwindCSS, Sass/Less, CSS Modules, Styled-components</li>
    <li>Quản lý trạng thái: Redux, Vuex, Zustand, Jotai, React Query</li>
    <li>Công cụ build: Webpack, Vite, Rollup, Babel, ESLint</li>
    <li>Testing: Jest, React Testing Library, Cypress</li>
    <li>Tối ưu hiệu năng: Hiểu rõ render của trình duyệt, theo dõi chỉ số hiệu năng, code-splitting, lazy-loading</li>
    <li>Quản lý mã nguồn: Git, SVN</li>
    <li>Lãnh đạo kỹ thuật: Có kinh nghiệm quản lý đội ngũ, dẫn dắt chọn lựa công nghệ và thiết kế kiến trúc cho các dự án lớn</li>
  </ul>
</div>`,
  experience: [
    {
      id: "1",
      company: "ByteDance",
      position: "Kỹ sư Frontend cao cấp",
      date: "07/2021 - Hiện tại",
      visible: true,
      details: `<ul class="custom-list">
      <li>Phụ trách phát triển và bảo trì nền tảng Creator của Douyin/TikTok, dẫn dắt thiết kế giải pháp kỹ thuật cho các tính năng cốt lõi</li>
      <li>Tối ưu cấu hình build, giảm thời gian build từ 8 phút xuống 2 phút, nâng cao hiệu quả phát triển nhóm</li>
      <li>Thiết kế và triển khai thư viện component, tăng tỉ lệ tái sử dụng mã lên 70%, rút ngắn thời gian phát triển</li>
      <li>Dẫn dắt dự án tối ưu hiệu năng, giảm thời gian tải màn hình đầu tiên 50%, tích hợp hệ thống giám sát APM</li>
      <li>Hướng dẫn kỹ sư junior, tổ chức chia sẻ kỹ thuật để nâng cao trình độ đội ngũ</li>
    </ul>`,
    },
  ],
  draggingProjectId: null,
  projects: [
    {
      id: "p1",
      name: "Nền tảng Creator (Douyin/TikTok)",
      role: "Trưởng nhóm Frontend",
      date: "06/2022 - 12/2023",
      description: `<ul class="custom-list">
        <li>Nền tảng phân tích dữ liệu và quản lý nội dung cho creator, phục vụ triệu người dùng</li>
        <li>Bao gồm các hệ thống con: phân tích dữ liệu, quản lý nội dung, quản lý doanh thu</li>
        <li>Sử dụng Redux cho quản lý trạng thái, xử lý hiệu quả luồng dữ liệu phức tạp</li>
        <li>Sử dụng thư viện Ant Design để đảm bảo tính nhất quán về UI/UX</li>
        <li>Áp dụng code-splitting và lazy-loading để tối ưu hiệu năng tải ứng dụng quy mô lớn</li>
      </ul>`,
      visible: true,
    },
    {
      id: "p2",
      name: "Công cụ phát triển WeChat Mini Program",
      role: "Lõi phát triển",
      date: "03/2020 - 06/2021",
      description: `<ul class="custom-list">
        <li>Cung cấp giải pháp một cửa cho phát triển, gỡ lỗi và phát hành mini program</li>
        <li>Ứng dụng desktop đa nền tảng xây dựng bằng Electron</li>
        <li>Hỗ trợ phát triển trên nhiều nền tảng: Windows, macOS và Linux</li>
        <li>Cung cấp công cụ log lỗi và phân tích hiệu năng theo thời gian thực</li>
        <li>Tích hợp plugin và SDK bên thứ ba để mở rộng tính năng</li>
      </ul>`,
      visible: true,
    },
    {
      id: "p3",
      name: "Nền tảng giám sát Frontend",
      role: "Trưởng nhóm kỹ thuật",
      date: "09/2021 - 05/2022",
      description: `<ul class="custom-list">
        <li>Giải pháp giám sát frontend toàn diện: theo dõi lỗi, hiệu năng và phân tích hành vi người dùng</li>
        <li>Xây dựng trên Vue và Element UI, cung cấp dữ liệu giám sát theo thời gian thực và công cụ trực quan hóa</li>
        <li>Hỗ trợ nhiều chỉ số giám sát: log lỗi, chỉ số hiệu năng, phân tích hành vi</li>
        <li>Cung cấp công cụ phân tích chi tiết để hỗ trợ phát hiện và tối ưu vấn đề</li>
        <li>Tích hợp plugin/SDK bên thứ ba để mở rộng khả năng thu thập dữ liệu</li>
      </ul>`,
      visible: true,
    },
  ],
  menuSections: [
    { id: "basic", title: "Thông tin cơ bản", icon: "👤", enabled: true, order: 0 },
    { id: "skills", title: "Kỹ năng", icon: "⚡", enabled: true, order: 1 },
    {
      id: "experience",
      title: "Kinh nghiệm",
      icon: "💼",
      enabled: true,
      order: 2,
    },

    {
      id: "projects",
      title: "Dự án",
      icon: "🚀",
      enabled: true,
      order: 3,
    },
    {
      id: "education",
      title: "Học vấn",
      icon: "🎓",
      enabled: true,
      order: 4,
    },
  ],
  customData: {},
  activeSection: "basic",
  globalSettings: initialGlobalSettings,
};