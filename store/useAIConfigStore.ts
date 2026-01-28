"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// =====================================================
// AI Config Store - Lưu trữ cấu hình AI
// =====================================================

interface AIConfigState {
  // Model được chọn
  selectedModel: "doubao" | "deepseek" | "openai";
  
  // Doubao Config
  doubaoApiKey: string;
  doubaoModelId: string;
  
  // Deepseek Config
  deepseekApiKey: string;
  deepseekModelId: string;
  
  // OpenAI Config
  openaiApiKey: string;
  openaiModelId: string;
  openaiApiEndpoint: string;
  
  // Actions
  setSelectedModel: (model: "doubao" | "deepseek" | "openai") => void;
  setDoubaoConfig: (config: { apiKey?: string; modelId?: string }) => void;
  setDeepseekConfig: (config: { apiKey?: string; modelId?: string }) => void;
  setOpenaiConfig: (config: { apiKey?: string; modelId?: string; apiEndpoint?: string }) => void;
}

export const AI_MODEL_CONFIGS = {
  doubao: {
    name: "Doubao",
    description: "Mô hình AI của ByteDance",
    defaultModelId: "doubao-pro-4k",
    requiresModelId: true,
  },
  deepseek: {
    name: "DeepSeek",
    description: "Mô hình AI mã nguồn mở mạnh mẽ",
    defaultModelId: "deepseek-chat",
    requiresModelId: true,
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4 và các mô hình của OpenAI",
    defaultModelId: "gpt-4o-mini",
    requiresModelId: false,
  },
};

export const useAIConfigStore = create<AIConfigState>()(
  persist(
    (set) => ({
      selectedModel: "openai",
      
      doubaoApiKey: "",
      doubaoModelId: AI_MODEL_CONFIGS.doubao.defaultModelId,
      
      deepseekApiKey: "",
      deepseekModelId: AI_MODEL_CONFIGS.deepseek.defaultModelId,
      
      openaiApiKey: "",
      openaiModelId: AI_MODEL_CONFIGS.openai.defaultModelId,
      openaiApiEndpoint: "https://api.openai.com/v1",
      
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      setDoubaoConfig: (config) =>
        set((state) => ({
          doubaoApiKey: config.apiKey ?? state.doubaoApiKey,
          doubaoModelId: config.modelId ?? state.doubaoModelId,
        })),
      
      setDeepseekConfig: (config) =>
        set((state) => ({
          deepseekApiKey: config.apiKey ?? state.deepseekApiKey,
          deepseekModelId: config.modelId ?? state.deepseekModelId,
        })),
      
      setOpenaiConfig: (config) =>
        set((state) => ({
          openaiApiKey: config.apiKey ?? state.openaiApiKey,
          openaiModelId: config.modelId ?? state.openaiModelId,
          openaiApiEndpoint: config.apiEndpoint ?? state.openaiApiEndpoint,
        })),
    }),
    {
      name: "ai-config-storage",
    }
  )
);
