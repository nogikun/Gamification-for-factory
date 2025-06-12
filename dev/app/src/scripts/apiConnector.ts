import axios from "axios";


// APIのベースURLを設定
const API_BASE_URL = "http://localhost:3000"; // sample
export const apiConnector = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// setApiBaseUrl - ベースURLを変更する関数
export const setApiBaseUrl = (url: string) => {
    apiConnector.defaults.baseURL = url;
};

// リクエストのインターセプターを設定
apiConnector.interceptors.request.use(
    (config) => {
        // ngrokトンネル使用時のブラウザ警告をスキップ
        if (config.baseURL?.includes('ngrok') || config.url?.includes('ngrok')) {
            // 複数のヘッダーを組み合わせて確実に回避
            config.headers['ngrok-skip-browser-warning'] = 'true';
            config.headers['User-Agent'] = 'ngrok-api-client/1.0';
            config.headers['X-Forwarded-For'] = '127.0.0.1';
            config.headers['Accept'] = 'application/json';
            console.log('Axios interceptor: ngrok headers applied', config.headers);
        }
        
        // リクエストが送信される前に何らかの処理を行うことができます
        // 例: 認証トークンの追加など
        return config;
    },
    (error) => {
        // リクエストエラーの処理
        return Promise.reject(error);
    }
);