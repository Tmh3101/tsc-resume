"use client";

import { useState, useCallback } from "react";

// =====================================================
// Grammar Check Hook - Kiểm tra ngữ pháp
// =====================================================

interface GrammarError {
  message: string;
  offset: number;
  length: number;
  suggestions: string[];
  rule: {
    id: string;
    description: string;
  };
}

interface UseGrammarCheckReturn {
  errors: GrammarError[];
  isChecking: boolean;
  checkGrammar: (text: string) => Promise<void>;
  selectError: (index: number) => void;
  clearErrors: () => void;
}

export function useGrammarCheck(): UseGrammarCheckReturn {
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedErrorIndex, setSelectedErrorIndex] = useState<number | null>(null);

  const checkGrammar = useCallback(async (text: string) => {
    if (!text.trim()) {
      setErrors([]);
      return;
    }

    setIsChecking(true);
    
    try {
      // TODO: Tích hợp với API kiểm tra ngữ pháp thực tế
      // Hiện tại đang mock data
      // Có thể sử dụng LanguageTool API hoặc các dịch vụ tương tự
      
      // Mock: Không có lỗi
      setErrors([]);
    } catch (error) {
      console.error("Lỗi kiểm tra ngữ pháp:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const selectError = useCallback((index: number) => {
    if (index >= 0 && index < errors.length) {
      setSelectedErrorIndex(index);
      // TODO: Scroll đến vị trí lỗi trong editor
    }
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setSelectedErrorIndex(null);
  }, []);

  return {
    errors,
    isChecking,
    checkGrammar,
    selectError,
    clearErrors,
  };
}
