// API接続設定
// 開発環境ではlocalhostを使用し、Docker環境ではbackendコンテナ名を使用
let apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ブラウザ環境ではlocalhostを使用する
if (typeof window !== 'undefined' && apiBaseUrl.includes('backend')) {
  apiBaseUrl = 'http://localhost:8000';
}

export const API_BASE_URL = apiBaseUrl;

// APIリクエスト関数
export const apiRequest = async (url, method = 'GET', data = null) => {
  try {
    console.log(`APIリクエスト: ${API_BASE_URL}${url}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined
    };
    
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    if (!response.ok) {
      let errorMessage = '不明なエラー';
      try {
        const errorData = await response.json();
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData);
      } catch (e) {
        errorMessage = `HTTPエラー: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return method === 'DELETE' ? null : await response.json();
  } catch (error) {
    console.error(`API通信エラー (${url}):`, error);
    throw error;
  }
}; 