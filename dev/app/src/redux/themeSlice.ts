import { createSlice } from "@reduxjs/toolkit";
import { toggle } from "ionicons/icons";

interface ThemeState {
    isDarkMode: boolean; // ダークモードの状態
}

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        isDarkMode: false, // 初期状態はダークモードオフ
    } as ThemeState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode; // ダークモードの状態をトグル
        },
        setDarkMode: (state, action) => {
            state.isDarkMode = action.payload; // ダークモードの状態を設定
        }
    },
});
export const { toggleDarkMode, setDarkMode } = themeSlice.actions; // アクションをエクスポート
export const themeReducer = themeSlice.reducer; // リデューサーをエクスポート