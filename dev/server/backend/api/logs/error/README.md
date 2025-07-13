# Error Logs Directory

このディレクトリには、クライアントサイドからのエラーレポートが保存されます。

## ファイル命名規則

- ファイル名: `error-report_YYYY-MM-DD_HH-MM-SS.txt`
- 例: `error-report_2025-07-10_14-30-45.txt`

## ファイル形式

- 構造化されたテキスト形式
- 各エラーレポートには以下の情報が含まれます：
  - Report ID
  - User ID
  - Error Message
  - Error Type
  - API Endpoint
  - Stack Trace
  - Additional Context
  - Timestamp

## 注意事項

- ログファイルは自動的に生成されます
- ローテーション機能は将来的に実装予定
- 本番環境では適切なログレベルとローテーション設定を行ってください
