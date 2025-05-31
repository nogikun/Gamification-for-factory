FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm ci

# アプリケーションコードをコピー
COPY . /app

# Vite開発サーバーのポートを公開
EXPOSE 5173

# Vite開発サーバーを起動
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]