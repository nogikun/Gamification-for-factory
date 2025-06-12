#!/bin/zsh

# Gamification-for-factory プロジェクトのビルドと Android 同期スクリプト
# 作成日: 2025年6月9日

# エラーが発生したら中断
set -e

# 作業ディレクトリの保存
CURRENT_DIR=$(pwd)

# スクリプトの場所を取得
SCRIPT_DIR="${0:a:h}"

# アプリディレクトリに移動
cd "$SCRIPT_DIR/dev/app"
echo "📁 ディレクトリ移動: $(pwd)"

# NPM パッケージが最新か確認
echo "📦 NPM パッケージの確認中..."
npm ci

# アプリをビルド
echo "🔨 アプリをビルド中..."
npm run build

# Capacitor を同期
echo "🔄 Android と同期中..."
npx cap sync android

# 元のディレクトリに戻る
cd "$CURRENT_DIR"

echo "✅ 処理が完了しました！"
echo "Android Studio で開くには: npx cap open android"
