import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 環境変数・APIキー管理用の状態型定義
interface EnvState {
    geminiApiKey: string;
    openaiApiKey?: string;  // 将来的な拡張用
    anthropicApiKey?: string;  // 将来的な拡張用
    isGeminiConfigured: boolean;  // Gemini APIキーが設定済みかどうか
    lastUpdated?: string;  // 最終更新日時
}

// 初期状態
const initialState: EnvState = {
    geminiApiKey: "",
    openaiApiKey: "",
    anthropicApiKey: "",
    isGeminiConfigured: false,
    lastUpdated: undefined,
};

// envSliceの作成
export const envSlice = createSlice({
    name: "env",
    initialState,
    reducers: {
        // Gemini APIキーを設定
        setGeminiApiKey: (state, action: PayloadAction<string>) => {
            state.geminiApiKey = action.payload;
            state.isGeminiConfigured = action.payload.length > 0;
            state.lastUpdated = new Date().toISOString();
        },
        
        // Gemini APIキーをクリア
        clearGeminiApiKey: (state) => {
            state.geminiApiKey = "";
            state.isGeminiConfigured = false;
            state.lastUpdated = new Date().toISOString();
        },
        
        // OpenAI APIキーを設定（将来的な拡張用）
        setOpenaiApiKey: (state, action: PayloadAction<string>) => {
            state.openaiApiKey = action.payload;
            state.lastUpdated = new Date().toISOString();
        },
        
        // Anthropic APIキーを設定（将来的な拡張用）
        setAnthropicApiKey: (state, action: PayloadAction<string>) => {
            state.anthropicApiKey = action.payload;
            state.lastUpdated = new Date().toISOString();
        },
        
        // 複数のAPIキーを一括設定
        setApiKeys: (state, action: PayloadAction<Partial<EnvState>>) => {
            const { geminiApiKey, openaiApiKey, anthropicApiKey } = action.payload;
            
            if (geminiApiKey !== undefined) {
                state.geminiApiKey = geminiApiKey;
                state.isGeminiConfigured = geminiApiKey.length > 0;
            }
            if (openaiApiKey !== undefined) {
                state.openaiApiKey = openaiApiKey;
            }
            if (anthropicApiKey !== undefined) {
                state.anthropicApiKey = anthropicApiKey;
            }
            state.lastUpdated = new Date().toISOString();
        },
        
        // 全てのAPIキーをクリア
        clearAllApiKeys: (state) => {
            state.geminiApiKey = "";
            state.openaiApiKey = "";
            state.anthropicApiKey = "";
            state.isGeminiConfigured = false;
            state.lastUpdated = new Date().toISOString();
        },
        
        // localStorage からの状態復元用
        restoreFromStorage: (state, action: PayloadAction<Partial<EnvState>>) => {
            const restored = action.payload;
            Object.assign(state, restored);
            // 復元時にisGeminiConfiguredを再計算
            state.isGeminiConfigured = (restored.geminiApiKey || "").length > 0;
        }
    },
});

// アクションをエクスポート
export const {
    setGeminiApiKey,
    clearGeminiApiKey,
    setOpenaiApiKey,
    setAnthropicApiKey,
    setApiKeys,
    clearAllApiKeys,
    restoreFromStorage
} = envSlice.actions;

// リデューサーをエクスポート
export const envReducer = envSlice.reducer;

// selectGeminiApiKey - Gemini APIキーを取得するセレクター
export const selectGeminiApiKey = (state: { env: EnvState }) => state.env.geminiApiKey;

// selectIsGeminiConfigured - Gemini APIキーが設定済みかどうかを取得するセレクター
export const selectIsGeminiConfigured = (state: { env: EnvState }) => state.env.isGeminiConfigured;

// selectAllApiKeys - 全てのAPIキーを取得するセレクター
export const selectAllApiKeys = (state: { env: EnvState }) => ({
    gemini: state.env.geminiApiKey,
    openai: state.env.openaiApiKey,
    anthropic: state.env.anthropicApiKey,
});

// validateGeminiApiKey - Gemini APIキーの形式バリデーション
export const validateGeminiApiKey = (apiKey: string): boolean => {
    // Gemini APIキーの基本的な形式チェック
    // 通常は "AIza" で始まる39文字のキー
    const geminiKeyPattern = /^AIza[A-Za-z0-9_-]{35}$/;
    return geminiKeyPattern.test(apiKey);
};

// validateOpenaiApiKey - OpenAI APIキーの形式バリデーション
export const validateOpenaiApiKey = (apiKey: string): boolean => {
    // OpenAI APIキーの基本的な形式チェック
    // 通常は "sk-" で始まる
    const openaiKeyPattern = /^sk-[A-Za-z0-9]{48}$/;
    return openaiKeyPattern.test(apiKey);
};