<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

## FastAPIを使ったローカル通知サーバーから送信する包括的ガイド

_Ionic + Capacitor Android開発で通信処理対応_

### 必要な要素の概要

| 要素 | 機能 | 重要度 |
| :-- | :-- | :-- |
| Firebase Cloud Messaging (FCM) | プッシュ通知の送信システム | 必須 |
| Firebase Admin SDK | サーバー側からFCMにアクセス | 必須 |
| FastAPI サーバー | ローカル通知サーバー | 必須 |
| Ionic/Capacitor アプリ | 通知受信クライアント | 必須 |
| サービスアカウントキー | Firebase認証用の秘密鍵 | 必須 |

### 1. Firebase プロジェクトとサービスアカウントの設定

#### Firebase プロジェクト作成・設定

1. **Firebase Console** (https://console.firebase.google.com/) にアクセス[1][2]
2. 新規プロジェクトを作成または既存プロジェクトを選択
3. **プロジェクト設定** → **サービスアカウント** に移動[3][4]
4. **新しい秘密鍵の生成** をクリックして JSON ファイルをダウンロード[5]

#### 重要事項

- このJSONファイルは **機密情報** のため、公開リポジトリに保存しない[3][6]
- ファイル名を `serviceAccountKey.json` など分かりやすい名前にする[7]


### 2. FastAPI サーバーの構築

#### 必要な依存関係のインストール

```bash
pip install fastapi uvicorn firebase-admin
```


#### FastAPI サーバーコード実装

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, messaging
import uvicorn
from typing import Optional

# FastAPI アプリ初期化
app = FastAPI(title="Push Notification Server")

# CORS設定 - Android アプリからのアクセスを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では特定のオリジンに限定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase Admin SDK 初期化
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# リクエストモデル定義
class NotificationRequest(BaseModel):
    token: str
    title: str
    body: str
    data: Optional[dict] = None

class TopicNotificationRequest(BaseModel):
    topic: str
    title: str
    body: str
    data: Optional[dict] = None

# 個別端末への通知送信
@app.post("/send-notification")
async def send_notification(request: NotificationRequest):
    try:
        # FCM メッセージ構築
        message = messaging.Message(
            notification=messaging.Notification(
                title=request.title,
                body=request.body,
            ),
            data=request.data or {},
            token=request.token,
            android=messaging.AndroidConfig(
                notification=messaging.AndroidNotification(
                    icon="ic_stat_notify",
                    color="#488AFF",
                    sound="default",
                    channel_id="default"
                )
            )
        )
        
        # メッセージ送信
        response = messaging.send(message)
        return {
            "success": True,
            "message_id": response,
            "target": request.token
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# トピック購読者への一括通知
@app.post("/send-topic-notification")
async def send_topic_notification(request: TopicNotificationRequest):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=request.title,
                body=request.body,
            ),
            data=request.data or {},
            topic=request.topic,
        )
        
        response = messaging.send(message)
        return {
            "success": True,
            "message_id": response,
            "topic": request.topic
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 端末トークン登録（管理用）
registered_tokens = []

@app.post("/register-token")
async def register_token(token_data: dict):
    token = token_data.get("token")
    if token and token not in registered_tokens:
        registered_tokens.append(token)
        return {"success": True, "message": "Token registered"}
    return {"success": False, "message": "Invalid or duplicate token"}

# ヘルスチェック
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "push-notification-server"}

if __name__ == "__main__":
    # Android 端末からアクセス可能にするため、host を 0.0.0.0 に設定
    uvicorn.run(app, host="0.0.0.0", port=8000)
```


### 3. Android端末からのアクセス設定

#### FastAPI サーバー起動（外部アクセス対応）

```bash
# すべてのネットワークインターフェースでリッスン
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

この設定により、同一ネットワーク内のAndroid端末からアクセス可能になります[8][9]。

#### Android端末からのアクセス方法

| 環境 | アクセス方法 | URL例 |
| :-- | :-- | :-- |
| Android エミュレータ | `10.0.2.2:8000` | `http://10.0.2.2:8000` [10][11] |
| 実機（同一WiFi） | PC のローカル IP | `http://192.168.1.100:8000` [12][13] |

### 4. Ionic/Capacitor アプリ側の実装

#### プラグインインストール

```bash
npm install @capacitor/push-notifications
npx cap sync android
```


#### Angular/TypeScript 実装例

```typescript
import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomePage implements OnInit {
  
  private apiUrl = 'http://192.168.1.100:8000'; // PC のローカル IP に変更
  private deviceToken: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initializePushNotifications();
  }

  async initializePushNotifications() {
    // 権限要求
    const permResult = await PushNotifications.requestPermissions();
    
    if (permResult.receive === 'granted') {
      // FCM 登録
      await PushNotifications.register();
      
      // 登録成功リスナー
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Device token:', token.value);
        this.deviceToken = token.value;
        this.registerTokenWithServer(token.value);
      });

      // 通知受信リスナー（フォアグラウンド）
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Notification received:', notification);
          // カスタム処理
        });

      // 通知タップリスナー
      PushNotifications.addListener('pushNotificationActionPerformed',
        (action: ActionPerformed) => {
          console.log('Notification action:', action);
          // 画面遷移などの処理
        });
    }
  }

  // サーバーにトークン登録
  private async registerTokenWithServer(token: string) {
    try {
      const response = await this.http.post(`${this.apiUrl}/register-token`, {
        token: token
      }).toPromise();
      console.log('Token registered with server:', response);
    } catch (error) {
      console.error('Failed to register token:', error);
    }
  }

  // テスト通知送信（UI ボタン用）
  async sendTestNotification() {
    if (!this.deviceToken) {
      console.error('Device token not available');
      return;
    }

    try {
      const notification = {
        token: this.deviceToken,
        title: 'テスト通知',
        body: 'FastAPI から送信されました！',
        data: {
          route: '/test',
          timestamp: new Date().toISOString()
        }
      };

      const response = await this.http.post(`${this.apiUrl}/send-notification`, notification).toPromise();
      console.log('Notification sent:', response);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}
```


### 5. 通信とネットワーク設定の詳細

#### FastAPI の CORS 設定

```python
from fastapi.middleware.cors import CORSMiddleware

# 開発環境用の緩和設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では具体的なオリジンを指定
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# 本番環境推奨設定
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:8100", "capacitor://localhost"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],
#     allow_headers=["Content-Type", "Authorization"],
# )
```


#### ネットワーク接続確認方法

```bash
# PC のローカル IP 確認（Windows）
ipconfig

# PC のローカル IP 確認（macOS/Linux）
ifconfig | grep "inet " | grep -v 127.0.0.1

# FastAPI サーバーが起動中か確認
curl http://localhost:8000/health
```


### 6. Firebase プロジェクト設定の補完

#### Android アプリ追加設定

1. Firebase Console → プロジェクト設定 → **アプリを追加** → **Android**[14][15]
2. パッケージ名を Ionic プロジェクトの `package-id` と一致させる
3. `google-services.json` をダウンロードし、`android/app/` に配置[16][14]
4. `npx cap sync android` で反映

#### FCM サービス設定確認

```bash
# Firebase CLI インストール（必要に応じて）
npm install -g firebase-tools

# Firebase プロジェクト確認
firebase projects:list
```


### 7. HTTP v1 API への対応

2024年6月以降、FCM は HTTP v1 API への移行が必要です[17][2]。Firebase Admin SDK を使用することで、自動的に v1 API が使われます[18]。

#### HTTP v1 API の利点

| 従来の Legacy API | HTTP v1 API |
| :-- | :-- |
| 固定のサーバーキー | 短期間有効なアクセストークン[1] |
| セキュリティリスク高 | OAuth2 ベースで安全[18] |
| プラットフォーム制限 | クロスプラットフォーム対応[17] |

### 8. トラブルシューティング

#### よくある問題と解決策

| 問題 | 原因 | 解決策 |
| :-- | :-- | :-- |
| Android 端末から API にアクセスできない | ホスト設定の問題 | `--host 0.0.0.0` で起動[8][9] |
| 通知が届かない | トークン登録未完了 | デバッグログでトークン確認[19] |
| CORS エラー | オリジン設定の問題 | CORS ミドルウェア設定確認[20][21] |
| Firebase 認証エラー | サービスアカウントキーの問題 | JSON ファイルのパス確認[22][1] |

#### デバッグ用コマンド

```bash
# Android デバイスから API テスト
adb shell am start -a android.intent.action.VIEW -d "http://192.168.1.100:8000/health"

# FCM ログ確認
adb logcat | grep FCM
```


### 9. セキュリティと本番運用の考慮事項

#### セキュリティ設定

```python
# 環境変数でサービスアカウントキーを管理
import os
from firebase_admin import credentials

# 環境変数から読み込み
service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY', './serviceAccountKey.json')
cred = credentials.Certificate(service_account_path)
```


#### 本番環境への配慮

- CORS の `allow_origins` を具体的なドメインに制限[23][24]
- サービスアカウントキーを環境変数で管理[6]
- アクセスログの記録とエラーハンドリングの強化
- レート制限の実装（連続送信防止）

この設定により、ローカル FastAPI サーバーから Ionic Android アプリへの通知送信システムが完成します。同一 WiFi ネットワーク内であれば、PC で動作する FastAPI サーバーから Android 端末への通知が可能になります[7][25][26]。

