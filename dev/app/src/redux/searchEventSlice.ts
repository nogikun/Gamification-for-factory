import { createSlice } from "@reduxjs/toolkit";

interface MenuState {
    eventId: string; // 選択中のイベントID
}

export const searchEventSlice = createSlice({
    name: "searchEvent",
    initialState: {
        eventId: "", // 初期値は空の文字列
    } as MenuState,
    reducers: {
        setEventId: (state, action) => {
            state.eventId = action.payload; // 選択中のイベントIDを更新
        },
        clearEventId: (state) => {
            state.eventId = ""; // 選択中のイベントIDをクリア
        },
    },
});
export const { setEventId, clearEventId } = searchEventSlice.actions; // アクションをエクスポート
export const searchEventReducer = searchEventSlice.reducer; // リデューサーをエクスポート