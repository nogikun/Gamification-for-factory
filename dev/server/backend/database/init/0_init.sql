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
-- DESCRIPTIONS: イベントへの応募情報を管理するテーブル
--------------------------------------------------
CREATE TYPE application_status AS ENUM ('未対応', '承認', '否認');
CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,                 -- 応募ID（主キー）
    event_id INTEGER NOT NULL,                         -- イベントID（外部キー）
    user_id UUID NOT NULL,                             -- ユーザーID（外部キー）
    status application_status NOT NULL DEFAULT '未対応', -- 応募状態
    message TEXT,                                      -- 応募メッセージ
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 応募日時
    processed_at TIMESTAMP,                            -- 処理日時
    processed_by UUID,                                 -- 処理者ID（企業側ユーザー）
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES applicant(user_id)
);