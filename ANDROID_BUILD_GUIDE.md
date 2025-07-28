# Android Studio不要 - Androidアプリビルドガイド

## 📱 概要
このガイドでは、Android Studioを使わずにIonic Capacitorアプリ（`dev/app`）をAndroid APKファイルにビルドする方法を説明します。

## ✅ 前提条件

### 必要なツール:
1. **Node.js** (既にインストール済み)
2. **Java Development Kit (JDK) 11以上**
3. **Android Command Line Tools**

## 🛠️ セットアップ手順

### 1. Java Development Kit (JDK) インストール
```batch
# JDKダウンロード
https://adoptium.net/

# インストール後、環境変数確認
java -version
```

### 2. Android Command Line Tools インストール
```batch
# ダウンロード
https://developer.android.com/studio#command-tools

# 展開後、環境変数設定
set ANDROID_HOME=C:\android-sdk
set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
```

### 3. Android SDK パッケージインストール
```batch
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

## 🚀 ビルド実行

### 自動ビルド（推奨）:
```batch
.\build_android_improved.bat
```

### 手動ビルド:
```batch
# 1. アプリディレクトリに移動
cd dev\app

# 2. 依存関係修正
npm install @rollup/rollup-win32-x64-msvc

# 3. Webアプリビルド
npm run build

# 4. Capacitor同期
npx cap sync android

# 5. AndroidプロジェクトでAPKビルド
cd android
.\gradlew assembleDebug
```

## 📦 ビルド結果

### 成功時の出力ファイル:
```
dev\app\android\app\build\outputs\apk\debug\app-debug.apk
```

### APKインストール:
```batch
# USB接続されたAndroidデバイスに直接インストール
adb install dev\app\android\app\build\outputs\apk\debug\app-debug.apk

# または手動転送
# APKファイルをデバイスにコピーしてファイルマネージャーからインストール
```

## 🌐 代替方法: オンラインビルドサービス

### Capacitor Cloud (旧Ionic Appflow)
```batch
# Capacitor Cloudに登録
npm install -g @capacitor/cli
npx cap cloud build android
```

### EAS Build (Expo)
```batch
# Expo EAS CLI インストール
npm install -g @expo/cli
npm install -g eas-cli

# プロジェクト設定
eas build:configure
eas build --platform android
```

## 🔧 トラブルシューティング

### よくある問題:

1. **Gradleダウンロードエラー**
   ```batch
   # プロキシ設定またはオフラインビルド
   .\gradlew assembleDebug --offline
   ```

2. **Android SDK見つからない**
   ```batch
   # ANDROID_HOME環境変数確認
   echo %ANDROID_HOME%
   ```

3. **ビルドツールエラー**
   ```batch
   # 最新ビルドツールインストール
   sdkmanager "build-tools;33.0.0"
   ```

## 📝 注意事項

- **署名済みAPK（リリース版）** を作成する場合は、キーストアファイルが必要
- **Google Play Store** にアップロードする場合は、App Bundle (.aab) 形式が推奨
- **開発用途** では debug APK で十分

## 🔗 参考リンク

- [Capacitor Android Development](https://capacitorjs.com/docs/android)
- [Android Command Line Tools](https://developer.android.com/studio/command-line)
- [Gradle Build Tool](https://gradle.org/) 
<!-- Copyright (c) 2025 Kaito220009 -->
<!-- All rights reserved. -->
