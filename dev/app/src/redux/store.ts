import { configureStore } from "@reduxjs/toolkit";
import { autoReducers } from "./autoReducers"; // 動的リデューサー登録を使用

// storeの作成（動的リデューサー登録を使用）
export const store = configureStore({
    reducer: autoReducers, // 全リデューサーを自動登録
});

// RootStateの型を定義
export type RootState = ReturnType<typeof store.getState>; // ストアの状態の型を取得