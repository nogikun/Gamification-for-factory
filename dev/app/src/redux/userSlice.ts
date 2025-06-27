import { createSlice } from "@reduxjs/toolkit";
import { toggle } from "ionicons/icons";

interface UserState {
    user_id?: string;       // ユーザーID（UUID）
    last_name?: string;     // ユーザーの姓
    first_name?: string;    // ユーザーの名
    mail_address?: string;  // メールアドレス
    phone_number?: string;  // 電話番号
    address?: string;       // 住所
    birth_date?: string;    // 生年月日（ISO 8601形式の文字列
    license?: string;       // 保有資格
    updated_at?: string;    // 更新日時（ISO 8601形式の文字列）
}

export const UserSlice = createSlice({
    name: "User",
    initialState: {
        user_id: undefined,       // ユーザーIDを初期化
        last_name: undefined,     // ユーザーの姓を初期化
        first_name: undefined,    // ユーザーの名を初期化
        mail_address: undefined,  // メールアドレスを初期化
        phone_number: undefined,  // 電話番号を初期化
        address: undefined,       // 住所を初期化
        birth_date: undefined,    // 生年月日を初期化
        license: undefined,       // 保有資格を初期化
        updated_at: undefined,    // 更新日時を初期化
    } as UserState,
    reducers: {
        login: (state, action) => {
            const { user_id, last_name, first_name, mail_address, phone_number, address, birth_date, license, updated_at } = action.payload;
            state.user_id = user_id;            // ユーザーIDを設定
            state.last_name = last_name;        // ユーザーの姓を設定
            state.first_name = first_name;      // ユーザーの名を設定
            state.mail_address = mail_address;  // メールアドレスを設定
            state.phone_number = phone_number;  // 電話番号を設定
            state.address = address;            // 住所を設定
            state.birth_date = birth_date;      // 生年月日を設定
            state.license = license;            // 保有資格を設定
            state.updated_at = updated_at;      // 更新日時を設定
        },
        logout: (state) => {
            state.user_id = undefined;          // ユーザーIDをクリア
            state.last_name = undefined;        // ユーザーの姓をクリア
            state.first_name = undefined;       // ユーザーの名をクリア
            state.mail_address = undefined;     // メールアドレスをクリア
            state.phone_number = undefined;     // 電話番号をクリア
            state.address = undefined;          // 住所をクリア
            state.birth_date = undefined;       // 生年月日をクリア
            state.license = undefined;          // 保有資格をクリア
            state.updated_at = undefined;       // 更新日時をクリア
        },
    },
});
export const { login, logout } = UserSlice.actions; // アクションをエクスポート
export const userReducer = UserSlice.reducer;       // リデューサーをエクスポート