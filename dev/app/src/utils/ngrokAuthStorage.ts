// ngrok認証の永続化とストレージ管理

const NGROK_AUTH_TOKEN_KEY = 'ngrok_auth_token';
const NGROK_AUTH_TIMESTAMP_KEY = 'ngrok_auth_timestamp';

// トークンの有効期限（24時間）
const TOKEN_EXPIRY_HOURS = 24;

/**
 * 認証トークンをローカルストレージに保存
 */
export const saveAuthToken = (token: string): void => {
    try {
        localStorage.setItem(NGROK_AUTH_TOKEN_KEY, token);
        localStorage.setItem(NGROK_AUTH_TIMESTAMP_KEY, new Date().toISOString());
    } catch (error) {
        console.error('Failed to save ngrok auth token:', error);
    }
};

/**
 * ローカルストレージから認証トークンを取得
 */
export const getStoredAuthToken = (): string | null => {
    try {
        const token = localStorage.getItem(NGROK_AUTH_TOKEN_KEY);
        const timestamp = localStorage.getItem(NGROK_AUTH_TIMESTAMP_KEY);
        
        if (!token || !timestamp) {
            return null;
        }
        
        // トークンの有効期限をチェック
        const tokenDate = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - tokenDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff > TOKEN_EXPIRY_HOURS) {
            // 有効期限切れの場合、トークンを削除
            clearStoredAuthToken();
            return null;
        }
        
        return token;
    } catch (error) {
        console.error('Failed to get ngrok auth token:', error);
        return null;
    }
};

/**
 * ローカルストレージから認証トークンを削除
 */
export const clearStoredAuthToken = (): void => {
    try {
        localStorage.removeItem(NGROK_AUTH_TOKEN_KEY);
        localStorage.removeItem(NGROK_AUTH_TIMESTAMP_KEY);
    } catch (error) {
        console.error('Failed to clear ngrok auth token:', error);
    }
};

/**
 * 保存されたトークンが有効かどうかをチェック
 */
export const isStoredTokenValid = (): boolean => {
    return getStoredAuthToken() !== null;
};

/**
 * トークンの残り有効時間（分）を取得
 */
export const getTokenRemainingTime = (): number | null => {
    try {
        const timestamp = localStorage.getItem(NGROK_AUTH_TIMESTAMP_KEY);
        if (!timestamp) {
            return null;
        }
        
        const tokenDate = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - tokenDate.getTime()) / (1000 * 60 * 60);
        const remainingHours = TOKEN_EXPIRY_HOURS - hoursDiff;
        
        return Math.max(0, Math.round(remainingHours * 60)); // 分単位で返す
    } catch (error) {
        console.error('Failed to get token remaining time:', error);
        return null;
    }
};
