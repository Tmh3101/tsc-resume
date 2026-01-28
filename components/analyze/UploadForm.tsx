"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/analyze/FileUploader";
import ImportJobModal from "@/components/analyze/ImportJobModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Globe, Sparkles, FileText, RefreshCw } from "lucide-react";
import { analyzeResume, importJobFromUrl, importJobFromPdf } from "@/lib/api";

const checklist = [
  {
    icon: <Sparkles className="w-5 h-5 text-orange" />,
    title: "Tùy chỉnh theo vị trí",
    description:
      "Chia sẻ tiêu đề công việc và mô tả để nhận lời khuyên phù hợp nhất.",
  },
  {
    icon: <FileText className="w-5 h-5 text-deep-blue" />,
    title: "Tải lên PDF rõ ràng",
    description:
      "Sử dụng layout đơn giản với tiêu đề rõ ràng để ATS đọc tốt nhất.",
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-orange" />,
    title: "Lặp lại nhanh chóng",
    description:
      "Chạy lại phân tích sau mỗi lần cập nhật để theo dõi tiến trình.",
  },
];

export default function UploadForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Tải lên CV của bạn để bắt đầu");
  const [file, setFile] = useState<File | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [touched, setTouched] = useState({
    jobTitle: false,
    jobDescription: false,
    file: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    jobTitle: "",
    jobDescription: "",
    file: "",
  });

  const validateJobTitle = (value: string): string => {
    if (!value.trim()) return "Vui lòng nhập vị trí ứng tuyển";
    return "";
  };

  const validateJobDescription = (value: string): string => {
    if (!value.trim()) return "Vui lòng nhập mô tả công việc";
    if (value.trim().length < 50) return "Cần ít nhất 50 ký tự";
    return "";
  };

  const validateFile = (fileToValidate: File | null): string => {
    if (!fileToValidate) return "Vui lòng tải lên CV";
    if (fileToValidate.type !== "application/pdf")
      return "Chỉ hỗ trợ file PDF";
    if (fileToValidate.size === 0) return "File có vẻ bị trống";
    if (fileToValidate.size > 20 * 1024 * 1024)
      return "File phải nhỏ hơn 20 MB";
    return "";
  };

  const handleFileSelect = (newFile: File | null) => {
    if (isProcessing) return;
    setFile(newFile);
    setTouched((prev) => ({ ...prev, file: true }));

    if (!newFile) {
      setFieldErrors((prev) => ({
        ...prev,
        file: validateFile(null),
      }));
      setStatusText("Tải lên CV của bạn để bắt đầu");
      return;
    }

    const error = validateFile(newFile);
    setFieldErrors((prev) => ({ ...prev, file: error }));

    if (error) {
      setStatusText(error);
      return;
    }

    setStatusText("CV đã sẵn sàng. Bắt đầu khi bạn muốn.");
  };

  const handleImportFromUrl = async (url: string) => {
    setIsImporting(true);

    try {
      const extracted = await importJobFromUrl(url);
      setJobTitle(extracted.jobTitle);
      setJobDescription(extracted.jobDescription);

      toast.success("Import thành công", {
        description: "Form đã được điền với thông tin trích xuất.",
      });

      setImportModalOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message.includes("Too many requests") ||
            error.message.includes("rate limit")
            ? "Quá nhiều yêu cầu. Vui lòng đợi và thử lại."
            : error.message.includes("Unauthorized")
              ? "Vui lòng đăng nhập để import."
              : error.message
          : "Không thể import. Vui lòng dán thủ công.";

      toast.error("Import thất bại", {
        description: errorMessage,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromPdf = async (file: File) => {
    setIsImporting(true);

    try {
      const extracted = await importJobFromPdf(file);
      setJobTitle(extracted.jobTitle);
      setJobDescription(extracted.jobDescription);

      toast.success("Import thành công", {
        description: "Form đã được điền với thông tin trích xuất.",
      });

      setImportModalOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage = error instanceof Error ? error.message : "";
      
      let toastTitle = "Import thất bại";
      let toastDescription = "Không thể import từ PDF. Vui lòng dán thủ công.";
      
      if (errorMessage.includes("Too many requests") || errorMessage.includes("rate limit")) {
        toastDescription = "Quá nhiều yêu cầu. Vui lòng đợi và thử lại.";
      } else if (errorMessage.includes("Unauthorized")) {
        toastDescription = "Vui lòng đăng nhập để import.";
      } else if (errorMessage.includes("không thể đọc") || errorMessage.includes("PDF_UNREADABLE") || errorMessage.includes("flatten") || errorMessage.includes("ảnh")) {
        toastTitle = "PDF không hỗ trợ";
        toastDescription = "File PDF này không thể đọc được. Vui lòng sử dụng file PDF có text có thể chọn được, không phải dạng ảnh.";
      } else if (errorMessage.includes("quá ít") || errorMessage.includes("INSUFFICIENT_CONTENT")) {
        toastTitle = "Nội dung không đủ";
        toastDescription = "File PDF chứa quá ít nội dung. Vui lòng sử dụng file mô tả công việc chi tiết hơn.";
      } else if (errorMessage) {
        toastDescription = errorMessage;
      }

      toast.error(toastTitle, {
        description: toastDescription,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing || !file) return;

    // Mark all fields as touched
    setTouched({
      jobTitle: true,
      jobDescription: true,
      file: true,
    });

    // Validate all fields
    const jobTitleError = validateJobTitle(jobTitle);
    const jobDescriptionError = validateJobDescription(jobDescription);
    const fileError = validateFile(file);

    setFieldErrors({
      jobTitle: jobTitleError,
      jobDescription: jobDescriptionError,
      file: fileError,
    });

    // Check for any errors
    if (jobTitleError || jobDescriptionError || fileError) {
      if (jobTitleError) {
        toast.error("Thiếu vị trí ứng tuyển", {
          description: jobTitleError,
        });
        return;
      }

      if (jobDescriptionError) {
        toast.error("Mô tả công việc chưa đủ", {
          description: jobDescriptionError,
        });
        return;
      }

      if (fileError) {
        toast.error("Lỗi file CV", {
          description: fileError,
        });
        return;
      }
    }

    setIsProcessing(true);
    setStatusText("Đang phân tích CV của bạn...");

    try {
      const { resumeId } = await analyzeResume(
        file,
        jobTitle.trim(),
        jobDescription.trim()
      );

      toast.success("Phân tích hoàn tất!");
      router.push(`/resume/${resumeId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Phân tích thất bại";

      if (
        errorMessage.includes("Too many requests") ||
        errorMessage.includes("rate limit")
      ) {
        toast.error("Vượt quá giới hạn", {
          description: "Vui lòng đợi và thử lại.",
        });
      } else if (errorMessage.includes("timeout")) {
        const hint = "PDF có thể quá phức tạp. Thử format đơn giản hơn.";
        toast.error("Yêu cầu hết thời gian", {
          description: hint,
        });
      } else if (errorMessage.includes("too detailed")) {
        toast.error("CV quá chi tiết", {
          description: "Vui lòng sử dụng format đơn giản hơn.",
        });
      } else if (errorMessage.includes("không thể đọc") || errorMessage.includes("PDF_UNREADABLE") || errorMessage.includes("flatten") || errorMessage.includes("ảnh")) {
        toast.error("CV không hỗ trợ", {
          description: "File PDF này không thể đọc được. Vui lòng sử dụng file PDF có text có thể chọn được, không phải dạng ảnh hoặc scan.",
        });
      } else {
        toast.error("Phân tích thất bại", { description: errorMessage });
      }

      setStatusText("Tải lên CV của bạn để bắt đầu");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] relative z-10">
        <form
          id="upload-form"
          onSubmit={handleSubmit}
          className="form-panel surface-card"
          aria-describedby="upload-status"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-bold text-deep-blue">
              Thông tin công việc
            </h2>
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              disabled={isProcessing || isImporting}
              className="secondary-button"
            >
              <Globe className="h-4 w-4" />
              Import tự động
            </button>
          </div>

          <div className="form-panel__grid">
            <div className="input-wrapper">
              <label htmlFor="job-title" className="input-label required">
                Vị trí ứng tuyển
              </label>
              <input
                type="text"
                id="job-title"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  if (touched.jobTitle) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      jobTitle: validateJobTitle(e.target.value),
                    }));
                  }
                }}
                onBlur={(event) => {
                  setTouched((prev) => ({ ...prev, jobTitle: true }));
                  setFieldErrors((prev) => ({
                    ...prev,
                    jobTitle: validateJobTitle(event.target.value),
                  }));
                }}
                placeholder="VD: Senior Product Designer"
                className={cn(
                  "input-field",
                  touched.jobTitle &&
                    fieldErrors.jobTitle &&
                    "!border-red-300 !bg-red-50/30",
                  touched.jobTitle &&
                    !fieldErrors.jobTitle &&
                    "!border-green-300 !bg-green-50/20",
                )}
                aria-invalid={touched.jobTitle && Boolean(fieldErrors.jobTitle)}
                aria-describedby={
                  touched.jobTitle && fieldErrors.jobTitle
                    ? "job-title-error"
                    : undefined
                }
                required
                disabled={isProcessing || isImporting}
              />
              {touched.jobTitle && fieldErrors.jobTitle && (
                <p
                  id="job-title-error"
                  className="text-sm font-medium text-red-600"
                  role="alert"
                >
                  {fieldErrors.jobTitle}
                </p>
              )}
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="job-description" className="input-label required">
              Mô tả công việc
            </label>
            <textarea
              rows={6}
              id="job-description"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (touched.jobDescription) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    jobDescription: validateJobDescription(e.target.value),
                  }));
                }
              }}
              onBlur={(event) => {
                setTouched((prev) => ({ ...prev, jobDescription: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  jobDescription: validateJobDescription(event.target.value),
                }));
              }}
              placeholder="Dán mô tả công việc bao gồm trách nhiệm và yêu cầu"
              className={cn(
                "textarea-field",
                touched.jobDescription &&
                  fieldErrors.jobDescription &&
                  "!border-red-300 !bg-red-50/30",
                touched.jobDescription &&
                  !fieldErrors.jobDescription &&
                  jobDescription.trim().length >= 50 &&
                  "!border-green-300 !bg-green-50/20",
              )}
              aria-invalid={
                touched.jobDescription && Boolean(fieldErrors.jobDescription)
              }
              aria-describedby={
                touched.jobDescription && fieldErrors.jobDescription
                  ? "job-description-error"
                  : undefined
              }
              required
              disabled={isProcessing || isImporting}
            />
            {touched.jobDescription && fieldErrors.jobDescription && (
              <p
                id="job-description-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {fieldErrors.jobDescription}
              </p>
            )}
            {touched.jobDescription &&
              !fieldErrors.jobDescription &&
              jobDescription.trim().length >= 50 && (
                <p className="text-sm font-medium text-green-600">
                  ✓ Tốt rồi! ({jobDescription.trim().length} ký tự)
                </p>
              )}
          </div>

          <div className="input-wrapper">
            <h2 className="text-xl font-bold text-deep-blue mb-2">
              CV (PDF) <span className="text-orange">*</span>
            </h2>
            <FileUploader
              onFileSelect={handleFileSelect}
              onErrorChange={(message) => {
                setFieldErrors((prev) => ({ ...prev, file: message }));
              }}
              error={touched.file ? fieldErrors.file : ""}
              disabled={isProcessing || isImporting}
              inputId="resume-upload"
            />
            <p className="text-xs text-muted">
              File của bạn được lưu trữ an toàn để xem lại kết quả sau này.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="primary-button"
              type="submit"
              disabled={isProcessing || !file}
            >
              {isProcessing ? "Đang phân tích..." : "Phân tích CV"}
            </button>
            <span className="text-sm text-muted">
              {file ? "Sẵn sàng phân tích" : "Chọn file PDF để bắt đầu"}
            </span>
          </div>
        </form>

        <aside
          className="surface-card flex h-full min-h-[420px] flex-col gap-6"
          aria-live="polite"
        >
          <div className="flex flex-1 flex-col">
            {isProcessing ? (
              <div className="flex flex-1 flex-col gap-4 text-center">
                <div className="flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange/5 to-deep-blue/5 p-6 border border-border">
                  <img
                    src="/resume-scan.gif"
                    alt="Đang phân tích CV"
                    className="h-full w-full max-h-[320px] object-contain"
                  />
                </div>
                <p className="text-sm text-muted">
                  Giữ tab này mở. Chúng tôi sẽ chuyển hướng khi phân tích hoàn tất.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-deep-blue">
                  Trước khi tải lên
                </h2>
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li
                      key={item.title}
                      className="flex gap-4 rounded-xl border border-border bg-gradient-to-r from-white to-gray-50/50 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 mt-2">{item.icon}</div>
                      <div>
                        <p className="font-semibold text-deep-blue">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p
            id="upload-status"
            className="mt-auto text-sm font-semibold text-orange text-center"
          >
            {statusText}
          </p>
        </aside>
      </div>

      <ImportJobModal
        isOpen={importModalOpen}
        onCancel={() => {
          if (isImporting) return;
          setImportModalOpen(false);
        }}
        onImportUrl={handleImportFromUrl}
        onImportPdf={handleImportFromPdf}
      />
    </>
  );
}
