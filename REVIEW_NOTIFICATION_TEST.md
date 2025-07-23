# レビュー通知システム テスト手順書

## 概要
このドキュメントでは、新しく実装したレビュー通知システムのテスト手順について説明します。

## 実装内容

### 1. バックエンド（FastAPI）
- **新しいエンドポイント**: `GET /api/review-notification`
- **機能**: REQUESTEDステータスのレビューリクエストを取得し、通知として返す
- **パラメータ**:
  - `user_id` (optional): 特定ユーザーの通知のみ取得
  - `skip` (default: 0): ページング用スキップ数
  - `limit` (default: 100): 取得件数上限

### 2. フロントエンド（Ionic React）
- **API関数**: `reviewNotificationApi.getReviewNotifications()`
- **カスタムフック**: `useReviewNotification()`
- **通知表示**: IonToastを使用した3種類の通知
  - 成功通知（緑色）
  - エラー通知（赤色）
  - レビュー通知（青色、プライマリ）
- **テストUI**: Tab3ページに「レビュー通知チェック」ボタンを追加

## テスト手順

### 事前準備

1. **データベース確認**
   ```sql
   -- review_requestsテーブルにテストデータがあることを確認
   SELECT * FROM review_requests WHERE status = 'REQUESTED';
   ```

2. **サーバー起動**
   ```bash
   cd dev/server/backend/api
   uv run python main.py
   # または
   python main.py
   ```

3. **Ionicアプリ起動**
   ```bash
   cd dev/app
   npm run dev
   ```

### API直接テスト

1. **エンドポイント動作確認**
   ```bash
   # 全通知取得
   curl "http://localhost:3000/api/review-notification"
   
   # 特定ユーザーの通知取得
   curl "http://localhost:3000/api/review-notification?user_id=11111111-1111-1111-1111-111111111111"
   ```

2. **期待される応答形式**
   ```json
   [
     {
       "review_request_id": "uuid",
       "application_id": "uuid", 
       "reviewee_id": "uuid",
       "reviewer_id": "uuid",
       "requested_at": "2024-01-01T00:00:00",
       "request_message": "レビューをお願いします",
       "status": "REQUESTED",
       "event_title": "イベント名",
       "applicant_name": "山田 太郎"
     }
   ]
   ```

### アプリUIテスト

1. **Tab3ページにアクセス**
   - アプリのTab3（Logs）ページを開く
   - 「レビュー通知チェック」ボタンが表示されることを確認

2. **通知機能テスト**
   - 「レビュー通知チェック」ボタンをクリック
   - 以下の動作を確認：
     - ボタンが「チェック中...」に変わる
     - API呼び出しが実行される
     - 通知がトーストで表示される

### 期待される動作パターン

#### パターン1: 通知が存在する場合
1. レビュー通知トーストが上部に表示（青色、6秒間）
   - メッセージ例: "新しいレビューが届きました！📋 [イベント名] 👤 [申請者名]より"
   - 「確認」「閉じる」ボタン付き
2. 成功通知トーストが下部に表示（緑色、3秒間）
   - メッセージ例: "1件の新しいレビュー通知があります"

#### パターン2: 通知が存在しない場合
1. 成功通知トーストが下部に表示（緑色、3秒間）
   - メッセージ: "新しい通知はありません"

#### パターン3: エラーが発生した場合
1. エラー通知トーストが下部に表示（赤色、5秒間）
   - メッセージ例: "エラー: 通知の取得に失敗しました"

### トラブルシューティング

#### よくある問題と解決方法

1. **APIエラー（500 Internal Server Error）**
   - 原因: データベース接続エラーまたはモデル不整合
   - 解決: データベースの状態とモデル定義を確認

2. **CORSエラー**
   - 原因: フロントエンドとバックエンドのURL不一致
   - 解決: Redux store内のserver設定を確認

3. **通知が表示されない**
   - 原因: IonToastの設定問題
   - 解決: ブラウザの開発者コンソールでエラーを確認

4. **データが取得できない**
   - 原因: review_requestsテーブルにREQUESTEDステータスのデータがない
   - 解決: テストデータを挿入

### テストデータ挿入例

```sql
-- テスト用のレビューリクエストデータを挿入
INSERT INTO review_requests (
    review_request_id,
    application_id,
    requested_by,
    requested_at,
    request_message,
    status
) VALUES (
    gen_random_uuid(),
    (SELECT application_id FROM applications LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    NOW(),
    'テスト用のレビューリクエストです',
    'REQUESTED'
);
```

## 実装詳細

### ファイル構成

```
dev/
├── server/backend/api/
│   ├── src/
│   │   ├── schemas/database/review_notification.py  # 新規作成
│   │   ├── crud.py                                  # get_review_notifications関数追加
│   │   └── routers/api/prefix.py                    # /api/review-notificationエンドポイント追加
└── app/
    ├── src/
    │   ├── lib/reviewNotificationApi.ts             # 新規作成
    │   ├── hooks/useReviewNotification.ts           # 新規作成
    │   └── pages/Tab3.tsx                           # 通知ボタン追加
```

### 技術スタック

- **バックエンド**: FastAPI + SQLAlchemy + PostgreSQL
- **フロントエンド**: Ionic React + TypeScript + IonToast
- **通信**: Axios APIクライアント

## 完了確認

✅ 以下すべてが正常に動作することを確認：

1. APIエンドポイントが正常にレスポンスを返す
2. フロントエンドからAPIを呼び出せる
3. 通知データが正しく表示される
4. IonToastでの通知表示が機能する
5. エラーハンドリングが適切に動作する

このテストが完了すれば、レビュー通知システムは本格運用可能な状態になります。