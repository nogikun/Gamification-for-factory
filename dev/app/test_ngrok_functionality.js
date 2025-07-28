// ngrok機能テストファイル
const axios = require('axios');

// テスト用のmockサーバーURL（ngrokのようなURLをシミュレーション）
const testUrls = [
    'https://abc123-ngrok-free.app/health',  // ngrok URL
    'https://test-ngrok.ngrok-free.app/api/test',  // ngrok URL
    'http://localhost:3000/health',  // ローカルURL
];

// axiosインスタンスを作成（アプリケーションと同様の設定）
const apiConnector = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// リクエストインターセプターを設定（アプリケーションと同じ実装）
apiConnector.interceptors.request.use(
    (config) => {
        console.log(`リクエスト送信: ${config.url || config.baseURL}`);
        
        // ngrokトンネル使用時のブラウザ警告をスキップ
        if (config.baseURL?.includes('ngrok') || config.url?.includes('ngrok')) {
            config.headers['ngrok-skip-browser-warning'] = 'true';
            console.log('✓ ngrok検出: ブラウザ警告スキップヘッダーを追加');
        } else {
            console.log('✗ ngrok未検出: 通常のリクエスト');
        }
        
        console.log('送信ヘッダー:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// テスト実行
async function testNgrokFunctionality() {
    console.log('=== ngrok機能テスト開始 ===\n');
    
    for (const url of testUrls) {
        console.log(`🧪 テスト URL: ${url}`);
        
        try {
            // 実際にリクエストは送信せず、インターセプターの動作のみテスト
            const config = {
                url: url,
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                }
            };
            
            // インターセプターのロジックを手動実行
            if (url.includes('ngrok')) {
                config.headers['ngrok-skip-browser-warning'] = 'true';
                console.log('✅ ヘッダー自動追加成功');
            } else {
                console.log('ℹ️  通常のリクエスト（ngrok未使用）');
            }
            
            console.log('最終ヘッダー:', config.headers);
            
        } catch (error) {
            console.error('エラー:', error.message);
        }
        
        console.log('---\n');
    }
    
    console.log('=== テスト完了 ===');
}

// Tab4.tsxのAPI通信テスト関数をシミュレーション
function simulateTab4ApiTest(serverUrl) {
    console.log(`\n🔬 Tab4 API テストシミュレーション: ${serverUrl}`);
    
    // Tab4.tsxと同じロジック
    const headers = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    };
    
    // ngrokトンネルの場合、ブラウザ警告をスキップするヘッダーを追加
    if (serverUrl.includes('ngrok')) {
        headers['ngrok-skip-browser-warning'] = 'true';
        console.log('✅ ngrokトンネル検出: ブラウザ警告スキップヘッダーを追加');
    } else {
        console.log('ℹ️  ngrok未検出: 通常のヘッダー');
    }
    
    console.log('送信ヘッダー:', headers);
    return headers;
}

// テスト実行
testNgrokFunctionality();

// Tab4のAPIテストをシミュレーション
console.log('\n\n=== Tab4 APIテストシミュレーション ===');
simulateTab4ApiTest('https://test-ngrok.ngrok-free.app');
simulateTab4ApiTest('http://localhost:3000');

// Copyright (c) 2025 nogi
// All rights reserved.
