"use client";

import React from "react";
import { CalendarDays, Plus, Clock, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
    PageContainer,
    ActionButton,
    EmptyState,
    Skeleton,
    Badge,
} from "@/components/admin/AdminUI";

// =====================================================
// Schedules Management Page
// =====================================================

interface Schedule {
    id: string;
    student_id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    location: string | null;
    status: "scheduled" | "completed" | "canceled";
    created_at: string;
    applications?: {
        full_name: string;
        email: string;
    };
}

export default function SchedulesPage({ onMenuClick }: { onMenuClick?: () => void }) {
    const [schedules, setSchedules] = React.useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("schedules")
                .select(`
                    *,
                    applications:student_id (
                        full_name,
                        email
                    )
                `)
                .order("start_time", { ascending: true });

            if (error) throw error;
            setSchedules(data || []);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const dateStr = startDate.toLocaleDateString("vi-VN", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });

        const timeStr = `${startDate.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        })} - ${endDate.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        })}`;

        return { dateStr, timeStr };
    };

    const statusLabels: Record<string, string> = {
        scheduled: "Đã lên lịch",
        completed: "Hoàn thành",
        canceled: "Đã hủy",
    };

    // Group schedules by date
    const groupedSchedules = schedules.reduce((acc, schedule) => {
        const date = new Date(schedule.start_time).toLocaleDateString("vi-VN");
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(schedule);
        return acc;
    }, {} as Record<string, Schedule[]>);

    return (
        <PageContainer
            title="Lịch làm việc"
            description="Quản lý lịch làm việc của sinh viên"
            onMenuClick={onMenuClick}
            actions={
                <ActionButton variant="primary" size="sm">
                    <Plus className="w-4 h-4" />
                    Thêm lịch mới
                </ActionButton>
            }
        >
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            ) : schedules.length === 0 ? (
                <EmptyState
                    icon={CalendarDays}
                    title="Chưa có lịch làm việc"
                    description="Thêm lịch làm việc mới cho sinh viên"
                    action={
                        <ActionButton variant="primary" size="sm">
                            <Plus className="w-4 h-4" />
                            Thêm lịch mới
                        </ActionButton>
                    }
                />
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedSchedules).map(([date, items]) => (
                        <div key={date}>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 sticky top-0 bg-gray-50 py-1">
                                {date}
                            </h3>
                            <div className="space-y-3">
                                {items.map((schedule) => {
                                    const { timeStr } = formatTime(schedule.start_time, schedule.end_time);
                                    return (
                                        <div
                                            key={schedule.id}
                                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">
                                                        {schedule.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {schedule.applications?.full_name}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {timeStr}
                                                        </span>
                                                        {schedule.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {schedule.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge status={schedule.status}>
                                                    {statusLabels[schedule.status]}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
