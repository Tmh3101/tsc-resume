"use client";

import React from "react";
import {
    CalendarClock,
    Plus,
    Calendar,
    Clock,
    Video,
    User,
    RefreshCw,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    AlertCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
    PageContainer,
    Badge,
    ActionButton,
    EmptyState,
    Skeleton,
    FilterDropdown,
} from "@/components/admin/AdminUI";
import { Modal, FormInput, FormSelect, ConfirmDialog } from "@/components/admin/Modal";

// =====================================================
// Interviews Management Page
// Calendar-style view with candidate organization
// =====================================================

interface Application {
    id: string;
    full_name: string;
    email: string;
    major: string;
}

interface Interview {
    id: string;
    application_id: string;
    interview_date: string;
    interviewer_name: string | null;
    notes: string | null;
    meeting_link: string | null;
    result: "pending" | "passed" | "failed" | "canceled";
    created_at: string;
    applications?: Application;
}

interface InterviewFormData {
    application_id: string;
    interview_date: string;
    interview_time: string;
    interviewer_name: string;
    meeting_link: string;
    notes: string;
    result: Interview["result"];
}

const emptyFormData: InterviewFormData = {
    application_id: "",
    interview_date: "",
    interview_time: "",
    interviewer_name: "",
    meeting_link: "",
    notes: "",
    result: "pending",
};

const resultOptions = [
    { value: "pending", label: "Chờ phỏng vấn" },
    { value: "passed", label: "Đạt" },
    { value: "failed", label: "Không đạt" },
    { value: "canceled", label: "Đã hủy" },
];

const filterResultOptions = [
    { value: "all", label: "Tất cả kết quả" },
    { value: "pending", label: "Chờ phỏng vấn" },
    { value: "passed", label: "Đạt" },
    { value: "failed", label: "Không đạt" },
    { value: "canceled", label: "Đã hủy" },
];

const resultColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    passed: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    canceled: "bg-gray-100 text-gray-800 border-gray-200",
};

const resultLabels: Record<string, string> = {
    pending: "Chờ phỏng vấn",
    passed: "Đạt",
    failed: "Không đạt",
    canceled: "Đã hủy",
};

export default function InterviewsPage({ onMenuClick }: { onMenuClick?: () => void }) {
    const [interviews, setInterviews] = React.useState<Interview[]>([]);
    const [candidates, setCandidates] = React.useState<Application[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filterResult, setFilterResult] = React.useState("all");
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [viewMode, setViewMode] = React.useState<"calendar" | "list">("list");

    // Modal states
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [editingInterview, setEditingInterview] = React.useState<Interview | null>(null);
    const [deletingInterview, setDeletingInterview] = React.useState<Interview | null>(null);
    const [formData, setFormData] = React.useState<InterviewFormData>(emptyFormData);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [formError, setFormError] = React.useState("");

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            // Fetch interviews with candidate info
            const { data: interviewsData, error: interviewsError } = await supabase
                .from("interviews")
                .select(`
                    *,
                    applications (
                        id,
                        full_name,
                        email,
                        major
                    )
                `)
                .order("interview_date", { ascending: true });

            if (interviewsError) throw interviewsError;

            // Fetch candidates who can be scheduled (accepted or pending)
            const { data: candidatesData, error: candidatesError } = await supabase
                .from("applications")
                .select("id, full_name, email, major")
                .in("status", ["pending", "reviewed", "accepted"])
                .order("full_name");

            if (candidatesError) throw candidatesError;

            setInterviews(interviewsData || []);
            setCandidates(candidatesData || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Open modal for new interview
    const handleAdd = (date?: Date) => {
        setEditingInterview(null);
        setFormData({
            ...emptyFormData,
            interview_date: date ? date.toISOString().split("T")[0] : "",
            interview_time: "09:00",
        });
        setFormError("");
        setIsModalOpen(true);
    };

    // Open modal for editing
    const handleEdit = (interview: Interview) => {
        const date = new Date(interview.interview_date);
        setEditingInterview(interview);
        setFormData({
            application_id: interview.application_id,
            interview_date: date.toISOString().split("T")[0],
            interview_time: date.toTimeString().slice(0, 5),
            interviewer_name: interview.interviewer_name || "",
            meeting_link: interview.meeting_link || "",
            notes: interview.notes || "",
            result: interview.result,
        });
        setFormError("");
        setIsModalOpen(true);
    };

    // Open delete confirmation
    const handleDeleteClick = (interview: Interview) => {
        setDeletingInterview(interview);
        setIsDeleteDialogOpen(true);
    };

    // Save interview
    const handleSave = async () => {
        if (!formData.application_id) {
            setFormError("Vui lòng chọn ứng viên");
            return;
        }
        if (!formData.interview_date || !formData.interview_time) {
            setFormError("Vui lòng chọn ngày và giờ phỏng vấn");
            return;
        }

        setIsSaving(true);
        setFormError("");
        const supabase = createClient();

        try {
            const interviewDateTime = new Date(
                `${formData.interview_date}T${formData.interview_time}:00`
            ).toISOString();

            const dataToSave = {
                application_id: formData.application_id,
                interview_date: interviewDateTime,
                interviewer_name: formData.interviewer_name.trim() || null,
                meeting_link: formData.meeting_link.trim() || null,
                notes: formData.notes.trim() || null,
                result: formData.result,
            };

            if (editingInterview) {
                const { error } = await supabase
                    .from("interviews")
                    .update(dataToSave)
                    .eq("id", editingInterview.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("interviews")
                    .insert(dataToSave);

                if (error) throw error;
            }

            await fetchData();
            setIsModalOpen(false);
            setEditingInterview(null);
            setFormData(emptyFormData);
        } catch (err) {
            console.error("Error saving interview:", err);
            setFormError("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    // Delete interview
    const handleDelete = async () => {
        if (!deletingInterview) return;

        setIsDeleting(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("interviews")
                .delete()
                .eq("id", deletingInterview.id);

            if (error) throw error;

            setInterviews((prev) => prev.filter((i) => i.id !== deletingInterview.id));
            setIsDeleteDialogOpen(false);
            setDeletingInterview(null);
        } catch (err) {
            console.error("Error deleting interview:", err);
            alert("Có lỗi xảy ra khi xóa lịch phỏng vấn");
        } finally {
            setIsDeleting(false);
        }
    };

    // Update result inline
    const handleResultChange = async (interviewId: string, newResult: Interview["result"]) => {
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("interviews")
                .update({ result: newResult })
                .eq("id", interviewId);

            if (error) throw error;

            setInterviews((prev) =>
                prev.map((i) =>
                    i.id === interviewId ? { ...i, result: newResult } : i
                )
            );
        } catch (err) {
            console.error("Error updating result:", err);
        }
    };

    // Format date/time
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "numeric",
                month: "short",
            }),
            time: date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            full: date.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        };
    };

    // Group interviews by date
    const groupByDate = (interviews: Interview[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const groups: {
            today: Interview[];
            upcoming: Interview[];
            past: Interview[];
        } = { today: [], upcoming: [], past: [] };

        interviews.forEach((interview) => {
            const interviewDate = new Date(interview.interview_date);
            interviewDate.setHours(0, 0, 0, 0);

            if (interviewDate.getTime() === today.getTime()) {
                groups.today.push(interview);
            } else if (interviewDate > today) {
                groups.upcoming.push(interview);
            } else {
                groups.past.push(interview);
            }
        });

        return groups;
    };

    const groupedInterviews = groupByDate(interviews);

    // Filter interviews by result
    const filterInterviews = (list: Interview[]) => {
        if (filterResult === "all") return list;
        return list.filter((i) => i.result === filterResult);
    };

    const filteredGrouped = {
        today: filterInterviews(groupedInterviews.today),
        upcoming: filterInterviews(groupedInterviews.upcoming),
        past: filterInterviews(groupedInterviews.past),
    };

    const filteredTotal = filteredGrouped.today.length + filteredGrouped.upcoming.length + filteredGrouped.past.length;

    const stats = {
        total: interviews.length,
        pending: interviews.filter((i) => i.result === "pending").length,
        today: groupedInterviews.today.length,
    };

    // Render interview card
    const InterviewCard = ({ interview }: { interview: Interview }) => {
        const { date, time } = formatDateTime(interview.interview_date);
        const isPast = new Date(interview.interview_date) < new Date();

        return (
            <div
                className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all ${isPast ? "border-gray-200 opacity-75" : "border-gray-200"
                    }`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                                {interview.applications?.full_name || "Ứng viên"}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                                {interview.applications?.email}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {date}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {time}
                                </span>
                            </div>
                            {interview.meeting_link && (
                                <a
                                    href={interview.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                                >
                                    <Video className="w-4 h-4" />
                                    Tham gia meeting
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                        {/* Result dropdown */}
                        <select
                            value={interview.result}
                            onChange={(e) => handleResultChange(interview.id, e.target.value as Interview["result"])}
                            className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${resultColors[interview.result]
                                }`}
                        >
                            {resultOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* Edit/Delete */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleEdit(interview)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Chỉnh sửa"
                            >
                                <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(interview)}
                                className="p-1 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {interview.notes && (
                    <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        📝 {interview.notes}
                    </p>
                )}
            </div>
        );
    };

    // Render interview section
    const InterviewSection = ({
        title,
        interviews,
        icon,
        emptyText,
    }: {
        title: string;
        interviews: Interview[];
        icon: React.ReactNode;
        emptyText: string;
    }) => (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="font-semibold text-gray-900">
                    {title}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({interviews.length})
                    </span>
                </h3>
            </div>
            {interviews.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center bg-gray-50 rounded-lg">
                    {emptyText}
                </p>
            ) : (
                <div className="space-y-3">
                    {interviews.map((interview) => (
                        <InterviewCard key={interview.id} interview={interview} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <PageContainer
                title="Lịch Phỏng vấn"
                description={`${stats.total} lịch • ${stats.pending} chờ phỏng vấn • ${stats.today} hôm nay`}
                onMenuClick={onMenuClick}
                actions={
                    <div className="flex items-center gap-2">
                        <ActionButton
                            variant="secondary"
                            size="sm"
                            onClick={fetchData}
                            isLoading={isLoading}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton variant="primary" size="sm" onClick={() => handleAdd()}>
                            <Plus className="w-4 h-4" />
                            Lên lịch mới
                        </ActionButton>
                    </div>
                }
            >
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                ) : interviews.length === 0 ? (
                    <EmptyState
                        icon={CalendarClock}
                        title="Chưa có lịch phỏng vấn"
                        description="Lên lịch phỏng vấn cho các ứng viên"
                        action={
                            <ActionButton variant="primary" size="sm" onClick={() => handleAdd()}>
                                <Plus className="w-4 h-4" />
                                Lên lịch mới
                            </ActionButton>
                        }
                    />
                ) : (
                    <div>
                        {/* Filter */}
                        <div className="mb-4">
                            <FilterDropdown
                                options={filterResultOptions}
                                value={filterResult}
                                onChange={setFilterResult}
                            />
                        </div>

                        {filteredTotal === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Không tìm thấy lịch phỏng vấn nào với bộ lọc hiện tại
                            </div>
                        ) : (
                            <>
                                {/* Today */}
                                <InterviewSection
                                    title="Hôm nay"
                                    interviews={filteredGrouped.today}
                                    icon={<AlertCircle className="w-5 h-5 text-orange-500" />}
                                    emptyText="Không có lịch phỏng vấn hôm nay"
                                />

                                {/* Upcoming */}
                                <InterviewSection
                                    title="Sắp tới"
                                    interviews={filteredGrouped.upcoming}
                                    icon={<Calendar className="w-5 h-5 text-blue-500" />}
                                    emptyText="Không có lịch phỏng vấn sắp tới"
                                />

                                {/* Past */}
                                {filteredGrouped.past.length > 0 && (
                                    <InterviewSection
                                        title="Đã qua"
                                        interviews={filteredGrouped.past}
                                        icon={<Clock className="w-5 h-5 text-gray-400" />}
                                        emptyText=""
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
            </PageContainer>

            {/* Schedule Interview Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingInterview ? "Chỉnh sửa lịch phỏng vấn" : "Lên lịch phỏng vấn mới"}
                size="lg"
            >
                <div className="space-y-4">
                    {/* Candidate Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ứng viên <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.application_id}
                            onChange={(e) => setFormData((prev) => ({ ...prev, application_id: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!!editingInterview}
                        >
                            <option value="">-- Chọn ứng viên --</option>
                            {candidates.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.full_name} - {c.email} ({c.major})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Ngày phỏng vấn"
                            type="date"
                            value={formData.interview_date}
                            onChange={(v) => setFormData((prev) => ({ ...prev, interview_date: v }))}
                            required
                        />
                        <FormInput
                            label="Giờ phỏng vấn"
                            type="time"
                            value={formData.interview_time}
                            onChange={(v) => setFormData((prev) => ({ ...prev, interview_time: v }))}
                            required
                        />
                    </div>

                    {/* Interviewer & Link */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Người phỏng vấn"
                            value={formData.interviewer_name}
                            onChange={(v) => setFormData((prev) => ({ ...prev, interviewer_name: v }))}
                            placeholder="VD: Tech Lead, HR Manager"
                        />
                        <FormInput
                            label="Link Meeting"
                            value={formData.meeting_link}
                            onChange={(v) => setFormData((prev) => ({ ...prev, meeting_link: v }))}
                            placeholder="https://meet.google.com/..."
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ghi chú về buổi phỏng vấn..."
                        />
                    </div>

                    {/* Result (only when editing) */}
                    {editingInterview && (
                        <FormSelect
                            label="Kết quả"
                            value={formData.result}
                            onChange={(v) => setFormData((prev) => ({ ...prev, result: v as Interview["result"] }))}
                            options={resultOptions}
                        />
                    )}

                    {formError && (
                        <p className="text-sm text-red-500">{formError}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <ActionButton
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            {editingInterview ? "Cập nhật" : "Lên lịch"}
                        </ActionButton>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Xóa lịch phỏng vấn"
                message={`Bạn có chắc muốn xóa lịch phỏng vấn của "${deletingInterview?.applications?.full_name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
