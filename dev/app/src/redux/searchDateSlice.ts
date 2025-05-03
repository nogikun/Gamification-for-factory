import { createSlice } from "@reduxjs/toolkit";

interface SearchDateState {
    selectedDate: string; // 選択された日付
}

export const searchDateSlice = createSlice({
    name: "searchDate",
    initialState: {
        // 今日の日付を初期値に設定
        selectedDate: `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}`,
    } as SearchDateState,
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload; // 選択された日付を更新
        }
    },
});
export const { setSelectedDate } = searchDateSlice.actions; // アクションをエクスポート
export const searchDateReducer = searchDateSlice.reducer; // リデューサーをエクスポート