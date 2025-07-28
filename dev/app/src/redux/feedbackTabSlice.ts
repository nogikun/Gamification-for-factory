import { createSlice } from "@reduxjs/toolkit";

interface feedbackTabState {
    TabId: number; // 現在のタブID
    isOpen?: boolean; // タブの開閉状態（オプション）
    isTopButtonsVisible?: boolean; // トップボタンの表示状態（オプション）
}

export const feedbackTabSlice = createSlice({
    name: "feedbackTab",
    initialState: {
        TabId: 1,
    } as feedbackTabState,
    reducers: {
        changeTab: (state, action) => {
            state.TabId = action.payload; // タブIDを更新
        }
    },
});
export const { changeTab } = feedbackTabSlice.actions; // アクションをエクスポート
export const feedbackTabReducer = feedbackTabSlice.reducer; // リデューサーをエクスポート