import { configureStore } from "@reduxjs/toolkit";
import { menu, search } from "ionicons/icons";

import { menuReducer } from "./menuSlice"; // メニューのリデューサーをインポート
import { searchDateReducer } from "./searchDateSlice"; // 検索日付のリデューサーをインポート
import { searchEventReducer } from "./searchEventSlice"; // 検索のリデューサーをインポート
import { themeReducer } from "./themeSlice";
import { serverReducer } from "./serverSlice"; // サーバーのリデューサーをインポート

// storeの作成
export const store = configureStore({
    reducer: {
        menu: menuReducer,              // メニューのリデューサーを追加
        searchDate: searchDateReducer,  // 検索日付のリデューサーを追加
        searchEvent: searchEventReducer,      // 検索のリデューサーを追加
        theme: themeReducer,            // テーマのリデューサーを追加
        server: serverReducer,          // サーバーのリデューサーを追加
    },
});

// RootStateの型を定義
export type RootState = ReturnType<typeof store.getState>; // ストアの状態の型を取得