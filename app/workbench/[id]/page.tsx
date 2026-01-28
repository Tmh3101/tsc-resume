"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Eye, Edit2, PanelLeft, Minimize2 } from "lucide-react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { SidePanel } from "@/components/editor/SidePanel";
import { EditPanel } from "@/components/editor/EditPanel";
import PreviewPanel from "@/components/preview";
import { AutoSaveProvider } from "@/components/editor/AutoSaveProvider";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// =====================================================
// Workbench Page - Trang chỉnh sửa CV
// =====================================================

export const runtime = "edge";

function WorkbenchContent() {
    const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
    const [editPanelCollapsed, setEditPanelCollapsed] = useState(false);
    const [previewPanelCollapsed, setPreviewPanelCollapsed] = useState(false);

    const toggleSidePanel = useCallback(() => {
        setSidePanelCollapsed(prev => !prev);
    }, []);

    const toggleEditPanel = useCallback(() => {
        setEditPanelCollapsed(prev => !prev);
    }, []);

    return (
        <main
            className={cn(
                "w-full h-screen overflow-hidden flex flex-col",
                "bg-white text-gray-900",
                "dark:bg-neutral-900 dark:text-neutral-200"
            )}
        >
            <EditorHeader />
            
            {/* Bố cục Desktop */}
            <div className="hidden md:flex flex-1 overflow-hidden">
                {/* Bảng điều khiển bên - Side Panel */}
                <div
                    className={cn(
                        "h-full transition-all duration-300 ease-in-out overflow-hidden",
                        "bg-gray-50/50",
                        sidePanelCollapsed ? "w-0 min-w-0" : "w-[280px] min-w-[280px]"
                    )}
                >
                    <div className={cn(
                        "h-full w-[280px] overflow-y-auto",
                        sidePanelCollapsed && "invisible"
                    )}>
                        <SidePanel />
                    </div>
                </div>

                {/* Bảng chỉnh sửa - Edit Panel */}
                <div
                    className={cn(
                        "h-full transition-all duration-300 ease-in-out overflow-hidden",
                        "bg-gray-50/50",
                        editPanelCollapsed ? "w-0 min-w-0" : "w-[380px] min-w-[380px]"
                    )}
                >
                    <div className={cn(
                        "h-full w-[380px] overflow-y-auto bg-gray-50/50",
                        editPanelCollapsed && "invisible"
                    )}>
                        <EditPanel />
                    </div>
                </div>
                
                {/* Bảng xem trước - Preview Panel */}
                <div
                    className={cn(
                        "flex-1 h-full transition-all duration-300 ease-in-out overflow-hidden",
                        "bg-gray-100",
                        previewPanelCollapsed && "w-0 min-w-0 flex-none"
                    )}
                >
                    <div className={cn(
                        "h-full overflow-y-auto",
                        previewPanelCollapsed && "invisible"
                    )}>
                        <PreviewPanel
                            sidePanelCollapsed={sidePanelCollapsed}
                            editPanelCollapsed={editPanelCollapsed}
                            previewPanelCollapsed={previewPanelCollapsed}
                            toggleSidePanel={toggleSidePanel}
                            toggleEditPanel={toggleEditPanel}
                        />
                    </div>
                </div>
            </div>

            {/* Bố cục Mobile */}
            <div className="md:hidden flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <PreviewPanel
                        sidePanelCollapsed={true}
                        editPanelCollapsed={true}
                        previewPanelCollapsed={false}
                        toggleSidePanel={toggleSidePanel}
                        toggleEditPanel={toggleEditPanel}
                    />
                </div>
            </div>
        </main>
    );
}

export default function WorkbenchPage() {
    const params = useParams();
    const resumeId = params.id as string;
    const setActiveResume = useResumeStore((state) => state.setActiveResume);

    // Set active resume on mount
    useEffect(() => {
        if (resumeId) {
            setActiveResume(resumeId);
        }
    }, [resumeId, setActiveResume]);

    return (
        <AutoSaveProvider resumeId={resumeId}>
            <WorkbenchContent />
        </AutoSaveProvider>
    );
}
