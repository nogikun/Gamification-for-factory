# 📱 Android実機へのアプリインストールガイド

## 🎯 概要
Capacitorアプリ（`dev/app`）をAndroid実機に直接インストールする方法を説明します。

## 📋 事前準備

### 1. 必要なツール
- **Java JDK 11以上** (Android APKビルド用)
- **Android SDK Platform Tools** (ADB用)
- **USB ケーブル** (デバイス接続用)

### 2. Android SDKインストール
```batch
# Android Command Line Toolsダウンロード
https://developer.android.com/studio#command-tools

# 環境変数設定
set ANDROID_HOME=C:\android-sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
```

## 🔧 Androidデバイス設定

### 1. 開発者オプション有効化
1. **設定** → **端末情報** → **ビルド番号**を7回タップ
2. 「開発者になりました」メッセージが表示される

### 2. USBデバッグ有効化
1. **設定** → **開発者向けオプション**
2. **USBデバッグ**をONにする
3. **不明なソースからのアプリ**をONにする（Android 8.0以降は不要）

### 3. PC接続
1. USBケーブルでPCとAndroidデバイスを接続
2. デバイスに「USBデバッグを許可しますか？」が表示されたら**OK**

## 🚀 インストール実行

### 方法1: 自動インストール（推奨）
```batch
# 一括実行スクリプト
.\install_to_android_device.bat
```

### 方法2: 手動ステップ実行
```batch
# 1. アプリディレクトリに移動
cd dev\app

# 2. 依存関係修正
npm install @rollup/rollup-win32-x64-msvc

# 3. Webアプリビルド
npm run build

# 4. Capacitor同期
npx cap sync android

# 5. APKビルド
cd android
.\gradlew assembleDebug

# 6. デバイス接続確認
adb devices

# 7. APKインストール
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

## 📦 手動インストール（ADB不要）

### USBファイル転送の場合:
1. **APKファイル**を見つける:
   ```
   dev\app\android\app\build\outputs\apk\debug\app-debug.apk
   ```

2. **APKファイル**をAndroidデバイスの`Download`フォルダにコピー

3. **Androidデバイス**で:
   - ファイルマネージャーアプリを開く
   - `Download`フォルダを開く
   - `app-debug.apk`をタップ
   - インストールを許可

### クラウド転送の場合:
1. APKファイルをGoogle Drive/Dropbox等にアップロード
2. Androidデバイスで該当ファイルをダウンロード
3. ダウンロードしたAPKファイルをタップしてインストール

## 🔍 トラブルシューティング

### よくある問題と解決方法:

#### 1. 「adb: command not found」
```batch
# Android Platform Toolsインストール
# https://developer.android.com/studio/releases/platform-tools

# 環境変数にパス追加
set PATH=%PATH%;C:\platform-tools
```

#### 2. 「device not found」
```batch
# デバイス接続確認
adb devices

# ドライバー問題の場合
# デバイスマネージャーでAndroidデバイスドライバー更新
```

#### 3. 「Installation failed」
```batch
# 既存アプリを削除してから再インストール
adb uninstall io.ionic.starter
adb install -r app-debug.apk
```

#### 4. 「Unknown sources not allowed」
- **Android 8.0以前**: 設定 → セキュリティ → 不明なソースからのアプリ ON
- **Android 8.0以降**: インストール時に個別に許可

## 📲 インストール後の確認

### 1. アプリの起動
- アプリドロワーで「**worker-app**」を探す
- タップしてアプリが正常に起動することを確認

### 2. ログ確認（開発用）
```batch
# リアルタイムログ表示
adb logcat | findstr "Capacitor"

# アプリ固有ログ
adb logcat | findstr "io.ionic.starter"
```

## 🔄 アップデート方法

### 新しいバージョンをインストール:
```batch
# 1. 新しいAPKをビルド
.\install_to_android_device.bat

# 2. または手動で上書きインストール
adb install -r app-debug.apk
```

## ⚠️ 注意事項

- **開発版APK**なので、Google Playの署名なしで実行されます
- **セキュリティ警告**が表示される場合がありますが、自分で開発したアプリなので安全です
- **リリース版**を作成する場合は、署名付きAPKをビルドしてください

## 🔗 参考リンク

- [Capacitor - Running on Android](https://capacitorjs.com/docs/android/running)
- [Android Debug Bridge (ADB)](https://developer.android.com/studio/command-line/adb)
- [Android Developer Options](https://developer.android.com/studio/debug/dev-options) 