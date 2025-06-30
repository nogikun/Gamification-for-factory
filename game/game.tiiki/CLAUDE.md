# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「まちこうばダンジョン」- 製造業をテーマにしたブラウザベースのダンジョン攻略ゲーム。
日本人が利用することを前提としたプロダクトです。

## 技術スタック

- **フレームワーク**: React 18 + Vite
- **言語**: JavaScript (JSX)
- **スタイリング**: CSS Modules
- **状態管理**: React Hooks (useState, useEffect)
- **ビルドツール**: Vite
- **リンター**: ESLint

## コマンド

```bash
# 開発サーバー起動（通常は実行不要）
npm run dev

# ビルド
npm run build

# リント
npm run lint

# プレビュー（ビルド後）
npm run preview
```

**重要**: `npm run dev` は実行しないでください（こちらで実行するため）

**ビルド・リントの確認**: 変更後は必ず `npm run build` と `npm run lint` を実行してエラーがないことを確認してください。

## アーキテクチャ

### フォルダ構成

```
src/
├── App.jsx                    # メインアプリケーションコンポーネント
├── gameData.js               # ゲームデータ定義（武器、敵、計算式）
├── hooks/
│   └── useGameState.js       # ゲーム状態管理の中央集権フック
└── components/
    ├── MainScreen.jsx        # メイン画面（ダンジョン選択）
    ├── InventoryScreen.jsx   # インベントリ画面
    ├── DungeonScreen.jsx     # ダンジョン画面
    ├── BattleScreen.jsx      # 戦闘画面
    ├── TrainingScreen.jsx    # 訓練画面（クイズシステム）
    └── SettingsScreen.jsx    # 設定画面
```

### 状態管理

**`useGameState.js`** がアプリケーション全体の状態を管理：

- **player**: レベル、経験値、スタミナ、インベントリ、装備武器
- **dungeon**: 現在のダンジョン、敵一覧、戦闘状態
- **ui**: 現在の画面、戦闘ログ

### 画面遷移

`currentScreen`で制御される単一画面アプリケーション：
- `main` → `dungeon` → `battle` → `dungeon` または `main`
- `main` → `training` → `main`
- `inventory`, `settings`はどの画面からでもアクセス可能

### ゲームシステム

1. **属性システム**: 切削 > 溶接 > 研磨 > 切削（じゃんけん式）
2. **レアリティ**: N < R < SR < UR
3. **重量クラス**: 軽量 < 中量 < 重量（スタミナ消費量に影響）
4. **装備システム**: 4つの装備スロット
5. **経験値・レベル**: 指数関数的な成長曲線
6. **訓練システム**: クイズ形式で知識習得とレベルアップ

### データ定義の場所

**`gameData.js`**にすべての静的ゲームデータを集約：
- 武器データ（WEAPONS）
- 敵データ（ENEMIES）
- ダンジョンデータ（DUNGEONS）
- クイズデータ（QUIZ.txt読み込み）
- レアリティ、属性、重量クラス定義
- ダメージ、経験値、スタミナ計算式

**外部データファイル**:
- `QUIZ.txt` - クイズデータ（JSON形式）
- `adjustment.txt` - 数値調整用データ（CSVライク形式）

**データ読み込みシステム**: `loadAdjustmentData()`, `loadQuizData()` 関数で非同期読み込み

### アセット管理

画像は`/image/`以下に体系的に整理：
- `weapon/` - 武器画像（属性別サブフォルダ: cutting, welding, polishing）
- `enemy/` - 敵画像（ダンジョン別サブフォルダ: 切削, 溶接, トレーニング）
- `main/` - UI画像（タイトル、背景）
- `stage/` - 背景画像（戦闘時、訓練時）
- `player/` - キャラクター画像
- `dungeon/` - ダンジョン外観画像（各属性別）

**画像命名規則**: `[属性]_[重量クラス]_[レアリティ].png`、一部は`_flipped`サフィックス付き

## 開発時の注意点

### コード規約

- JSXファイルは`.jsx`拡張子を使用
- 関数コンポーネントを使用
- propsの命名は`on*`でイベントハンドラを明示
- 日本語のコメントとUI文言を使用

### 状態更新

`useGameState`のsetterを使用して状態を更新。直接stateを変更しない。
例：`equipWeapon()`, `dealDamageToEnemy()`, `addBattleLog()`

### 新機能追加時

1. **新しい武器/敵**: `gameData.js`にデータ追加
2. **新しい画面**: `components/`にコンポーネント作成し、`App.jsx`の`renderCurrentScreen()`に追加
3. **新しい状態**: `useGameState.js`の`initialGameState`と対応するsetterを追加
4. **新しいクイズ**: `QUIZ.txt`にクイズデータ追加（JSON形式）

### デバッグ

ゲーム状態は`useGameState`で一元管理されているため、React DevToolsで容易にデバッグ可能。

### git

gitに上げる指示が出た際には、https://github.com/Kaito220009/game.tiiki/のブランチclaudecodeにプッシュまでしてください