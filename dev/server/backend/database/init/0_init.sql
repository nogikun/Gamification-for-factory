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
--   TABLE NAME: user
-- DESCRIPTIONS: ユーザー情報を管理する。
--------------------------------------------------
-- ENUMの定義（先に実行）
CREATE TYPE user_type_enum AS ENUM ('APPLICANT', 'COMPANY');
-- テーブル作成
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),        -- ユーザーID（主キー）
    user_type user_type_enum,                                   -- ユーザータイプ（ENUM）
    user_name VARCHAR(50),                                      -- ユーザー名・企業名
    created_at TIMESTAMP,                                       -- 作成日時
    login_time TIMESTAMP,                                       -- 最終ログイン日時
    ai_advice TEXT                                              -- AIによるアドバイス
);

--------------------------------------------------
--   TABLE NAME: company
-- DESCRIPTIONS: 会社の基本情報を管理するテーブル
--------------------------------------------------
CREATE TABLE company (
    user_id UUID PRIMARY KEY,                               -- ユーザーID（主キー）
    company_name VARCHAR(50) NOT NULL,                      -- 企業名
    mail_address TEXT NOT NULL,                             -- メールアドレス
    phone_number VARCHAR(50),                               -- 電話番号
    address TEXT NOT NULL,                                  -- 住所
    capital INTEGER,                                        -- 資本金
    employees INTEGER,                                      -- 従業員数
    establishment_date TIMESTAMP,                           -- 設立日
    overview TEXT,                                          -- 会社概要
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- 更新日時
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- 更新日時
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--------------------------------------------------
--   TABLE NAME: events
-- DESCRIPTIONS: イベント情報を格納するテーブル
--------------------------------------------------
CREATE TYPE event_type AS ENUM ('INTERNSHIP', 'SEMINAR');
CREATE TABLE events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- イベントID（主キー）
    company_id UUID NOT NULL,                               -- 企業ID（外部キー）
    event_type event_type NOT NULL,                         -- イベントのタイプ（列挙型）
    title VARCHAR(255) NOT NULL,                            -- イベントのタイトル
    image BYTEA,                                            -- イベントサムネイル（base64エンコード済のバイナリ）
    description TEXT,                                       -- イベントの説明
    start_date TIMESTAMP NOT NULL,                          -- 開始日時
    end_date TIMESTAMP NOT NULL,                            -- 終了日時
    location VARCHAR(255),                                  -- 場所
    reward VARCHAR(100),                                    -- 報酬（円）
    required_qualifications TEXT,                           -- 必要資格
    available_spots INTEGER,                                -- 募集人数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- 更新日時
    tags JSON,                                              -- タグ・ジャンル
    FOREIGN KEY (company_id) REFERENCES company(user_id) ON DELETE CASCADE  -- * 会社が削除された場合、関連するイベントも削除
);

--------------------------------------------------
--   TABLE NAME: applications
-- DESCRIPTIONS: イベントへの応募情報を管理するテーブル
--------------------------------------------------
CREATE TYPE application_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- 応募ID（主キー）
    event_id UUID NOT NULL,                                     -- イベントID（外部キー）
    user_id UUID NOT NULL,                                      -- ユーザーID（外部キー）
    status application_status NOT NULL DEFAULT 'PENDING',         -- 応募状態
    message TEXT,                                               -- 応募メッセージ
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,             -- 応募日時
    processed_at TIMESTAMP,                                     -- 処理日時
    processed_by UUID,                                          -- 処理者ID（企業側ユーザー）
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE, -- * イベントが削除された場合、関連する応募も削除
    FOREIGN KEY (user_id) REFERENCES applicant(user_id) ON DELETE CASCADE -- * ユーザーが削除された場合、関連する応募も削除
);

--------------------------------------------------
--   TABLE NAME: applications
-- DESCRIPTIONS: イベントへの応募状態（ステータス）を管理する。
--------------------------------------------------
-- CREATE TABLE applications (
--     application_id UUID PRIMARY KEY,
--     user_id UUID,           -- usersテーブルのuser_idを参照
--     event_id UUID,          -- eventsテーブルのevent_idを参照
--     status VARCHAR(50),
--     created_at TIMESTAMP,
--     updated_at TIMESTAMP
-- );

--------------------------------------------------
--   TABLE NAME: participants
-- DESCRIPTIONS: イベント参加者情報を管理するテーブル
--------------------------------------------------
CREATE TYPE participants_status AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');
CREATE TABLE participants (
    participant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),     -- 参加者ID（主キー）
    event_id UUID REFERENCES events(event_id),                      -- イベントID（外部キー）
    user_id UUID REFERENCES users(user_id),                         -- ユーザーID（外部キー）
    status participants_status NOT NULL DEFAULT 'PENDING',            -- 参加者のステータス
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                 -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                 -- 更新日時
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE, -- * イベントが削除された場合、関連する参加者情報も削除（ユーザーから見える形にするなら、参加者情報は残すべき）
    FOREIGN KEY (user_id) REFERENCES applicant(user_id) ON DELETE CASCADE -- * ユーザーが削除された場合、関連する参加者情報も削除
);

--------------------------------------------------
--   TABLE NAME: player
-- DESCRIPTIONS: ゲームの進行に必要な情報を管理するテーブル
--------------------------------------------------
CREATE TABLE player (
    user_id UUID PRIMARY KEY,                               -- ユーザーID（主キー）
    level INTEGER NOT NULL,                                 -- レベル（経験値に基づく）
    experience INTEGER NOT NULL,                            -- 経験値
    skill_data JSON NOT NULL,                               -- スキルデータ
    item_data JSON NOT NULL,                                -- 保有中のアイテム
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- 更新日時
    FOREIGN KEY (user_id) REFERENCES applicant(user_id) ON DELETE CASCADE -- * ユーザーが削除された場合、関連するプレイヤーデータも削除
);

--------------------------------------------------
--   TABLE NAME: review_requests
-- DESCRIPTIONS: レビューリクエスト情報を管理するテーブル
--------------------------------------------------
CREATE TYPE request_status AS ENUM ('REQUESTED', 'COMPLETED', 'CANCELLED');

CREATE TABLE review_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- リクエストID（主キー）
    application_id UUID NOT NULL,                             -- 応募ID（外部キー）
    requested_by UUID NOT NULL,                               -- リクエスト者ID（企業ユーザー）
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- リクエスト日時
    request_message TEXT,                                     -- リクエストメッセージ
    status request_status NOT NULL DEFAULT 'REQUESTED',        -- リクエスト状態
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           -- 更新日時
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,  -- 応募が削除された場合、関連するリクエストも削除
    FOREIGN KEY (requested_by) REFERENCES users(user_id) ON DELETE CASCADE                    -- ユーザーが削除された場合、関連するリクエストも削除
);

--------------------------------------------------
--   TABLE NAME: reviews
-- DESCRIPTIONS: レビュー情報を管理するテーブル
--------------------------------------------------
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),    -- レビューID（主キー）
    application_id UUID NOT NULL,                             -- 応募ID（外部キー）
    reviewer_id UUID NOT NULL,                                -- レビュアーID（企業ユーザー）
    rating NUMERIC(3, 1) NOT NULL,                            -- 評価点（1.0〜5.0）
    comment TEXT,                                             -- レビューコメント
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           -- 更新日時
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,  -- 応募が削除された場合、関連するレビューも削除
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE                     -- ユーザーが削除された場合、関連するレビューも削除
);

--------------------------------------------------
--   TABLE NAME: game_item
-- DESCRIPTIONS: ゲームの進行度に必要な情報を管理する。
--------------------------------------------------
CREATE TYPE item_type_enum AS ENUM ('武器', '支援アイテム');

CREATE TABLE game_item (
    item_id UUID PRIMARY KEY,              -- アイテムID（主キー）
    item_type item_type_enum,              -- アイテムタイプ（ENUM: 武器 or 支援アイテム）
    atk INTEGER,                           -- 攻撃力
    hit_rate REAL,                         -- 命中率
    crit_dmg INTEGER,                      -- 会心ダメージ
    crit_rate REAL                         -- 会心率
);

--------------------------------------------------
--   TABLE NAME: game_progress
-- DESCRIPTIONS: ゲームの進行度に必要な情報を管理する。
--------------------------------------------------
CREATE TABLE game_progress (
    user_id UUID PRIMARY KEY,            -- ユーザーID（主キー）
    cleared_stages INTEGER NOT NULL,     -- クリア済ステージ数
    progress_percentage INTEGER,         -- 自動計算される進行度（%）
    updated_at TIMESTAMP NOT NULL        -- 最終更新日時
);