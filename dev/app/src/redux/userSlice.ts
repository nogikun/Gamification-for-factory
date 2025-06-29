import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    userId: string; // 現在のユーザーID
    isLoggedIn: boolean; // ログイン状態
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        userId: "11111111-1111-1111-1111-111111111111", // デフォルトのテスト用UUID
        isLoggedIn: true,
    } as UserState,
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload; // ユーザーIDを更新
        },
        login: (state, action) => {
            state.userId = action.payload.userId;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.userId = "";
            state.isLoggedIn = false;
        }
    },
});
export const { setUserId, login, logout } = userSlice.actions; // アクションをエクスポート
export const userReducer = userSlice.reducer; // リデューサーをエクスポート
