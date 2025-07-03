/**
 * APIキー暗号化保存ユーティリティ
 * localStorage用のセキュアな保存・読み込み機能を提供
 */

// 暗号化用のキー設定
const ENCRYPTION_KEY_NAME = 'app_encryption_key';
const API_KEYS_STORAGE_KEY = 'encrypted_api_keys';

// 暗号化アルゴリズムの設定
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // GCMモードでは12バイトが推奨

/**
 * 暗号化キーを生成または取得
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
    try {
        // 既存のキーがあるかチェック
        const existingKey = localStorage.getItem(ENCRYPTION_KEY_NAME);
        
        if (existingKey) {
            // 既存のキーを復元
            const keyData = new Uint8Array(JSON.parse(existingKey));
            return await crypto.subtle.importKey(
                'raw',
                keyData,
                { name: ALGORITHM, length: KEY_LENGTH },
                false,
                ['encrypt', 'decrypt']
            );
        } else {
            // 新しいキーを生成
            const key = await crypto.subtle.generateKey(
                { name: ALGORITHM, length: KEY_LENGTH },
                true,
                ['encrypt', 'decrypt']
            );
            
            // キーをエクスポートして保存
            const exportedKey = await crypto.subtle.exportKey('raw', key);
            const keyArray = Array.from(new Uint8Array(exportedKey));
            localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(keyArray));
            
            return key;
        }
    } catch (error) {
        console.error('暗号化キーの取得/生成に失敗:', error);
        throw new Error('暗号化キーの初期化に失敗しました');
    }
}

/**
 * データを暗号化
 */
async function encryptData(data: string): Promise<string> {
    try {
        const key = await getOrCreateEncryptionKey();
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        
        // ランダムなIV（初期化ベクトル）を生成
        const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        
        // データを暗号化
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: ALGORITHM, iv },
            key,
            dataBuffer
        );
        
        // IVと暗号化データを結合
        const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedBuffer), iv.length);
        
        // Base64エンコードして文字列として返す
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('データの暗号化に失敗:', error);
        throw new Error('データの暗号化に失敗しました');
    }
}

/**
 * データを復号化
 */
async function decryptData(encryptedData: string): Promise<string> {
    try {
        const key = await getOrCreateEncryptionKey();
        
        // Base64デコード
        const combined = new Uint8Array(
            atob(encryptedData).split('').map(char => char.charCodeAt(0))
        );
        
        // IVと暗号化データを分離
        const iv = combined.slice(0, IV_LENGTH);
        const encryptedBuffer = combined.slice(IV_LENGTH);
        
        // データを復号化
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            key,
            encryptedBuffer
        );
        
        // 文字列として返す
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (error) {
        console.error('データの復号化に失敗:', error);
        throw new Error('データの復号化に失敗しました');
    }
}

/**
 * APIキーデータの型定義
 */
interface ApiKeyData {
    geminiApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
    lastUpdated?: string;
}

/**
 * APIキーを暗号化してlocalStorageに保存
 */
export async function saveApiKeys(apiKeys: ApiKeyData): Promise<void> {
    try {
        const jsonData = JSON.stringify(apiKeys);
        const encryptedData = await encryptData(jsonData);
        localStorage.setItem(API_KEYS_STORAGE_KEY, encryptedData);
        console.log('APIキーが正常に保存されました');
    } catch (error) {
        console.error('APIキーの保存に失敗:', error);
        throw error;
    }
}

/**
 * localStorageからAPIキーを復号化して読み込み
 */
export async function loadApiKeys(): Promise<ApiKeyData | null> {
    try {
        const encryptedData = localStorage.getItem(API_KEYS_STORAGE_KEY);
        if (!encryptedData) {
            return null; // データが存在しない
        }
        
        const decryptedData = await decryptData(encryptedData);
        const apiKeys = JSON.parse(decryptedData) as ApiKeyData;
        console.log('APIキーが正常に読み込まれました');
        return apiKeys;
    } catch (error) {
        console.error('APIキーの読み込みに失敗:', error);
        // データが破損している場合は削除
        localStorage.removeItem(API_KEYS_STORAGE_KEY);
        return null;
    }
}

/**
 * 特定のAPIキーを保存
 */
export async function saveSpecificApiKey(keyType: keyof ApiKeyData, value: string): Promise<void> {
    try {
        // 既存のデータを読み込み
        const existingData = await loadApiKeys() || {};
        
        // 新しい値を設定
        existingData[keyType] = value;
        existingData.lastUpdated = new Date().toISOString();
        
        // 保存
        await saveApiKeys(existingData);
    } catch (error) {
        console.error(`${keyType}の保存に失敗:`, error);
        throw error;
    }
}

/**
 * 特定のAPIキーを削除
 */
export async function removeSpecificApiKey(keyType: keyof ApiKeyData): Promise<void> {
    try {
        // 既存のデータを読み込み
        const existingData = await loadApiKeys() || {};
        
        // 指定されたキーを削除
        delete existingData[keyType];
        existingData.lastUpdated = new Date().toISOString();
        
        // 保存
        await saveApiKeys(existingData);
    } catch (error) {
        console.error(`${keyType}の削除に失敗:`, error);
        throw error;
    }
}

/**
 * 全てのAPIキーを削除
 */
export async function clearAllApiKeys(): Promise<void> {
    try {
        localStorage.removeItem(API_KEYS_STORAGE_KEY);
        console.log('全てのAPIキーが削除されました');
    } catch (error) {
        console.error('APIキーの削除に失敗:', error);
        throw error;
    }
}

/**
 * 暗号化キーをリセット（注意：既存のデータは復元不可能になります）
 */
export async function resetEncryptionKey(): Promise<void> {
    try {
        localStorage.removeItem(ENCRYPTION_KEY_NAME);
        localStorage.removeItem(API_KEYS_STORAGE_KEY);
        console.log('暗号化キーがリセットされました');
    } catch (error) {
        console.error('暗号化キーのリセットに失敗:', error);
        throw error;
    }
}

/**
 * isEncryptionSupported - Web Crypto APIがサポートされているかチェック
 */
export function isEncryptionSupported(): boolean {
    return typeof crypto !== 'undefined' && 
           typeof crypto.subtle !== 'undefined' &&
           typeof crypto.getRandomValues === 'function';
}

/**
 * maskApiKey - APIキーをマスキング表示用に変換
 */
export function maskApiKey(apiKey: string, visibleChars: number = 4): string {
    if (!apiKey || apiKey.length <= visibleChars) {
        return apiKey;
    }
    
    const maskedLength = apiKey.length - visibleChars;
    const visiblePart = apiKey.slice(-visibleChars);
    const maskedPart = '*'.repeat(Math.min(maskedLength, 12)); // 最大12文字のマスク
    
    return maskedPart + visiblePart;
}
