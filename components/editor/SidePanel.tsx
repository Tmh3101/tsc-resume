"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Layout, Type, SpaceIcon, Palette, Zap, PlusCircle } from "lucide-react";
import debounce from "lodash/debounce";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LayoutSetting from "./layout/LayoutSetting";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { THEME_COLORS } from "@/types/resume";
import { Button } from "../ui/button";

// =====================================================
// Side Panel - Bảng cài đặt bên trái của CV Editor
// =====================================================

const fontOptions = [
    { value: "sans", label: "Sans Serif" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Monospace" },
];

const lineHeightOptions = [
    { value: "normal", label: "Mặc định" },
    { value: "relaxed", label: "Vừa phải" },
    { value: "loose", label: "Rộng rãi" },
];

function SettingCard({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "border shadow-lg overflow-hidden rounded-xl",
        "bg-white border-gray-100 shadow-deep-blue/20 p-0 gap-0",
      )}
    >
      <CardHeader className="px-4 py-3 bg-gradient-to-r from-deep-blue to-deep-blue/90 flex items-center">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-white">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

export function SidePanel() {
    const {
        activeResume,
        setActiveSection,
        toggleSectionVisibility,
        updateGlobalSettings,
        updateMenuSections,
        setThemeColor,
        reorderSections,
        addCustomData,
    } = useResumeStore();
    const {
        menuSections = [],
        globalSettings = {},
        activeSection,
    } = activeResume || {};

    const { themeColor = THEME_COLORS[0] } = globalSettings;

    const debouncedSetColor = useMemo(
        () =>
            debounce((value) => {
                setThemeColor(value);
            }, 100),
        []
    );

    const generateCustomSectionId = (menuSections: any[]) => {
        const customSections = menuSections.filter((s) =>
            s.id.startsWith("custom")
        );
        const nextNum = customSections.length + 1;
        return `custom-${nextNum}`;
    };

    const handleCreateSection = () => {
        const sectionId = generateCustomSectionId(menuSections);
        const newSection = {
            id: sectionId,
            title: sectionId,
            icon: "➕",
            enabled: true,
            order: menuSections.length,
        };

        updateMenuSections([...menuSections, newSection]);
        addCustomData(sectionId);
    };
    
    return (
        <motion.div
            className={cn(
                "w-full h-full overflow-y-auto",
                "dark:bg-neutral-950",
                "bg-gray-100"
            )}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
        >
            <div className="space-y-3 p-2">
                <SettingCard icon={Layout} title="Bố cục">
                    <LayoutSetting
                        menuSections={menuSections}
                        activeSection={activeSection || "basic"}
                        setActiveSection={setActiveSection}
                        toggleSectionVisibility={toggleSectionVisibility}
                        updateMenuSections={updateMenuSections}
                        reorderSections={reorderSections}
                    />
                    <Button onClick={handleCreateSection} className="w-full mt-2">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Thêm mục tùy chỉnh
                    </Button>
                </SettingCard>

                {/* Cài đặt màu chủ đề */}
                <SettingCard icon={Palette} title="Màu chủ đề">
                    <div className="space-y-4">
                        <div className="grid grid-cols-6 gap-2">
                            {THEME_COLORS.map((presetTheme) => (
                                <button
                                    key={presetTheme}
                                    className={cn(
                                        "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                                        themeColor === presetTheme
                                            ? "border-black dark:border-white"
                                            : "dark:border-neutral-800 dark:hover:border-neutral-700 border-gray-100 hover:border-gray-200"
                                    )}
                                    onClick={() => setThemeColor(presetTheme)}
                                >
                                    {/* Hiển thị màu */}
                                    <div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: presetTheme }}
                                    />

                                    {/* Chỉ báo đã chọn */}
                                    {themeColor === presetTheme && (
                                        <motion.div
                                            layoutId="theme-selected"
                                            className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-white/20"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                bounce: 0.2,
                                                duration: 0.6,
                                            }}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-white dark:bg-black" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Tùy chỉnh màu
                            </div>
                            <motion.input
                                type="color"
                                value={themeColor}
                                onChange={(e) => debouncedSetColor(e.target.value)}
                                className="w-[40px] h-[40px] rounded-lg cursor-pointer overflow-hidden hover:scale-105 transition-transform"
                            />
                        </div>
                    </div>
                </SettingCard>

                {/* Cài đặt kiểu chữ */}
                <SettingCard icon={Type} title="Kiểu chữ">
                    <div className="space-y-6">
                        {/* Chiều cao dòng */}
                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Chiều cao dòng
                            </Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[globalSettings?.lineHeight || 1.5]}
                                    min={1}
                                    max={2}
                                    step={0.1}
                                    onValueChange={([value]) =>
                                        updateGlobalSettings?.({ lineHeight: value })
                                    }
                                />
                                <span className="min-w-[3ch] text-sm text-gray-600 dark:text-neutral-300">
                                    {globalSettings?.lineHeight}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Cỡ chữ cơ bản
                            </Label>
                            <Select
                                value={globalSettings?.baseFontSize?.toString()}
                                onValueChange={(value) =>
                                    updateGlobalSettings?.({ baseFontSize: parseInt(value) })
                                }
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                </motion.div>
                                <SelectContent
                                    className={cn(
                                        "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                                        "bg-white border-gray-200"
                                    )}
                                >
                                    {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={size.toString()}
                                            className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                        >
                                            {size}px
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Cỡ tiêu đề
                            </Label>
                            <Select
                                value={globalSettings?.headerSize?.toString()}
                                onValueChange={(value) =>
                                    updateGlobalSettings?.({ headerSize: parseInt(value) })
                                }
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                </motion.div>
                                <SelectContent
                                    className={cn(
                                        "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                                        "bg-white border-gray-200"
                                    )}
                                >
                                    {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={size.toString()}
                                            className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                        >
                                            {size}px
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Cỡ tiêu đề phụ
                            </Label>
                            <Select
                                value={globalSettings?.subheaderSize?.toString()}
                                onValueChange={(value) =>
                                    updateGlobalSettings?.({ subheaderSize: parseInt(value) })
                                }
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                </motion.div>
                                <SelectContent
                                    className={cn(
                                        "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                                        "bg-white border-gray-200"
                                    )}
                                >
                                    {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={size.toString()}
                                            className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                        >
                                            {size}px
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </SettingCard>

                {/* Cài đặt khoảng cách */}
                <SettingCard icon={SpaceIcon} title="Khoảng cách">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Lề trang
                            </Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[globalSettings?.pagePadding || 0]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={([value]) =>
                                        updateGlobalSettings?.({ pagePadding: value })
                                    }
                                    className="flex-1"
                                />
                                <div className="flex items-center">
                                    <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            step={1}
                                            value={globalSettings?.pagePadding || 0}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const value = Number(e.target.value);
                                                if (!isNaN(value) && value >= 0 && value <= 100) {
                                                    updateGlobalSettings?.({ pagePadding: value });
                                                }
                                            }}
                                            className="h-full w-full border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                                        />
                                    </div>
                                    <span className="ml-1 text-sm text-gray-600 dark:text-neutral-300">px</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Khoảng cách mục
                            </Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[globalSettings?.sectionSpacing || 0]}
                                    min={1}
                                    max={100}
                                    step={1}
                                    onValueChange={([value]) =>
                                        updateGlobalSettings?.({ sectionSpacing: value })
                                    }
                                    className="flex-1"
                                />
                                <div className="flex items-center">
                                    <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            step={1}
                                            value={globalSettings?.sectionSpacing || 0}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const value = Number(e.target.value);
                                                if (!isNaN(value) && value >= 1 && value <= 100) {
                                                    updateGlobalSettings?.({ sectionSpacing: value });
                                                }
                                            }}
                                            className="h-full w-full border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                                        />
                                    </div>
                                    <span className="ml-1 text-sm text-gray-600 dark:text-neutral-300">px</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Khoảng cách đoạn văn
                            </Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[globalSettings?.paragraphSpacing || 0]}
                                    min={1}
                                    max={50}
                                    step={1}
                                    onValueChange={([value]) =>
                                        updateGlobalSettings?.({ paragraphSpacing: value })
                                    }
                                    className="flex-1"
                                />
                                <div className="flex items-center">
                                    <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            step={1}
                                            value={globalSettings?.paragraphSpacing || 0}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const value = Number(e.target.value);
                                                if (!isNaN(value) && value >= 1) {
                                                    updateGlobalSettings?.({ paragraphSpacing: value });
                                                }
                                            }}
                                            className="h-full w-full border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                                        />
                                    </div>
                                    <span className="ml-1 text-sm text-gray-600 dark:text-neutral-300">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingCard>

                {/* Cài đặt chế độ */}
                <SettingCard icon={Zap} title="Chế độ hiển thị">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Sử dụng icon
                            </Label>
                            <div className="flex items-center gap-4">
                                <Switch
                                    checked={globalSettings.useIconMode}
                                    onCheckedChange={(checked) =>
                                        updateGlobalSettings({
                                            useIconMode: checked,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600 dark:text-neutral-300">
                                Căn giữa tiêu đề phụ
                            </Label>
                            <div className="flex items-center gap-4">
                                <Switch
                                    checked={globalSettings.centerSubtitle}
                                    onCheckedChange={(checked) =>
                                        updateGlobalSettings({
                                            centerSubtitle: checked,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </SettingCard>
            </div>
        </motion.div>
    );
}
