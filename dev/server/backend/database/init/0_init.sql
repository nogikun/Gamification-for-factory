-- データベースを作成
CREATE DATABASE gamification;

-- uuid-ossp 拡張機能を有効にする
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------
--   TABLE NAME: test
-- DESCRIPTIONS: テスト用のテーブル（サンプル）
--------------------------------------------------
CREATE TABLE test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--------------------------------------------------
--   TABLE NAME: applicant
-- DESCRIPTIONS: ユーザーの基本情報を格納するテーブル
--------------------------------------------------
CREATE TABLE applicant (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),    -- ユーザーID（主キー）
    last_name VARCHAR(50) NOT NULL,                         -- ユーザーの姓
    first_name VARCHAR(50) NOT NULL,                        -- ユーザーの名
    mail_address TEXT,                                      -- メールアドレス
    phone_number VARCHAR(50),                               -- 電話番号
    address TEXT,                                           -- 住所
    birth_date TIMESTAMP,                                   -- 生年月日
    license TEXT,                                           -- 保有資格
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- 更新日時
);

--------------------------------------------------
--   TABLE NAME: events
-- DESCRIPTIONS: イベント情報を格納するテーブル
--------------------------------------------------
CREATE TYPE event_type AS ENUM ('インターンシップ', '説明会');
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,                        -- イベントID（主キー）
    company_id UUID NOT NULL,                           -- 企業ID（外部キー）
    event_type event_type NOT NULL,                     -- イベントのタイプ（列挙型）
    title VARCHAR(255) NOT NULL,                        -- イベントのタイトル
    image BYTEA,                                        -- イベントサムネイル（base64エンコード済のバイナリ）
    description TEXT,                                   -- イベントの説明
    start_date TIMESTAMP NOT NULL,                      -- 開始日時
    end_date TIMESTAMP NOT NULL,                        -- 終了日時
    location VARCHAR(255),                              -- 場所
    reward VARCHAR(100),                                -- 報酬（円）
    required_qualifications TEXT,                       -- 必要資格
    available_spots INTEGER,                            -- 募集人数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 更新日時
    tags JSON                                           -- タグ・ジャンル
);

--------------------------------------------------
--   TABLE NAME: company
-- DESCRIPTIONS: 会社の基本情報を管理するテーブル
--------------------------------------------------
CREATE TABLE company (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),    -- ユーザーID（主キー）
    company_name VARCHAR(50) NOT NULL,                      -- 企業名
    mail_address TEXT NOT NULL,                             -- メールアドレス
    phone_number VARCHAR(50),                               -- 電話番号
    address TEXT NOT NULL,                                  -- 住所
    capital INTEGER,                                        -- 資本金
    employees INTEGER,                                      -- 従業員数
    establishment_date TIMESTAMP,                           -- 設立日
    overview TEXT,                                          -- 会社概要
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- 更新日時
);

--------------------------------------------------
--   TABLE NAME: applications
-- DESCRIPTIONS: イベントへの応募状態（ステータス）を管理する。
--------------------------------------------------
CREATE TABLE applications (
    application_id UUID PRIMARY KEY,
    user_id UUID,           -- usersテーブルのuser_idを参照
    event_id UUID,          -- eventsテーブルのevent_idを参照
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

--------------------------------------------------
--   TABLE NAME: user
-- DESCRIPTIONS: ユーザー情報を管理する。
--------------------------------------------------
-- ENUMの定義（先に実行）
CREATE TYPE user_type_enum AS ENUM ('参加者', '企業');
-- テーブル作成
CREATE TABLE users (
    user_id UUID PRIMARY KEY,                       -- ユーザーID（主キー）
    user_type user_type_enum,                       -- ユーザータイプ（ENUM）
    user_name VARCHAR(50),                          -- ユーザー名・企業名
    created_at TIMESTAMP,                           -- 作成日時
    login_time TIMESTAMP,                           -- 最終ログイン日時
    ai_advice TEXT                                   -- AIによるアドバイス
);

--------------------------------------------------
--   TABLE NAME: participants
-- DESCRIPTIONS: イベント参加者情報を管理するテーブル
--------------------------------------------------
CREATE TABLE participants (
    event_id INTEGER REFERENCES events(event_id),                   -- イベントID（外部キー）
    user_id UUID REFERENCES users(user_id),                      -- ユーザーID（外部キー）
    status TEXT CHECK (status IN ('申請中', '参加中', '終了')),       -- 参加状態（申請中、参加中、終了）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                 -- 作成日時 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                  -- 更新日時
);

--------------------------------------------------
--   TABLE NAME: player
-- DESCRIPTIONS: ゲームの進行に必要な情報を管理するテーブル
--------------------------------------------------
CREATE TABLE player (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),     -- ユーザーID（主キー）
    level INTEGER NOT NULL,                                 -- レベル
    experience INTEGER NOT NULL,                            -- 経験値
    skill_data JSON NOT NULL,                               -- スキルデータ
    item_data JSON NOT NULL,                                -- 保有中のアイテム
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- 更新日時
);

--------------------------------------------------
--   TABLE NAME: reviews
-- DESCRIPTIONS: レビュー情報を格納するテーブル
--------------------------------------------------
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- 評価ID（主キー）
    reviewer_id UUID NOT NULL,                              -- 評価者のユーザーID（外部キー）
    reviewee_id UUID NOT NULL,                              -- 評価対象のユーザーID（外部キー）
    event_id UUID NOT NULL,                                 -- 評価に紐づくイベントID（外部キー）
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),          -- 評価スコア（1〜5点などを想定）
    comment TEXT,                                           -- コメント
    advice TEXT,                                            -- アドバイス
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- 更新日時
);
