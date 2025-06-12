import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { 
    saveAuthToken, 
    clearStoredAuthToken, 
    getStoredAuthToken,
    isStoredTokenValid 
} from "../lib/ngrokAuthStorage";

// ngrok認証の状態の型定義
export type NgrokAuthStatus = 'unauthenticated' | 'authenticating' | 'authenticated';

interface NgrokAuthState {
    status: NgrokAuthStatus;          // 認証状態
    authToken?: string;               // 認証トークン（認証済みの場合）
    error?: string;                   // エラーメッセージ（認証失敗時）
    lastAuthenticatedAt?: string;     // 最後に認証が成功した時刻
}

// 初期状態
const initialState: NgrokAuthState = {
    status: 'unauthenticated',
    authToken: undefined,
    error: undefined,
    lastAuthenticatedAt: undefined,
};

export const ngrokAuthSlice = createSlice({
    name: "ngrokAuth",
    initialState,
    reducers: {
        // 認証開始
        startAuthentication: (state) => {
            state.status = 'authenticating';
            state.error = undefined;
        },
        
        // 認証成功
        setAuthenticated: (state, action: PayloadAction<{ token: string }>) => {
            state.status = 'authenticated';
            state.authToken = action.payload.token;
            state.error = undefined;
            state.lastAuthenticatedAt = new Date().toISOString();
            
            // ローカルストレージに保存
            saveAuthToken(action.payload.token);
        },
        
        // 認証失敗
        setAuthenticationError: (state, action: PayloadAction<string>) => {
            state.status = 'unauthenticated';
            state.authToken = undefined;
            state.error = action.payload;
        },
        
        // 認証をクリア（ログアウト）
        clearAuthentication: (state) => {
            state.status = 'unauthenticated';
            state.authToken = undefined;
            state.error = undefined;
            state.lastAuthenticatedAt = undefined;
            
            // ローカルストレージからも削除
            clearStoredAuthToken();
        },
        
        // エラーをクリア
        clearError: (state) => {
            state.error = undefined;
        },
        
        // ローカルストレージから認証状態を復元
        restoreAuthenticationFromStorage: (state) => {
            const storedToken = getStoredAuthToken();
            if (storedToken && isStoredTokenValid()) {
                state.status = 'authenticated';
                state.authToken = storedToken;
                state.error = undefined;
                // タイムスタンプは既にストレージに保存されているため、
                // 新しいタイムスタンプは設定しない
            } else {
                // 無効なトークンの場合は未認証状態に設定
                state.status = 'unauthenticated';
                state.authToken = undefined;
                state.error = undefined;
                state.lastAuthenticatedAt = undefined;
            }
        },
    },
});

// アクションをエクスポート
export const { 
    startAuthentication, 
    setAuthenticated, 
    setAuthenticationError, 
    clearAuthentication,
    clearError,
    restoreAuthenticationFromStorage
} = ngrokAuthSlice.actions;

// リデューサーをエクスポート
export const ngrokAuthReducer = ngrokAuthSlice.reducer;
