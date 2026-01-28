import type { Feedback } from "@/types";

// =====================================================
// API Client Functions
// Centralized API calls for Resume Analyzer
// =====================================================

/**
 * Phân tích CV với AI
 * POST /api/resume-analyze
 */
export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobDescription: string
): Promise<{ resumeId: string; feedback: Feedback }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobTitle", jobTitle);
  formData.append("jobDescription", jobDescription);

  const response = await fetch("/api/resume-analyze", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to analyze resume");
  }

  return { resumeId: result.resumeId, feedback: result.feedback };
}

/**
 * Import job details từ URL
 * POST /api/resume-analyze/import-url
 */
export async function importJobFromUrl(url: string): Promise<{
  jobTitle: string;
  jobDescription: string;
}> {
  const response = await fetch("/api/resume-analyze/import-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to import job details");
  }

  return result.data;
}

/**
 * Import job details từ PDF
 * POST /api/resume-analyze/import-pdf
 */
export async function importJobFromPdf(file: File): Promise<{
  jobTitle: string;
  jobDescription: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/resume-analyze/import-pdf", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to import job details from PDF");
  }

  return result.data;
}

/**
 * Tạo lại tin nhắn tiếp cận LinkedIn
 * POST /api/resume-analyze/regenerate-dm
 */
export async function regenerateColdDM(
  resumeId: string,
  userFeedback: string
): Promise<{ coldOutreachMessage: string }> {
  const response = await fetch("/api/resume-analyze/regenerate-dm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeId, userFeedback }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to regenerate cold DM");
  }

  return { coldOutreachMessage: result.coldOutreachMessage };
}

/**
 * Lấy URL preview CV
 * GET /api/resume-analyze/resume/[id]/preview
 */
export async function getResumePreview(resumeId: string): Promise<{ cvUrl: string }> {
  const response = await fetch(`/api/resume-analyze/resume/${resumeId}/preview`);

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to get resume preview");
  }

  return { cvUrl: result.cvUrl };
}
