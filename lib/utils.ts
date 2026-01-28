import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a byte value into a human-readable string with appropriate units.
 *
 * @param bytes - The number of bytes to format
 * @returns A formatted string with the size and appropriate unit (Bytes, KB, MB, GB)
 *
 * @example
 * formatSize(1024) // "1 KB"
 * formatSize(1536) // "1.5 KB"
 * formatSize(0) // "0 Bytes"
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Generates a random UUID using the Web Crypto API.
 *
 * @returns A randomly generated UUID string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 */
export const generateUUID = () => crypto.randomUUID();


/**
 * Compresses an image file to a specified maximum width and height, returning a base64 data URL.
 * @param file - The image file to compress.
 * @param maxWidth - The maximum width of the compressed image (default: 800).
 * @param maxHeight - The maximum height of the compressed image (default: 800).
 * 
 * @returns A promise that resolves to the base64 data URL of the compressed image.
 * @example
 * const compressedDataUrl = await compressImage(file, 800, 800, 0.7);
 */

export const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Không thể tạo ngữ cảnh Canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(file.type || "image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error("Tải hình ảnh thất bại"));
      };
    };
    reader.onerror = () => {
      reject(new Error("Đọc file thất bại"));
    };
  });
};

/**
 * Ước tính kích thước thực tế của dữ liệu hình ảnh base64 (bytes)
 * base64 mã hóa 3 bytes dữ liệu thành 4 bytes, nên kích thước thực tế khoảng 3/4 độ dài chuỗi base64
 */
export const estimateBase64Size = (base64String: string): number => {
  const base64Data = base64String.split(",")[1] || base64String;
  return Math.round((base64Data.length * 3) / 4);
};

