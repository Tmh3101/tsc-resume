import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { CoreValues } from "@/components/sections/CoreValues";
import { Timeline } from "@/components/sections/Timeline";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { OrgStructure } from "@/components/sections/OrgStructure";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

// =====================================================
// Trang chủ Landing Page - The Student Company
// =====================================================

export default function Home() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* 1. Hero Section - Ấn tượng đầu tiên */}
        <Hero />

        {/* 2. About & Vision - Giới thiệu TSC và SDGs */}
        <About />

        {/* 3. Core Values - Giá trị cốt lõi T-S-C */}
        <CoreValues />

        {/* 4. Timeline - Lộ trình IPIAL 5 bước */}
        <Timeline />

        {/* 5. Services - Dịch vụ Bento Grid */}
        <Services />

        {/* 6. Portfolio - Dự án tiêu biểu */}
        <Portfolio />

        {/* 7. Organization Structure - Mô hình Squad */}
        <OrgStructure />

        {/* 8. Application Form - Form ứng tuyển */}
        <ApplicationForm />
      </main>

      {/* 8. Footer - Thông tin liên hệ */}
      {/* 8. Footer - Thông tin liên hệ */}
      <Footer />

      {/* Scroll To Top Button */}
      <ScrollToTop />
    </>
  );
}
