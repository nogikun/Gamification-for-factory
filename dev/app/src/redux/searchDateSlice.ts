import { createSlice } from "@reduxjs/toolkit";

interface SearchDateState {
    selectedDate: string; // 選択された日付
}

export const searchDateSlice = createSlice({
    name: "searchDate",
    initialState: {
        // 日本時間を取得
        selectedDate: `${new Date().toISOString().split('T')[0]}`, // YYYY-MM-DD形式に変換
    } as SearchDateState,
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload; // 選択された日付を更新
        }
    },
});
export const { setSelectedDate } = searchDateSlice.actions; // アクションをエクスポート
export const searchDateReducer = searchDateSlice.reducer; // リデューサーをエクスポート