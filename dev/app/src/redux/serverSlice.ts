import { createSlice } from "@reduxjs/toolkit";

interface ServerState {
    host: string; // サーバーのURL
    port?: string; // ポート番号（オプション）
}

export const serverSlice = createSlice({
    name: "server", // スライスの名前
    initialState: {
        host: "http://localhost", // ホストを初期値に設定
        port: "8000", // ポート番号を初期値に設定
    } as ServerState,
    reducers: {
        setServerUrl: (state, action) => {
            // サーバーのURLを更新するアクション
            state.host = action.payload.host; // 新しいサーバーのURLを設定
            state.port = action.payload.port; // 新しいポート番号を設定（オプション）
        }
    },
});
export const { setServerUrl } = serverSlice.actions; // アクションをエクスポート
export const serverReducer = serverSlice.reducer; // リデューサーをエクスポート