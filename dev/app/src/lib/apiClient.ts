import axios from 'axios';
import { store } from '../redux/store';
import { selectServerUrl } from '../redux/serverSlice';
import type { RootState } from '../redux/store';

// axiosインスタンスの作成
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（ReduxからベースURLを動的に取得）
apiClient.interceptors.request.use(
  (config) => {
    // Reduxストアからサーバー情報を取得
    const state: RootState = store.getState();
    const baseURL = selectServerUrl(state);
    config.baseURL = baseURL;
    
    // 必要に応じて認証トークンを追加
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリングに使用）
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合の処理
      console.error('Authentication failed');
    } else if (error.response?.status >= 500) {
      // サーバーエラーの場合の処理
      console.error('Server error:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
