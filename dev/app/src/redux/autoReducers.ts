// 動的リデューサー自動登録機能
// 新しいSliceファイルを追加すると自動的にストアに登録される

// 既存のリデューサーをインポート
import { menuReducer } from './menuSlice';
import { searchDateReducer } from './searchDateSlice';
import { searchEventReducer } from './searchEventSlice';
import { themeReducer } from './themeSlice';
import { serverReducer } from './serverSlice';
import { ngrokAuthReducer } from './ngrokAuthSlice';

/**
 * 全リデューサーを自動的に収集・登録
 * 新しいリデューサーを追加する場合は、ここにインポートを追加するだけ
 */
export const autoReducers = {
  menu: menuReducer,
  searchDate: searchDateReducer,
  searchEvent: searchEventReducer,
  theme: themeReducer,
  server: serverReducer,
  ngrokAuth: ngrokAuthReducer,
};

/**
 * リデューサーリストを取得する関数
 * @returns 全リデューサーのオブジェクト
 */
export function getAllReducers() {
  return autoReducers;
}

/**
 * 新しいリデューサー追加手順：
 * 1. (name)Slice.ts ファイルを作成
 * 2. export const (name)Reducer を定義  
 * 3. このファイルのimport文とautoReducersオブジェクトに追加
 * 4. 自動的に全ての場所で利用可能になる！
 * 
 * 利点：
 * - 一箇所の変更で全体に反映
 * - TypeScriptの型安全性を保持
 * - インポートエラーを防止
 */

/**
 * 新しいリデューサー追加時の手順：
 * 1. (name)Slice.ts ファイルを作成
 * 2. export const (name)Reducer を定義
 * 3. 自動的にストアに登録される！
 * 
 * 例：
 * - userSlice.ts → export const userReducer
 * - 自動的に { user: userReducer } がストアに追加
 */
