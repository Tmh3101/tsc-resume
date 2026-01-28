"use client";

import React from "react";
import {
    FileText,
    Check,
    X,
    RefreshCw,
    Search,
    Eye,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
    PageContainer,
    DataTable,
    Badge,
    ActionButton,
    FilterDropdown,
    Skeleton,
} from "@/components/admin/AdminUI";
import type { Application, ApplicationStatus } from "@/types";

// =====================================================
// Applications Management Page
// =====================================================

const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ duyệt" },
    { value: "reviewed", label: "Đã xem" },
    { value: "accepted", label: "Đã duyệt" },
    { value: "rejected", label: "Từ chối" },
];

export default function ApplicationsPage({ onMenuClick }: { onMenuClick?: () => void }) {
    const [applications, setApplications] = React.useState<Application[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filterStatus, setFilterStatus] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [updatingId, setUpdatingId] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("applications")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: ApplicationStatus) => {
        setUpdatingId(id);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("applications")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            // Update local state
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Có lỗi xảy ra khi cập nhật trạng thái");
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter applications
    const filteredApps = applications.filter((app) => {
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        const matchesSearch =
            searchQuery === "" ||
            app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Table columns
    const columns = [
        {
            key: "candidate",
            header: "Ứng viên",
            render: (app: Application) => (
                <div>
                    <p className="font-medium text-gray-900">{app.full_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{app.email}</p>
                    <p className="text-gray-400 text-xs">{app.phone}</p>
                </div>
            ),
        },
        {
            key: "university",
            header: "Trường",
            className: "hidden md:table-cell",
            render: (app: Application) => (
                <span className="text-gray-600">{app.university || "-"}</span>
            ),
        },
        {
            key: "major",
            header: "Vị trí",
            render: (app: Application) => (
                <span className="capitalize text-gray-700">{app.major}</span>
            ),
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
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Xem CV
                    </a>
                ) : (
                    <span className="text-gray-400 text-sm">-</span>
                ),
        },
        {
            key: "status",
            header: "Trạng thái",
            render: (app: Application) => <Badge status={app.status} />,
        },
        {
            key: "actions",
            header: "Hành động",
            render: (app: Application) => (
                <div className="flex items-center gap-1">
                    {app.status === "pending" && (
                        <>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatus(app.id, "reviewed")}
                                disabled={updatingId === app.id}
                                className="text-blue-600 hover:bg-blue-50"
                                title="Đánh dấu đã xem"
                            >
                                <Eye className="w-4 h-4" />
                            </ActionButton>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatus(app.id, "accepted")}
                                disabled={updatingId === app.id}
                                className="text-green-600 hover:bg-green-50"
                                title="Duyệt"
                            >
                                <Check className="w-4 h-4" />
                            </ActionButton>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatus(app.id, "rejected")}
                                disabled={updatingId === app.id}
                                className="text-red-600 hover:bg-red-50"
                                title="Từ chối"
                            >
                                <X className="w-4 h-4" />
                            </ActionButton>
                        </>
                    )}
                    {app.status === "reviewed" && (
                        <>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatus(app.id, "accepted")}
                                disabled={updatingId === app.id}
                                className="text-green-600 hover:bg-green-50"
                                title="Duyệt"
                            >
                                <Check className="w-4 h-4" />
                            </ActionButton>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatus(app.id, "rejected")}
                                disabled={updatingId === app.id}
                                className="text-red-600 hover:bg-red-50"
                                title="Từ chối"
                            >
                                <X className="w-4 h-4" />
                            </ActionButton>
                        </>
                    )}
                    {(app.status === "accepted" || app.status === "rejected") && (
                        <ActionButton
                            variant="ghost"
                            size="sm"
                            onClick={() => updateStatus(app.id, "pending")}
                            disabled={updatingId === app.id}
                            className="text-gray-600 hover:bg-gray-100"
                            title="Đặt lại"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </ActionButton>
                    )}
                </div>
            ),
        },
    ];

    const stats = {
        total: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        accepted: applications.filter((a) => a.status === "accepted").length,
    };

    return (
        <PageContainer
            title="Hồ sơ Ứng tuyển"
            description={`${stats.total} hồ sơ • ${stats.pending} chờ duyệt • ${stats.accepted} đã duyệt`}
            onMenuClick={onMenuClick}
            actions={
                <ActionButton
                    variant="secondary"
                    size="sm"
                    onClick={fetchApplications}
                    isLoading={isLoading}
                >
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                </ActionButton>
            }
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Status Filter */}
                <FilterDropdown
                    options={statusOptions}
                    value={filterStatus}
                    onChange={setFilterStatus}
                />
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredApps}
                isLoading={isLoading}
                emptyMessage="Không tìm thấy hồ sơ nào"
            />
        </PageContainer>
    );
}
