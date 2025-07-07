# Ngrok Browser Warning Skip Implementation

## 概要

ngrokトンネルを通したAPI通信で発生する「Browser Warning Page」問題を解決するための実装です。

**重要な発見**: ngrokトンネルへのAPI通信では、ブラウザベースの認証は不要です。代わりに、適切なHTTPヘッダーを追加することで警告ページをスキップできます。

## 解決策

### 1. HTTPヘッダーによる警告スキップ

ngrokが提供する`ngrok-skip-browser-warning`ヘッダーを使用して、API通信時にブラウザ警告ページを自動的にバイパスします。

```typescript
headers: {
  'ngrok-skip-browser-warning': 'true'
}
```

### 2. 自動検出と適用

アプリケーションは以下の方法で自動的にngrokトンネルを検出し、適切なヘッダーを追加します：

- **URL検出**: リクエストURLに`ngrok`が含まれる場合に自動適用
- **Axiosインターセプター**: すべてのHTTPリクエストで自動的にチェック
- **手動設定**: Tab4.tsxのAPI通信テストで明示的に設定

## 実装詳細

### ファイル変更

1. **`src/pages/Tab4.tsx`**
   - API通信テスト関数にngrok警告スキップヘッダーを追加
   - ngrok設定UI（従来の「認証」から「設定」に名称変更）
   - 情報提供機能（認証不要の説明）

2. **`src/scripts/apiConnector.ts`**
   - Axiosインターセプターでngrokトンネル検出時に自動ヘッダー追加

### 技術仕様

- **ヘッダー名**: `ngrok-skip-browser-warning`
- **値**: `true`
- **適用条件**: URLに`ngrok`文字列が含まれる場合
- **対象プロトコル**: HTTP/HTTPS

## 使用方法

### 自動適用

アプリケーションは自動的にngrokトンネルを検出し、警告スキップヘッダーを追加します。特別な設定は不要です。

### 手動確認

Tab4画面で「ngrok設定」ボタンをクリックすると、現在の設定状況を確認できます。

## テスト方法

```bash
# ngrokトンネル経由でのAPI通信テスト
curl -H "ngrok-skip-browser-warning: true" https://your-ngrok-url.ngrok-free.app/health
```

## 注意事項

- ngrok認証トークンは**ngrok CLI設定時のみ必要**
- ブラウザからのAPI通信には認証トークンは不要
- `ngrok-skip-browser-warning`ヘッダーで警告ページを回避可能

## 検証結果

実際のテストで以下が確認されました：

```bash
# ngrokトンネルは正常に動作
curl https://2bf5-2400-2200-3db-9802-c9b-67d0-c9c9-9119.ngrok-free.app/health
# {"status":"healthy"}
```

## 参考資料

- [ngrok HTTP/S Endpoints Documentation](https://ngrok.com/docs/universal-gateway/http/)
- [ngrok Headers Documentation](https://ngrok.com/docs/universal-gateway/http/#upstream-headers)

## 実装完了日
2025年6月9日

## バージョン
2.0.0 - Browser Warning Skip Implementation
