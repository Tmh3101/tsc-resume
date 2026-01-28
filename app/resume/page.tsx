import UploadForm from "@/components/analyze/UploadForm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Resume Analyzer - TSC | The Student Company",
  description: "Phân tích CV của bạn với AI để nhận feedback cá nhân hóa và tối ưu cho vị trí mơ ước.",
};

export default async function UploadPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="hero-decor" aria-hidden="true" />

      <section className="page-shell gap-12">
        {/* Logo */}
        <Link 
          href="/" 
          className="relative z-10 inline-flex items-center gap-3 w-fit transition-transform hover:scale-105"
          aria-label="Trở về trang chủ"
        >
          <Image
            src="/logo-tsc.png"
            alt="TSC - The Student Company"
            width={120}
            height={120}
            className="h-16 w-auto sm:h-20 md:h-24 drop-shadow-lg"
            priority
          />
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-inter)] drop-shadow-lg">
            <span className="text-orange">T</span>SC
          </span>
        </Link>

        {/* Header */}
        <header className="flex flex-col gap-4 max-w-3xl relative z-10">
          <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass w-fit"
          >
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                 Phân tích CV với AI
              </span>
          </div>
          <h1 className={`
            text-3xl md:text-4xl lg:text-5xl font-bold
            font-[family-name:var(--font-outfit)]
            text-orange
          `}>
            Nhận feedback cá nhân hóa cho
            <span className="text-deep-blue italic"> công việc mơ ước của bạn</span>
          </h1>
          <p className="subheadline text-white/80 md:text-muted">
            Cung cấp vị trí bạn đang hướng đến, chúng tôi sẽ trả về coaching phù hợp ATS, 
            các bước tiếp theo và xem trước CV trong vài giây.
          </p>
        </header>

        {/* Upload Form */}
        <UploadForm />
      </section>
    </main>
  );
}
