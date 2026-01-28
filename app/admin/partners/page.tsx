"use client";

import React from "react";
import {
    Building2,
    Plus,
    Phone,
    Mail,
    RefreshCw,
    Edit2,
    Trash2,
    MoreHorizontal,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
    PageContainer,
    DataTable,
    Badge,
    ActionButton,
    EmptyState,
    FilterDropdown,
} from "@/components/admin/AdminUI";
import { Modal, FormInput, FormSelect, ConfirmDialog } from "@/components/admin/Modal";

// =====================================================
// Partners Management Page
// =====================================================

interface Partner {
    id: string;
    company_name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    industry: string | null;
    status: "potential" | "active" | "closed";
    created_at: string;
}

interface PartnerFormData {
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    industry: string;
    status: "potential" | "active" | "closed";
}

const emptyFormData: PartnerFormData = {
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    industry: "",
    status: "potential",
};

const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "potential", label: "Tiềm năng" },
    { value: "active", label: "Đang hợp tác" },
    { value: "closed", label: "Đã dừng" },
];

const statusFormOptions = [
    { value: "potential", label: "Tiềm năng" },
    { value: "active", label: "Đang hợp tác" },
    { value: "closed", label: "Đã dừng" },
];

export default function PartnersPage({ onMenuClick }: { onMenuClick?: () => void }) {
    const [partners, setPartners] = React.useState<Partner[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filterStatus, setFilterStatus] = React.useState("all");

    // Modal states
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [editingPartner, setEditingPartner] = React.useState<Partner | null>(null);
    const [deletingPartner, setDeletingPartner] = React.useState<Partner | null>(null);
    const [formData, setFormData] = React.useState<PartnerFormData>(emptyFormData);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [formError, setFormError] = React.useState("");

    React.useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("partners")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPartners(data || []);
        } catch (err) {
            console.error("Error fetching partners:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Open modal for adding new partner
    const handleAdd = () => {
        setEditingPartner(null);
        setFormData(emptyFormData);
        setFormError("");
        setIsModalOpen(true);
    };

    // Open modal for editing partner
    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setFormData({
            company_name: partner.company_name,
            contact_person: partner.contact_person || "",
            email: partner.email || "",
            phone: partner.phone || "",
            industry: partner.industry || "",
            status: partner.status,
        });
        setFormError("");
        setIsModalOpen(true);
    };

    // Open delete confirmation
    const handleDeleteClick = (partner: Partner) => {
        setDeletingPartner(partner);
        setIsDeleteDialogOpen(true);
    };

    // Save partner (create or update)
    const handleSave = async () => {
        if (!formData.company_name.trim()) {
            setFormError("Vui lòng nhập tên công ty");
            return;
        }

        setIsSaving(true);
        setFormError("");
        const supabase = createClient();

        try {
            const dataToSave = {
                company_name: formData.company_name.trim(),
                contact_person: formData.contact_person.trim() || null,
                email: formData.email.trim() || null,
                phone: formData.phone.trim() || null,
                industry: formData.industry.trim() || null,
                status: formData.status,
            };

            if (editingPartner) {
                // Update existing
                const { error } = await supabase
                    .from("partners")
                    .update(dataToSave)
                    .eq("id", editingPartner.id);

                if (error) throw error;

                setPartners((prev) =>
                    prev.map((p) =>
                        p.id === editingPartner.id ? { ...p, ...dataToSave } : p
                    )
                );
            } else {
                // Create new
                const { data, error } = await supabase
                    .from("partners")
                    .insert(dataToSave)
                    .select()
                    .single();

                if (error) throw error;

                setPartners((prev) => [data, ...prev]);
            }

            setIsModalOpen(false);
            setEditingPartner(null);
            setFormData(emptyFormData);
        } catch (err) {
            console.error("Error saving partner:", err);
            setFormError("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    // Delete partner
    const handleDelete = async () => {
        if (!deletingPartner) return;

        setIsDeleting(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("partners")
                .delete()
                .eq("id", deletingPartner.id);

            if (error) throw error;

            setPartners((prev) => prev.filter((p) => p.id !== deletingPartner.id));
            setIsDeleteDialogOpen(false);
            setDeletingPartner(null);
        } catch (err) {
            console.error("Error deleting partner:", err);
            alert("Có lỗi xảy ra khi xóa đối tác");
        } finally {
            setIsDeleting(false);
        }
    };

    // Update status inline
    const handleStatusChange = async (partnerId: string, newStatus: Partner["status"]) => {
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from("partners")
                .update({ status: newStatus })
                .eq("id", partnerId);

            if (error) throw error;

            setPartners((prev) =>
                prev.map((p) =>
                    p.id === partnerId ? { ...p, status: newStatus } : p
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const filteredPartners = partners.filter(
        (p) => filterStatus === "all" || p.status === filterStatus
    );

    const columns = [
        {
            key: "company_name",
            header: "Công ty",
            render: (partner: Partner) => (
                <div>
                    <p className="font-medium text-gray-900">{partner.company_name}</p>
                    {partner.industry && (
                        <p className="text-gray-500 text-xs mt-0.5">{partner.industry}</p>
                    )}
                </div>
            ),
        },
        {
            key: "contact_person",
            header: "Người liên hệ",
            className: "hidden md:table-cell",
            render: (partner: Partner) => (
                <span className="text-gray-600">{partner.contact_person || "-"}</span>
            ),
        },
        {
            key: "contact",
            header: "Liên hệ",
            className: "hidden lg:table-cell",
            render: (partner: Partner) => (
                <div className="space-y-1">
                    {partner.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {partner.email}
                        </div>
                    )}
                    {partner.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {partner.phone}
                        </div>
                    )}
                    {!partner.email && !partner.phone && (
                        <span className="text-gray-400">-</span>
                    )}
                </div>
            ),
        },
        {
            key: "status",
            header: "Trạng thái",
            render: (partner: Partner) => (
                <select
                    value={partner.status}
                    onChange={(e) => handleStatusChange(partner.id, e.target.value as Partner["status"])}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {statusFormOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (partner: Partner) => (
                <div className="flex items-center gap-1">
                    <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(partner)}
                        title="Chỉnh sửa"
                    >
                        <Edit2 className="w-4 h-4" />
                    </ActionButton>
                    <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(partner)}
                        className="text-red-600 hover:bg-red-50"
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
                    </ActionButton>
                </div>
            ),
        },
    ];

    const stats = {
        total: partners.length,
        active: partners.filter((p) => p.status === "active").length,
    };

    return (
        <>
            <PageContainer
                title="Đối tác Doanh nghiệp"
                description={`${stats.total} đối tác • ${stats.active} đang hợp tác`}
                onMenuClick={onMenuClick}
                actions={
                    <div className="flex items-center gap-2">
                        <ActionButton
                            variant="secondary"
                            size="sm"
                            onClick={fetchPartners}
                            isLoading={isLoading}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton variant="primary" size="sm" onClick={handleAdd}>
                            <Plus className="w-4 h-4" />
                            Thêm đối tác
                        </ActionButton>
                    </div>
                }
            >
                {/* Filter */}
                <div className="mb-4">
                    <FilterDropdown
                        options={statusOptions}
                        value={filterStatus}
                        onChange={setFilterStatus}
                    />
                </div>

                {/* Data Table */}
                {partners.length === 0 && !isLoading ? (
                    <EmptyState
                        icon={Building2}
                        title="Chưa có đối tác"
                        description="Thêm đối tác doanh nghiệp mới"
                        action={
                            <ActionButton variant="primary" size="sm" onClick={handleAdd}>
                                <Plus className="w-4 h-4" />
                                Thêm đối tác
                            </ActionButton>
                        }
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredPartners}
                        isLoading={isLoading}
                        emptyMessage="Không tìm thấy đối tác nào"
                    />
                )}
            </PageContainer>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPartner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
            >
                <div className="space-y-4">
                    <FormInput
                        label="Tên công ty"
                        value={formData.company_name}
                        onChange={(v) => setFormData((prev) => ({ ...prev, company_name: v }))}
                        placeholder="VD: Công ty TNHH ABC"
                        required
                    />

                    <FormInput
                        label="Lĩnh vực hoạt động"
                        value={formData.industry}
                        onChange={(v) => setFormData((prev) => ({ ...prev, industry: v }))}
                        placeholder="VD: Công nghệ, Tài chính, ..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Người liên hệ"
                            value={formData.contact_person}
                            onChange={(v) => setFormData((prev) => ({ ...prev, contact_person: v }))}
                            placeholder="Họ và tên"
                        />

                        <FormInput
                            label="Số điện thoại"
                            value={formData.phone}
                            onChange={(v) => setFormData((prev) => ({ ...prev, phone: v }))}
                            placeholder="0912345678"
                        />
                    </div>

                    <FormInput
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))}
                        placeholder="email@company.com"
                    />

                    <FormSelect
                        label="Trạng thái"
                        value={formData.status}
                        onChange={(v) => setFormData((prev) => ({ ...prev, status: v as Partner["status"] }))}
                        options={statusFormOptions}
                    />

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
                            {editingPartner ? "Cập nhật" : "Thêm mới"}
                        </ActionButton>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Xóa đối tác"
                message={`Bạn có chắc muốn xóa đối tác "${deletingPartner?.company_name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
