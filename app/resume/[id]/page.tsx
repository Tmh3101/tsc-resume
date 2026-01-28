import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Summary from "@/components/analyze/Summary";
import Details from "@/components/analyze/Details";
import ATS from "@/components/analyze/ATS";
import AnalysisSection from "@/components/analyze/AnalysisSection";
import PreviewCV from "@/components/analyze/PreviewImage";
import LineByLineImprovements from "@/components/analyze/LineByLineImprovements";
import ColdOutreach from "@/components/analyze/ColdOutreach";
import { Accordion } from "@/components/analyze/Accordion";
import { CheckCheck, Lightbulb, Pencil, MessageSquare } from "lucide-react";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import type { Feedback } from "@/types";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  console.log("Fetching resume analysis for ID:", id);
  const supabase = createRouteHandlerClient();
  const { data: resume, error: fetchError } = await supabase
    .from('resume_analyze')
    .select(`
      id,
      jobTitle: job_title,
      jobDescription: job_description,
      feedback,
      createdAt: created_at
    `)
    .eq('id', id)
    .single();

  if (fetchError || !resume) {
    console.log("Error fetching resume analysis:", fetchError);
    redirect("/");
  }

  const feedback = resume.feedback as unknown as Feedback;

  return (
    <>
      <main className="relative overflow-hidden">
        {/* Hero Background */}
        <div className="hero-decor" />
        
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
                text-deep-blue
              `}>
                <span className="-ml-1 text-orange italic">Vị trí</span>
                <br />
                {resume.jobTitle}
              </h1>
              <p className="subheadline text-white/80">
                Phân tích ngày{" "}
                {new Date(resume.createdAt).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
          </header>

          <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <aside className="preview-rail">
              <div className="surface-card surface-card--tight preview-rail__card">
                <div className="flex items-center justify-between">
                  <p className="eyebrow-tsc">
                    Xem trước CV
                  </p>
                </div>
                <div className="preview-rail__frame gradient-border">
                  <PreviewCV resumeId={resume.id} />
                </div>
              </div>
            </aside>

            <section className="feedback-section lg:pl-0">
              <div className="space-y-6">
                <div className="surface-card surface-card--tight">
                  <Summary feedback={feedback} />
                </div>

                <Accordion
                  className="space-y-5"
                  defaultOpen={["cold-outreach", "line-improvements"]}
                  allowMultiple
                  persistKey={`resume-${resume.id}`}
                  showControls
                >
                  {feedback.coldOutreachMessage && (
                    <AnalysisSection
                      id="cold-outreach"
                      icon={{ Icon: MessageSquare }}
                      title="Tin nhắn tiếp cận"
                      eyebrow="Mẫu tin nhắn LinkedIn"
                      description="Tin nhắn được cá nhân hóa dựa trên CV của bạn. Tùy chỉnh trước khi gửi."
                    >
                      <ColdOutreach
                        message={feedback.coldOutreachMessage}
                        resumeId={resume.id}
                      />
                    </AnalysisSection>
                  )}

                  <AnalysisSection
                    id="line-improvements"
                    icon={{ Icon: Pencil }}
                    title="Cải thiện từng dòng"
                    eyebrow="Gợi ý cụ thể"
                    description="Các đề xuất sẵn sàng sử dụng cho CV của bạn. Sao chép và áp dụng để nâng cao điểm số."
                    badge={{
                      label: "Gợi ý",
                      value: feedback.lineImprovements?.length || 0,
                    }}
                  >
                    <LineByLineImprovements
                      improvements={feedback.lineImprovements || []}
                    />
                  </AnalysisSection>

                  <AnalysisSection
                    id="ats"
                    icon={{ Icon: CheckCheck }}
                    title="Độ tương thích với ATS"
                    eyebrow="Điểm phân tích"
                    description="Giữ trên 80 điểm để đảm bảo CV của bạn được hệ thống ATS nhận diện tốt."
                    badge={{
                      label: "Điểm",
                      value: feedback.ATS.score || 0,
                    }}
                  >
                    <ATS
                      score={feedback.ATS.score || 0}
                      suggestions={feedback.ATS.tips || []}
                    />
                  </AnalysisSection>

                  <AnalysisSection
                    id="detailed-coaching"
                    icon={{ Icon: Lightbulb }}
                    title="Phân tích chi tiết"
                    eyebrow="Danh mục"
                    description="Mở rộng từng mục để xem những điểm tốt và những cải thiện cần thiết để nâng cao điểm số."
                    badge={{
                      label: "Mục",
                      value: 4,
                    }}
                  >
                    <Details feedback={feedback} />
                  </AnalysisSection>
                </Accordion>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
