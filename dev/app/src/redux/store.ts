import { configureStore } from "@reduxjs/toolkit";
import { menu } from "ionicons/icons";

import { menuReducer } from "./menuSlice"; // メニューのリデューサーをインポート

// storeの作成
export const store = configureStore({
    reducer: {
        menu: menuReducer, // メニューのリデューサーを追加
    },
});

// RootStateの型を定義
export type RootState = ReturnType<typeof store.getState>; // ストアの状態の型を取得