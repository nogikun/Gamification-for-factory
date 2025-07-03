/**
 * APIキー管理機能のテストスクリプト
 * ブラウザのコンソールで実行可能
 */

// Reduxストアとアクションをインポート（実際のブラウザ環境では window経由でアクセス）
// import { store } from '../redux/store';
// import { setGeminiApiKey, clearGeminiApiKey, validateGeminiApiKey } from '../redux/envSlice';
// import { saveSpecificApiKey, loadApiKeys, maskApiKey, isEncryptionSupported } from '../utils/apiKeyStorage';

/**
 * 暗号化機能のテスト
 */
async function testEncryption() {
    console.log('=== 暗号化機能テスト開始 ===');
    
    try {
        // 暗号化サポート確認
        const isSupported = isEncryptionSupported();
        console.log('暗号化サポート:', isSupported);
        
        if (!isSupported) {
            console.warn('暗号化がサポートされていません');
            return;
        }
        
        // テスト用APIキー
        const testApiKey = 'AIzaSyDtestkey123456789abcdefghijklmnop';
        
        // APIキー保存テスト
        console.log('APIキー保存テスト...');
        await saveSpecificApiKey('gemini', testApiKey);
        console.log('✅ APIキー保存成功');
        
        // APIキー読み込みテスト
        console.log('APIキー読み込みテスト...');
        const loadedKeys = await loadApiKeys();
        console.log('読み込み結果:', loadedKeys);
        
        if (loadedKeys.gemini === testApiKey) {
            console.log('✅ APIキー読み込み成功');
        } else {
            console.error('❌ APIキー読み込み失敗');
        }
        
        // マスキング機能テスト
        console.log('マスキング機能テスト...');
        const masked = maskApiKey(testApiKey);
        console.log('マスキング結果:', masked);
        
        if (masked.includes('***') && !masked.includes(testApiKey.slice(5, -5))) {
            console.log('✅ マスキング機能正常');
        } else {
            console.error('❌ マスキング機能異常');
        }
        
    } catch (error) {
        console.error('❌ 暗号化テスト失敗:', error);
    }
    
    console.log('=== 暗号化機能テスト終了 ===\n');
}

/**
 * Redux状態管理のテスト
 */
function testReduxState() {
    console.log('=== Redux状態管理テスト開始 ===');
    
    try {
        // 初期状態確認
        const initialState = store.getState().env;
        console.log('初期状態:', initialState);
        
        // APIキー設定テスト
        const testApiKey = 'AIzaSyDtestkey123456789abcdefghijklmnop';
        store.dispatch(setGeminiApiKey(testApiKey));
        
        const afterSetState = store.getState().env;
        console.log('APIキー設定後:', afterSetState);
        
        if (afterSetState.geminiApiKey === testApiKey && afterSetState.isGeminiConfigured) {
            console.log('✅ APIキー設定成功');
        } else {
            console.error('❌ APIキー設定失敗');
        }
        
        // APIキークリアテスト
        store.dispatch(clearGeminiApiKey());
        
        const afterClearState = store.getState().env;
        console.log('APIキークリア後:', afterClearState);
        
        if (afterClearState.geminiApiKey === '' && !afterClearState.isGeminiConfigured) {
            console.log('✅ APIキークリア成功');
        } else {
            console.error('❌ APIキークリア失敗');
        }
        
    } catch (error) {
        console.error('❌ Redux状態管理テスト失敗:', error);
    }
    
    console.log('=== Redux状態管理テスト終了 ===\n');
}

/**
 * バリデーション機能のテスト
 */
function testValidation() {
    console.log('=== バリデーション機能テスト開始 ===');
    
    try {
        // 有効なAPIキーのテスト
        const validKeys = [
            'AIzaSyDtestkey123456789abcdefghijklmnop',
            'AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P',
            'AIzaSyDabcdefghijklmnopqrstuvwxyz123456'
        ];
        
        validKeys.forEach(key => {
            const result = validateGeminiApiKey(key);
            if (result.isValid) {
                console.log(`✅ 有効なAPIキー: ${key.slice(0, 10)}...`);
            } else {
                console.error(`❌ 有効なはずのAPIキーが無効: ${key}`, result.error);
            }
        });
        
        // 無効なAPIキーのテスト
        const invalidKeys = [
            '',  // 空文字
            'AIzaSy',  // 短すぎる
            'invalid_key',  // プレフィックスが違う
            'AIzaSyD' + 'a'.repeat(100),  // 長すぎる
            'AIzaSyDtest key with spaces',  // スペース含む
            'AIzaSyDtest-key-with-dashes'  // ダッシュ含む
        ];
        
        invalidKeys.forEach(key => {
            const result = validateGeminiApiKey(key);
            if (!result.isValid) {
                console.log(`✅ 無効なAPIキーを正しく検出: ${key || '(空文字)'}`);
            } else {
                console.error(`❌ 無効なはずのAPIキーが有効と判定: ${key}`);
            }
        });
        
    } catch (error) {
        console.error('❌ バリデーション機能テスト失敗:', error);
    }
    
    console.log('=== バリデーション機能テスト終了 ===\n');
}

/**
 * 統合テストの実行
 */
async function runAllTests() {
    console.log('🧪 APIキー管理機能の統合テスト開始');
    console.log('=====================================\n');
    
    await testEncryption();
    testReduxState();
    testValidation();
    
    console.log('=====================================');
    console.log('🧪 APIキー管理機能の統合テスト完了');
}

// ブラウザ環境で実行する場合
if (typeof window !== 'undefined') {
    window.runApiKeyTests = runAllTests;
    console.log('テスト関数をwindow.runApiKeyTests()として登録しました');
    console.log('ブラウザのコンソールで window.runApiKeyTests() を実行してください');
}

// Node.js環境で実行する場合
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testEncryption,
        testReduxState,
        testValidation,
        runAllTests
    };
}
