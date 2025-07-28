@echo off
chcp 65001 >nul
REM Android実機にアプリを直接インストールするスクリプト

echo [INFO] Android実機へのアプリインストールを開始します...

REM 現在のディレクトリを保存
set CURRENT_DIR=%CD%

REM スクリプトがあるディレクトリに移動
cd /d "%~dp0"

REM アプリディレクトリに移動
cd dev\app
echo [INFO] ディレクトリ移動: %CD%

REM 1. Webアプリビルド
echo [INFO] Step 1/5: Webアプリをビルド中...
call npm install @rollup/rollup-win32-x64-msvc --silent
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Webアプリのビルドに失敗しました
    pause
    exit /b 1
)

REM 2. Capacitor同期
echo [INFO] Step 2/5: Androidプロジェクトと同期中...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [ERROR] Capacitor同期に失敗しました
    pause
    exit /b 1
)

REM 3. APKビルド
echo [INFO] Step 3/5: APKファイルをビルド中...
cd android
call .\gradlew assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo [ERROR] APKビルドに失敗しました
    echo [INFO] Android SDK Command Line Toolsがインストールされていることを確認してください
    echo [INFO] https://developer.android.com/studio#command-tools
    pause
    exit /b 1
)

REM 4. デバイス接続確認
echo [INFO] Step 4/5: 接続されたAndroidデバイスを確認中...
call adb devices
if %errorlevel% neq 0 (
    echo [ERROR] ADBが利用できません
    echo [INFO] Android Platform Toolsをインストールしてください
    echo [INFO] または以下のコマンドでAPKを手動転送してください:
    echo [INFO] APKファイル場所: %CD%\app\build\outputs\apk\debug\app-debug.apk
    pause
    exit /b 1
)

REM 5. APKインストール
echo [INFO] Step 5/5: APKをデバイスにインストール中...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    call adb install -r app\build\outputs\apk\debug\app-debug.apk
    if %errorlevel% equ 0 (
        echo [SUCCESS] アプリがAndroidデバイスに正常にインストールされました！
        echo [INFO] デバイスのアプリ一覧で「worker-app」を確認してください
    ) else (
        echo [ERROR] APKインストールに失敗しました
        echo [INFO] 手動インストール方法:
        echo [INFO] 1. APKファイルをデバイスに転送
        echo [INFO] 2. デバイスで「設定 > セキュリティ > 不明なソースからのアプリ」を有効化
        echo [INFO] 3. ファイルマネージャーでAPKを開いてインストール
    )
) else (
    echo [ERROR] APKファイルが見つかりません
)

REM 元のディレクトリに戻る
cd /d "%CURRENT_DIR%"

echo.
echo [完了] 処理が終了しました
echo.

pause 