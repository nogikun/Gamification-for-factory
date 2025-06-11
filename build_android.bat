@echo off
REM Gamification-for-factory プロジェクトのビルドと Android 同期スクリプト
REM 作成日: 2025年6月9日

echo [INFO] ビルドと Android 同期を開始します...

REM 現在のディレクトリを保存
set CURRENT_DIR=%CD%

REM スクリプトがあるディレクトリに移動
cd /d "%~dp0"

REM アプリディレクトリに移動
cd dev\app
echo [INFO] ディレクトリ移動: %CD%

REM NPM パッケージが最新か確認
echo [INFO] NPM パッケージの確認中...
call npm ci

REM アプリをビルド
echo [INFO] アプリをビルド中...
call npm run build

REM Capacitor を同期
echo [INFO] Android と同期中...
call npx cap sync android

REM 元のディレクトリに戻る
cd /d "%CURRENT_DIR%"

echo [INFO] 処理が完了しました！
echo [INFO] Android Studio で開くには: npx cap open android

pause
