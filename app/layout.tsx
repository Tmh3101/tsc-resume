import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";

// Font configuration - Inter cho tiêu đề, Open Sans cho nội dung
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-open-sans",
  display: "swap",
});

// SEO Metadata cho TSC
export const metadata: Metadata = {
  title: "The Student Company - Bệ Phóng Năng Lực & Đổi Mới Sáng Tạo",
  description:
    "TSC là hệ sinh thái khởi nghiệp và việc làm thực chiến cho sinh viên tại Cần Thơ. Chuyển hóa kiến thức thành kỹ năng, kết nối nguồn lực Sinh viên với Doanh nghiệp SME tại ĐBSCL.",
  keywords: [
    "TSC",
    "The Student Company",
    "khởi nghiệp sinh viên",
    "việc làm sinh viên",
    "Cần Thơ",
    "ĐBSCL",
    "thực tập",
    "talent pool",
  ],
  authors: [{ name: "The Student Company" }],
  openGraph: {
    title: "The Student Company - Bệ Phóng Năng Lực & Đổi Mới Sáng Tạo",
    description:
      "Hệ sinh thái khởi nghiệp và việc làm thực chiến cho sinh viên tại Cần Thơ",
    url: "https://www.tsc.works",
    siteName: "The Student Company",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://www.tsc.works/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Student Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Student Company - Bệ Phóng Năng Lực & Đổi Mới Sáng Tạo",
    description: "Hệ sinh thái khởi nghiệp và việc làm thực chiến cho sinh viên tại Cần Thơ",
    images: ["https://www.tsc.works/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Student Company",
    url: "https://thestudentcompany.vn",
    logo: "https://thestudentcompany.vn/logo.png",
    description: "Bệ Phóng Năng Lực & Đổi Mới Sáng Tạo cho sinh viên Cần Thơ",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Khu II, Đ. 3/2, P. Xuân Khánh, Q. Ninh Kiều",
      addressLocality: "TP. Cần Thơ",
      addressCountry: "VN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-000-000-000",
      contactType: "customer service",
      email: "info@thestudentcompany.vn",
    },
    sameAs: [
      "https://facebook.com/thestudentcompany",
      "https://linkedin.com/company/thestudentcompany",
    ],
  };

  return (
    <html lang="vi" className={`${inter.variable} ${openSans.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
