import MaintenancePage from "@/components/admin/MaintenancePage";

// =====================================================
// Maintenance Route
// Trang hiển thị khi hệ thống đang bảo trì
// =====================================================

export const metadata = {
    title: "Hệ thống đang bảo trì - TSC | The Student Company",
    description: "Hệ thống đang được bảo trì. Vui lòng quay lại sau.",
};

export default function Maintenance() {
    return <MaintenancePage />;
}
