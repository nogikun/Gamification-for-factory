FROM node:18-alpine as build

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm ci

# アプリケーションコードをコピー
COPY . /app

# アプリケーションのビルド
RUN npm run build

# 本番環境用の軽量なイメージを使用
FROM nginx:alpine

# ビルド済みのファイルをnginxのHTMLディレクトリにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginxの設定ファイルをコピー（必要に応じて）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginxのポートを公開
EXPOSE 80

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]