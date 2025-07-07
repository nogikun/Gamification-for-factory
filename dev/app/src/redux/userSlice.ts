import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    // FeedbackTabコンポーネントで使用される基本フィールド
    userId: string; // 現在のユーザーID（FeedbackTab互換）
    user_id?: string; // ユーザーID（UUID）- 詳細版互換
    isLoggedIn: boolean; // ログイン状態
    
    // 詳細ユーザー情報
    last_name?: string; // ユーザーの姓
    first_name?: string; // ユーザーの名
    mail_address?: string; // メールアドレス
    phone_number?: string; // 電話番号
    address?: string; // 住所
    birth_date?: string; // 生年月日（ISO 8601形式の文字列）
    license?: string; // 保有資格
    updated_at?: string; // 更新日時（ISO 8601形式の文字列）
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        userId: "11111111-1111-1111-1111-111111111111", // デフォルトのテスト用UUID
        user_id: "11111111-1111-1111-1111-111111111111", // 互換性のため同じ値
        isLoggedIn: true,
        last_name: undefined,
        first_name: undefined,
        mail_address: undefined,
        phone_number: undefined,
        address: undefined,
        birth_date: undefined,
        license: undefined,
        updated_at: undefined,
    } as UserState,
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload; // FeedbackTab互換
            state.user_id = action.payload; // 詳細版互換
        },
        login: (state, action) => {
            const { 
                userId, user_id, last_name, first_name, mail_address, 
                phone_number, address, birth_date, license, updated_at 
            } = action.payload;
            
            // 基本フィールド
            state.userId = userId || user_id || state.userId;
            state.user_id = user_id || userId || state.user_id;
            state.isLoggedIn = true;
            
            // 詳細フィールド（提供された場合のみ更新）
            if (last_name !== undefined) state.last_name = last_name;
            if (first_name !== undefined) state.first_name = first_name;
            if (mail_address !== undefined) state.mail_address = mail_address;
            if (phone_number !== undefined) state.phone_number = phone_number;
            if (address !== undefined) state.address = address;
            if (birth_date !== undefined) state.birth_date = birth_date;
            if (license !== undefined) state.license = license;
            if (updated_at !== undefined) state.updated_at = updated_at;
        },
        logout: (state) => {
            state.userId = "";
            state.user_id = undefined;
            state.isLoggedIn = false;
            state.last_name = undefined;
            state.first_name = undefined;
            state.mail_address = undefined;
            state.phone_number = undefined;
            state.address = undefined;
            state.birth_date = undefined;
            state.license = undefined;
            state.updated_at = undefined;
        }
    },
});

export const { setUserId, login, logout } = userSlice.actions; // アクションをエクスポート
export const userReducer = userSlice.reducer; // リデューサーをエクスポート
