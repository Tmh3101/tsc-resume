"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ThemedAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ThemeModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ThemedAlertDialogProps) => {
  const modalContent = {
    delete: {
      title: "Xác nhận xóa",
      description: (
        <span className="block text-center">
          Bạn có chắc chắn muốn xóa
          <span className="px-1 font-semibold text-orange">{title}</span>?
        </span>
      ),
      confirmText: "Xóa",
      illustration: (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/10">
          <AlertTriangle className="h-8 w-8 text-orange" />
        </div>
      ),
    },
  };

  const content = modalContent["delete"];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        onClick={(e) => e.stopPropagation()}
        className="max-w-xs rounded-2xl border border-gray-100 bg-white p-0 shadow-lg"
      >
        <div className="relative overflow-hidden px-6 py-5">
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              {content.illustration}
            </motion.div>

            <AlertDialogHeader className="space-y-1">
              <AlertDialogDescription className="text-center text-md mt-2 text-deep-blue">
                {content.description}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-5 flex w-full gap-3 sm:flex-row">
              <AlertDialogCancel className="flex-1 h-9 rounded-lg border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onConfirm}
                className="flex-1 h-9 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                {content.confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ThemeModal;
