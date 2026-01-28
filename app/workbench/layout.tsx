import { ReactNode } from "react";
import { Metadata } from "next";
import { Toaster } from "sonner";

// =====================================================
// Workbench Layout - Layout cho trang CV Editor
// =====================================================

export const metadata: Metadata = {
    title: "CV Editor - TSC",
    description: "Tạo và chỉnh sửa CV chuyên nghiệp với TSC CV Tools",
};

interface Props {
    children: ReactNode;
}

export default function WorkbenchLayout({ children }: Props) {
    return (
        <>
            {children}
            <Toaster position="top-center" richColors />
        </>
    );
}

