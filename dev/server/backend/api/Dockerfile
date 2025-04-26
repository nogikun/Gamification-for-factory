# Pythonベースのイメージを使用
FROM python:3.10.14-slim

# curlのインストール（ヘルスチェック用）
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# uvツールをコピー
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY ./ /app

# uvを使用して依存関係をインストール
RUN uv pip install --no-cache --system -r requirements.lock

# アプリケーションコードをコピー
COPY . .

# アプリケーションの起動ポート
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 起動コマンド
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]