"use client";

import React from "react";
import { Loader2 } from "lucide-react";

// =====================================================
// Admin UI Components
// Shadcn/UI-like components for Admin Portal
// =====================================================

// Skeleton Loader
export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-md ${className}`}
        />
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color?: string;
    isLoading?: boolean;
}

export function StatCard({ title, value, icon: Icon, color = "text-blue-600", isLoading }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    {isLoading ? (
                        <Skeleton className="h-9 w-20 mt-1" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

// Status Badge
interface BadgeProps {
    status: "pending" | "reviewed" | "accepted" | "rejected" | string;
    children?: React.ReactNode;
}

const badgeStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    reviewed: "bg-blue-100 text-blue-800 border-blue-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    active: "bg-green-100 text-green-800 border-green-200",
    potential: "bg-gray-100 text-gray-800 border-gray-200",
    closed: "bg-red-100 text-red-800 border-red-200",
};

const badgeLabels: Record<string, string> = {
    pending: "Chờ duyệt",
    reviewed: "Đã xem",
    accepted: "Đã duyệt",
    rejected: "Từ chối",
    active: "Đang hợp tác",
    potential: "Tiềm năng",
    closed: "Đã dừng",
};

export function Badge({ status, children }: BadgeProps) {
    const style = badgeStyles[status] || badgeStyles.pending;
    const label = children || badgeLabels[status] || status;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {label}
        </span>
    );
}

// Data Table Component
interface Column<T> {
    key: string;
    header: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    isLoading,
    emptyMessage = "Không có dữ liệu",
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${col.className || ""}`}
                                    >
                                        {col.render
                                            ? col.render(item)
                                            : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Page Container
interface PageContainerProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    onMenuClick?: () => void;
}

export function PageContainer({ title, description, actions, children, onMenuClick }: PageContainerProps) {
    return (
        <div className="min-h-full">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {onMenuClick && (
                                <button
                                    onClick={onMenuClick}
                                    className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                                {description && (
                                    <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                                )}
                            </div>
                        </div>
                        {actions && (
                            <div className="flex items-center gap-3">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="p-4 lg:p-6">
                {children}
            </div>
        </div>
    );
}

// Loading Spinner
export function LoadingSpinner({ className = "" }: { className?: string }) {
    return <Loader2 className={`animate-spin ${className}`} />;
}

// Empty State
interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// Filter Dropdown
interface FilterOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function FilterDropdown({ options, value, onChange, label }: FilterDropdownProps) {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-sm text-gray-500">{label}</span>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

// Action Button
interface ActionButtonProps {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md";
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function ActionButton({
    variant = "primary",
    size = "md",
    onClick,
    disabled,
    isLoading,
    children,
    className = "",
    title,
}: ActionButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizeStyles = {
        sm: "text-xs px-2.5 py-1.5",
        md: "text-sm px-4 py-2",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            title={title}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}
