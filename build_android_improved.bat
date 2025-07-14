@echo off
chcp 65001 >nul
REM 改善されたGameification-for-factory プロジェクトのAndroidビルドスクリプト
REM Android Studio不要でAPKファイルを生成します

echo [INFO] Android Studio不要ビルドを開始します...

REM 現在のディレクトリを保存
set CURRENT_DIR=%CD%

REM スクリプトがあるディレクトリに移動
cd /d "%~dp0"

REM アプリディレクトリに移動
cd dev\app
echo [INFO] ディレクトリ移動: %CD%

REM 依存関係の問題を解決
echo [INFO] Rollup依存関係の確認と修正...
call npm install @rollup/rollup-win32-x64-msvc --silent

REM アプリをビルド
echo [INFO] Webアプリをビルド中...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Webアプリのビルドに失敗しました
    pause
    exit /b 1
)

REM Capacitor を同期
echo [INFO] Androidプロジェクトと同期中...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [ERROR] Capacitor同期に失敗しました
    pause
    exit /b 1
)

REM Androidディレクトリに移動
cd android
echo [INFO] Androidプロジェクトディレクトリ: %CD%

REM Java/Android SDKの環境確認
echo [INFO] Java環境を確認中...
java -version
if %errorlevel% neq 0 (
    echo [ERROR] Javaがインストールされていません
    echo [INFO] 以下のリンクからJava Development Kit (JDK)をインストールしてください:
    echo [INFO] https://adoptium.net/
    pause
    exit /b 1
)

REM Android SDKの確認
if not defined ANDROID_HOME (
    echo [WARNING] ANDROID_HOME環境変数が設定されていません
    echo [INFO] Android SDKの場所を確認して環境変数を設定してください
)

REM Gradleビルド実行
echo [INFO] APKファイルをビルド中...
call .\gradlew assembleDebug --no-daemon --offline
if %errorlevel% neq 0 (
    echo [INFO] オフラインビルドに失敗。オンラインでリトライ中...
    call .\gradlew assembleDebug --no-daemon
    if %errorlevel% neq 0 (
        echo [ERROR] APKビルドに失敗しました
        echo [INFO] Android SDKとビルドツールが正しくインストールされていることを確認してください
        pause
        exit /b 1
    )
)

REM ビルド結果の確認
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo [SUCCESS] APKファイルが正常に生成されました！
    echo [INFO] ファイル場所: %CD%\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo [ERROR] APKファイルが見つかりません
)

REM 元のディレクトリに戻る
cd /d "%CURRENT_DIR%"

echo [INFO] 処理が完了しました！
echo.
echo [次のステップ]
echo - APKファイルをAndroidデバイスにインストール: adb install dev\app\android\app\build\outputs\apk\debug\app-debug.apk
echo - または手動でAPKファイルをデバイスに転送してインストール
echo.

pause 