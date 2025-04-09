# Pythonベースのイメージを使用
FROM python:3.10.14-slim

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# uvツールをコピー
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# 依存関係ファイルをコピー
COPY requirements.lock pyproject.toml README.md ./

# uvを使用して依存関係をインストール
RUN uv pip install --no-cache --system -r requirements.lock

# アプリケーションコードをコピー
COPY . .

# ヘルスチェック（workerの場合は必要に応じて調整）
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# 起動コマンド
CMD ["python", "main.py"]