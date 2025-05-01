import { createSlice } from "@reduxjs/toolkit";

interface MenuState {
    isOpen: boolean; // メニューの開閉状態
    isTopButtonsVisible: boolean; // トップボタンの表示状態
}

export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        isOpen: false,
        isTopButtonsVisible: false,
    } as MenuState,
    reducers: {
        toggleMenu: (state) => {
            state.isOpen = !state.isOpen; // メニューの開閉状態をトグル
        },
        toggleTopButtons: (state) => {
            state.isTopButtonsVisible = !state.isTopButtonsVisible; // トップボタンの表示状態をトグル
        }
    },
});
export const { toggleMenu, toggleTopButtons } = menuSlice.actions; // アクションをエクスポート
export const menuReducer = menuSlice.reducer; // リデューサーをエクスポート