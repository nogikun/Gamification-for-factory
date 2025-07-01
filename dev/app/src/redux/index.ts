// Redux関連の全てのエクスポートを一括管理するindex.ts

// 動的リデューサー登録を使用
export { autoReducers, getAllReducers } from './autoReducers';

// 個別のリデューサーエクスポート（後方互換性のため）
export { menuReducer } from './menuSlice';
export { ngrokAuthReducer } from './ngrokAuthSlice';
export { searchDateReducer } from './searchDateSlice';
export { searchEventReducer } from './searchEventSlice';
export { serverReducer } from './serverSlice';
export { themeReducer } from './themeSlice';
export { feedbackTabReducer } from './feedbackTabSlice';
export { userReducer } from './userSlice';
export { envReducer } from './envSlice';

// ストアのエクスポート
export { store } from './store';

// 型定義のエクスポート
export type { RootState } from './store';
