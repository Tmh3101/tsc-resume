"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { compressImage, estimateBase64Size } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PhotoConfig,
  DEFAULT_CONFIG,
  getRatioMultiplier,
  getBorderRadiusValue,
} from "@/types/resume";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR = "/avatar.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  photo?: string;
  config?: PhotoConfig;
  onPhotoChange: (photo: string | undefined, config?: PhotoConfig) => void;
  onConfigChange: (config: PhotoConfig) => void;
}

const PhotoConfigDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  photo,
  config: initialConfig,
  onPhotoChange,
  onConfigChange,
  ...props
}) => {
  const { updateBasicInfo } = useResumeStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(photo);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(photo || "");
  const drawerContentRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<PhotoConfig>(
    initialConfig || DEFAULT_CONFIG
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setConfig(initialConfig || DEFAULT_CONFIG);
      setPreviewUrl(photo === "" ? "" : photo || DEFAULT_AVATAR);
      setImageUrl(photo === DEFAULT_AVATAR ? "" : photo || "");
    }

    const handleClick = (e: MouseEvent) => {
      if (!drawerContentRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, initialConfig, photo]);



  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    try {
      let imageData: string;
      if (file.size > 2 * 1024 * 1024) {
        try {
          imageData = await compressImage(file, 800, 800, 0.7);

          let compressedSize = estimateBase64Size(imageData);
          if (compressedSize > 2 * 1024 * 1024) {
            imageData = await compressImage(file, 600, 600, 0.5);
            compressedSize = estimateBase64Size(imageData);

            if (compressedSize > 2 * 1024 * 1024) {
              imageData = await compressImage(file, 400, 400, 0.4);
            }
          }

          console.log(
            `Kích thước gốc: ${(file.size / 1024).toFixed(2)}KB, Sau nén: ${(
              estimateBase64Size(imageData) / 1024
            ).toFixed(2)}KB`
          );
        } catch (error) {
          toast.error("Kích thước tối đa 2MB");
          return;
        }
      } else {
        // Nếu ảnh < 2MB, vẫn nén nhẹ để tối ưu
        imageData = await compressImage(file, 1200, 1200, 0.8);
      }

      setPreviewUrl(imageData);
      setImageUrl(imageData);
      updateBasicInfo({
        photo: imageData,
      });
    } catch (error) {
      toast.error("Lỗi tải ảnh");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUrlChange = async (e: string) => {
    const url = e.trim();
    setImageUrl(url);
    if (!url) {
      handleRemovePhoto();
      return;
    }

    try {
      const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(url)}`;

      const img = new Image();
      img.crossOrigin = "anonymous";

      // Kiểm tra kích thước ảnh
      const checkImageSize = () => {
        return new Promise<void>((resolve, reject) => {
          fetch(proxyUrl, { method: "HEAD" })
            .then((response) => {
              const contentLength = response.headers.get("content-length");
              if (contentLength) {
                const size = parseInt(contentLength, 10);
                if (size > 2 * 1024 * 1024) {
                  reject(new Error("Kích thước tối đa 2MB"));
                }
              }
              resolve();
            })
            .catch(() => {
              // Nếu không lấy được kích thước, tiếp tục tải ảnh
              resolve();
            });
        });
      };

      // Kiểm tra kích thước ảnh trước
      await checkImageSize();

      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Hết thời gian tải ảnh"));
        }, 10000);

        img.onload = () => {
          clearTimeout(timer);
          resolve(undefined);
        };
        img.onerror = () => {
          clearTimeout(timer);
          reject(new Error("Không thể tải ảnh"));
        };
        img.src = proxyUrl;
      });

      setPreviewUrl(proxyUrl);
      updateBasicInfo({
        photo: url,
      });
      onPhotoChange(url, config);
    } catch (error) {
      toast.error("\u0110\u01b0\u1eddng d\u1eabn \u1ea3nh kh\u00f4ng h\u1ee3p l\u1ec7");
      handleRemovePhoto();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl("");
    setImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    updateBasicInfo({
      photo: "",
    });

    onPhotoChange("", config);

    setTimeout(() => {
      setPreviewUrl("");
    }, 0);
  };

  const handleConfigChange = (updates: Partial<PhotoConfig>) => {
    const newConfig = { ...config, ...updates };

    if (config.aspectRatio !== "custom") {
      if ("width" in updates) {
        const ratio = getRatioMultiplier(config.aspectRatio);
        newConfig.height =
          Math.round(updates.width! * ratio) > 200
            ? 200
            : Math.round(updates.width! * ratio);
      }
      if ("height" in updates) {
        const ratio = 1 / getRatioMultiplier(config.aspectRatio);
        newConfig.width =
          Math.round(updates.height! * ratio) > 200
            ? 200
            : Math.round(updates.height! * ratio);
      }
    }

    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "width" | "height" | "customBorderRadius"
  ) => {
    const value = Number(e.target.value) > 200 ? 200 : e.target.value;

    if (value === "") {
      setConfig((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setConfig((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    key: "width" | "height" | "customBorderRadius"
  ) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : Number(value);

    if (key === "customBorderRadius") {
      const maxRadius = Math.min(config.width, config.height) / 2;
      const validValue = Math.max(0, Math.min(numValue, maxRadius));
      handleConfigChange({ customBorderRadius: validValue });
    } else {
      const validValue = Math.max(24, Math.min(numValue, 200));
      handleConfigChange({ [key]: validValue });
    }
  };

  const handleSave = () => {
    onPhotoChange(previewUrl, config);
    onClose();
  };
  return (
    <Drawer
      direction={isMobile ? "bottom" : "left"}
      modal={false}
      open={isOpen}
      dismissible={false}
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent
        ref={drawerContentRef}
        className={cn(
          "bg-white",
          "md:fixed md:top-16 md:left-4 md:bottom-auto md:right-auto md:h-auto md:max-w-[320px] md:rounded-xl md:border md:border-gray-200 dark:md:border-neutral-700",
          "md:z-50 md:outline-none shadow-lg shadow-deep-blue/20 p-4 pt-8"
        )}
      >
        <div className="w-full max-w-md overflow-y-auto max-h-[80vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-center text-base font-semibold text-gray-800 dark:text-white">Cấu hình ảnh đại diện</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div
            className={cn(
              "relative overflow-hidden border-2 transition-all mx-auto",
              isDragging ? "border-orange border-solid" : "border-dashed",
              "dark:border-neutral-700 dark:hover:border-orange/50 border-gray-300 hover:border-orange/50"
            )}
            style={{
              width: `${config.width}px`,
              height: `${config.height}px`,
              borderRadius: getBorderRadiusValue(config),
              maxWidth: "100%",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl && previewUrl !== "" ? (
              <div className="relative h-full group">
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity",
                    "group-hover:opacity-100"
                  )}
                >
                  <Button
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <X className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => inputRef.current?.click()}
                variant="ghost"
                className="w-full h-full flex flex-col items-center justify-center p-0"
              >
                <Upload
                  className={cn(
                    "w-6 h-6 mb-2",
                    "dark:text-neutral-400 text-neutral-500"
                  )}
                />
              </Button>
            )}
            <motion.input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="px-4 py-2 text-center">
            <span className="text-xs text-gray-500 dark:text-neutral-400">Kéo thả hoặc click để tải ảnh (tối đa 2MB)</span>
          </div>
          <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-600 dark:text-neutral-300">Kích thước</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Input
                      value={config.width}
                      onChange={(e) => handleInputChange(e, "width")}
                      onBlur={(e) => handleInputBlur(e, "width")}
                      className={cn(
                        "h-8 pr-7 text-sm",
                        "dark:bg-neutral-800 dark:border-neutral-700 focus:border-orange focus:ring-orange/20"
                      )}
                      min={24}
                      max={200}
                      placeholder="Rộng"
                    />
                    <div
                      className={cn(
                        "absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium",
                        "text-orange"
                      )}
                    >
                      W
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      value={config.height}
                      onChange={(e) => handleInputChange(e, "height")}
                      onBlur={(e) => handleInputBlur(e, "height")}
                      className={cn(
                        "h-8 pr-7 text-sm",
                        "dark:bg-neutral-800 dark:border-neutral-700 focus:border-orange focus:ring-orange/20"
                      )}
                      min={24}
                      max={200}
                      placeholder="Cao"
                    />
                    <div
                      className={cn(
                        "absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium",
                        "text-orange"
                      )}
                    >
                      H
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-600 dark:text-neutral-300">
                  Tỷ lệ khung hình
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(["1:1", "4:3", "3:4", "16:9", "custom"] as const).map(
                    (ratio) => (
                      <Button
                        key={ratio}
                        size="sm"
                        className={cn(
                          "h-7 px-2.5 text-xs",
                          config.aspectRatio === ratio 
                            ? "bg-orange hover:bg-orange/90 text-white" 
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300"
                        )}
                        onClick={() => {
                          if (ratio !== "custom") {
                            const height = Math.round(
                              config.width * getRatioMultiplier(ratio)
                            );
                            handleConfigChange({ aspectRatio: ratio, height });
                          } else {
                            handleConfigChange({ aspectRatio: ratio });
                          }
                        }}
                      >
                        {ratio === "custom" ? "Tùy chỉnh" : ratio}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-600 dark:text-neutral-300">
                  Bo góc
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(["none", "medium", "full", "custom"] as const).map(
                    (radius) => (
                      <Button
                        key={radius}
                        size="sm"
                        className={cn(
                          "h-7 px-2.5 text-xs",
                          config.borderRadius === radius 
                            ? "bg-orange hover:bg-orange/90 text-white" 
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300"
                        )}
                        onClick={() =>
                          handleConfigChange({ borderRadius: radius })
                        }
                      >
                        {radius === "none"
                          ? "Không"
                          : radius === "medium"
                          ? "Vừa"
                          : radius === "full"
                          ? "Tròn"
                          : "Tùy chỉnh"}
                      </Button>
                    )
                  )}
                  {config.borderRadius === "custom" && (
                    <Input
                      type="number"
                      value={config.customBorderRadius}
                      onChange={(e) =>
                        handleInputChange(e, "customBorderRadius")
                      }
                      onBlur={(e) => handleInputBlur(e, "customBorderRadius")}
                      className={cn("h-8 mt-2 text-sm", "dark:bg-neutral-800 focus:border-orange")}
                      min={0}
                      max={Math.min(config.width, config.height) / 2}
                      placeholder="Nhập giá trị"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-2 pb-4">
            <DrawerClose asChild>
              <Button
                className="w-full h-9 bg-deep-blue hover:bg-deep-blue/90 text-white rounded-lg"
                onClick={handleSave}
              >
                Đóng
              </Button>
            </DrawerClose>
          </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PhotoConfigDrawer;
