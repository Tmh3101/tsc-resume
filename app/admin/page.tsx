"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    CalendarClock,
    Building2,
    CheckCircle,
    FileText,
    Calendar,
    Clock,
    Video,
    User,
    AlertTriangle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
    PageContainer,
    StatCard,
    Skeleton,
    DataTable,
    Badge,
    ActionButton,
} from "@/components/admin/AdminUI";
import type { Application } from "@/types";

// =====================================================
// Admin Dashboard Overview Page
// =====================================================

interface DashboardStats {
    totalApplications: number;
    pendingApplications: number;
    activePartners: number;
    acceptedStudents: number;
    todayInterviews: number;
    upcomingInterviews: number;
}

interface Interview {
    id: string;
    interview_date: string;
    result: string;
    meeting_link: string | null;
    applications?: {
        full_name: string;
        email: string;
        major: string;
    };
}

export default function AdminDashboardPage({ onMenuClick }: { onMenuClick?: () => void }) {
    const router = useRouter();
    const [stats, setStats] = React.useState<DashboardStats>({
        totalApplications: 0,
        pendingApplications: 0,
        activePartners: 0,
        acceptedStudents: 0,
        todayInterviews: 0,
        upcomingInterviews: 0,
    });
    const [recentApplications, setRecentApplications] = React.useState<Application[]>([]);
    const [todayInterviews, setTodayInterviews] = React.useState<Interview[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = React.useState<Interview[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            // Fetch applications count
            const { count: totalApps } = await supabase
                .from("applications")
                .select("*", { count: "exact", head: true });

            const { count: pendingApps } = await supabase
                .from("applications")
                .select("*", { count: "exact", head: true })
                .eq("status", "pending");

            const { count: acceptedStudents } = await supabase
                .from("applications")
                .select("*", { count: "exact", head: true })
                .eq("status", "accepted");

            // Fetch active partners count
            const { count: activePartners } = await supabase
                .from("partners")
                .select("*", { count: "exact", head: true })
                .eq("status", "active");

            // Fetch recent applications
            const { data: recentApps } = await supabase
                .from("applications")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            // Get today's date range
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            // Fetch today's interviews
            const { data: todayData } = await supabase
                .from("interviews")
                .select(`
                    *,
                    applications (
                        full_name,
                        email,
                        major
                    )
                `)
                .gte("interview_date", today.toISOString())
                .lt("interview_date", tomorrow.toISOString())
                .eq("result", "pending")
                .order("interview_date", { ascending: true });

            // Fetch upcoming interviews (next 7 days, excluding today)
            const { data: upcomingData } = await supabase
                .from("interviews")
                .select(`
                    *,
                    applications (
                        full_name,
                        email,
                        major
                    )
                `)
                .gte("interview_date", tomorrow.toISOString())
                .lt("interview_date", nextWeek.toISOString())
                .eq("result", "pending")
                .order("interview_date", { ascending: true })
                .limit(5);

            setStats({
                totalApplications: totalApps || 0,
                pendingApplications: pendingApps || 0,
                activePartners: activePartners || 0,
                acceptedStudents: acceptedStudents || 0,
                todayInterviews: todayData?.length || 0,
                upcomingInterviews: upcomingData?.length || 0,
            });

            setRecentApplications(recentApps || []);
            setTodayInterviews(todayData || []);
            setUpcomingInterviews(upcomingData || []);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });
    };

    // Table columns for recent applications
    const recentColumns = [
        {
            key: "full_name",
            header: "Ứng viên",
            render: (app: Application) => (
                <div>
                    <p className="font-medium text-gray-900">{app.full_name}</p>
                    <p className="text-gray-500 text-xs">{app.email}</p>
                </div>
            ),
        },
        {
            key: "major",
            header: "Vị trí",
            render: (app: Application) => (
                <span className="capitalize">{app.major}</span>
            ),
        },
        {
            key: "status",
            header: "Trạng thái",
            render: (app: Application) => <Badge status={app.status} />,
        },
        {
            key: "portfolio_link",
            header: "CV",
            render: (app: Application) =>
                app.portfolio_link ? (
                    <a
                        href={app.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                    >
                        <FileText className="w-3 h-3" />
                        Xem
                    </a>
                ) : (
                    <span className="text-gray-400">-</span>
                ),
        },
    ];

    // Interview Card Component
    const InterviewCard = ({ interview, showDate = false }: { interview: Interview; showDate?: boolean }) => (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                    {interview.applications?.full_name || "Ứng viên"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(interview.interview_date)}
                    </span>
                    {showDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(interview.interview_date)}
                        </span>
                    )}
                </div>
            </div>
            {interview.meeting_link && (
                <a
                    href={interview.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Tham gia meeting"
                >
                    <Video className="w-4 h-4" />
                </a>
            )}
        </div>
    );

    return (
        <PageContainer
            title="Tổng quan"
            description="Xem nhanh các số liệu quan trọng"
            onMenuClick={onMenuClick}
        >
            {/* Stats Grid - 2 rows of 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Tổng hồ sơ"
                    value={stats.totalApplications}
                    icon={Users}
                    color="text-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Chờ duyệt"
                    value={stats.pendingApplications}
                    icon={CalendarClock}
                    color="text-yellow-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="SV đã duyệt"
                    value={stats.acceptedStudents}
                    icon={CheckCircle}
                    color="text-green-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Đối tác"
                    value={stats.activePartners}
                    icon={Building2}
                    color="text-purple-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="PV hôm nay"
                    value={stats.todayInterviews}
                    icon={AlertTriangle}
                    color="text-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="PV sắp tới"
                    value={stats.upcomingInterviews}
                    icon={Calendar}
                    color="text-indigo-600"
                    isLoading={isLoading}
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Applications - 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Hồ sơ gần đây
                        </h2>
                        <ActionButton
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/admin/applications")}
                        >
                            Xem tất cả →
                        </ActionButton>
                    </div>
                    <DataTable
                        columns={recentColumns}
                        data={recentApplications}
                        isLoading={isLoading}
                        emptyMessage="Chưa có hồ sơ ứng tuyển nào"
                    />
                </div>

                {/* Interviews Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Today's Interviews */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                <h3 className="font-semibold text-gray-900">Phỏng vấn hôm nay</h3>
                            </div>
                            <span className="text-sm text-gray-500">{stats.todayInterviews}</span>
                        </div>
                        <div className="p-3">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            ) : todayInterviews.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    Không có phỏng vấn hôm nay
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {todayInterviews.map((interview) => (
                                        <InterviewCard key={interview.id} interview={interview} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Interviews */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Sắp tới (7 ngày)</h3>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/admin/interviews")}
                            >
                                Xem →
                            </ActionButton>
                        </div>
                        <div className="p-3">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            ) : upcomingInterviews.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    Không có phỏng vấn sắp tới
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {upcomingInterviews.map((interview) => (
                                        <InterviewCard
                                            key={interview.id}
                                            interview={interview}
                                            showDate
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
