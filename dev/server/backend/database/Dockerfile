FROM postgres:15

# PostgreSQLの設定ファイルを必要に応じてコピー
# COPY postgresql.conf /etc/postgresql/postgresql.conf

# PostgreSQLの設定（必要に応じて変更）
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=db
ENV TZ=Asia/Tokyo

# タイムゾーンの設定
RUN apt-get install -y tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD pg_isready -U postgres || exit 1

# PostgreSQLのデフォルトポート
EXPOSE 5432