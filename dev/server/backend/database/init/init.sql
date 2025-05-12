-- uuid-ossp 拡張機能を有効にする
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


--------------------------------------------------
--   TABLE NAME: test
-- DISCRIPTIONS: テスト用のテーブル（サンプル）
--------------------------------------------------
CREATE TABLE test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--------------------------------------------------
--   TABLE NAME: applicant
-- DISCRIPTIONS: ユーザーの基本情報を格納するテーブル
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
-- DISCRIPTIONS: イベント情報を格納するテーブル
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


-- デモデータ挿入

-- test用でもデータの挿入
INSERT INTO test (name, description) VALUES ('テスト項目1', 'これはテストデータです');
INSERT INTO test (name, description) VALUES ('テスト項目2', '別のテストデータです');
-- eventsテストデータの挿入
INSERT INTO events (
    company_id,
    event_type,
    title,
    image,
    description,
    start_date,
    end_date,
    location,
    reward,
    required_qualifications,
    available_spots,
    tags
) VALUES
-- 1
(gen_random_uuid(), 'インターンシップ', 'AI業界の最前線を体験！1Dayインターン', NULL, '最新AI技術を学べる特別プログラム', '2025-05-10 10:00', '2025-05-10 17:00', '東京本社', '10000円', 'Python基礎知識', 20, '["AI", "技術", "1Day"]'),
-- 2
(gen_random_uuid(), '説明会', 'Web業界まるわかり企業説明会', NULL, 'IT業界の構造や働き方を紹介します', '2025-05-11 13:00', '2025-05-11 15:00', 'オンライン', '', '', 100, '["Web", "IT", "説明会"]'),
-- 3
(gen_random_uuid(), 'インターンシップ', '3Daysデータ分析インターン', NULL, '実データを用いた分析体験', '2025-05-13 09:00', '2025-05-15 17:00', '大阪オフィス', '30000円', '統計学の基礎', 10, '["データ", "分析", "統計"]'),
-- 4
(gen_random_uuid(), '説明会', 'ベンチャー企業向け就活ガイダンス', NULL, '急成長企業の魅力をご紹介', '2025-05-14 16:00', '2025-05-14 18:00', 'Zoom', '', '', 200, '["ベンチャー", "就活"]'),
-- 5
(gen_random_uuid(), 'インターンシップ', 'ゲーム開発体験インターン', NULL, 'Unityを使ってゲームを作ろう！', '2025-05-16 10:00', '2025-05-17 17:00', '名古屋支社', '15000円', 'C#の経験', 15, '["ゲーム", "開発", "Unity"]'),
-- 6
(gen_random_uuid(), '説明会', 'エンジニア志望向け業界説明会', NULL, '業界の動向とキャリアパスを紹介', '2025-05-18 10:00', '2025-05-18 12:00', 'オンライン', '', '', 50, '["エンジニア", "説明会"]'),
-- 7
(gen_random_uuid(), 'インターンシップ', 'IoT開発1Weekインターン', NULL, 'センサー技術を用いた開発演習', '2025-05-19 09:00', '2025-05-23 17:00', '福岡オフィス', '50000円', 'C言語経験', 8, '["IoT", "開発", "技術"]'),
-- 8
(gen_random_uuid(), '説明会', 'DX企業紹介セミナー', NULL, 'デジタル変革を推進する企業の実例を紹介', '2025-05-20 14:00', '2025-05-20 16:00', 'Teams', '', '', 150, '["DX", "IT企業"]'),
-- 9
(gen_random_uuid(), 'インターンシップ', '2Daysハッカソンチャレンジ', NULL, 'チームでアイデアを形にする短期集中型', '2025-05-21 09:00', '2025-05-22 18:00', '渋谷Lab', '20000円', 'プログラミング経験', 12, '["ハッカソン", "開発", "チーム"]'),
-- 10
(gen_random_uuid(), '説明会', '大手企業の最新働き方紹介セミナー', NULL, 'テレワークやフレックス制度などの紹介', '2025-05-23 11:00', '2025-05-23 13:00', 'YouTube配信', '', '', 300, '["働き方", "説明会", "制度"]');

-- applicant用デモデータの挿入
INSERT INTO applicant (
    last_name, first_name, mail_address, phone_number, address, birth_date, license
) VALUES (
    '石田', '省吾', 'ishida@gmail.com', '012000000000', '大阪', '2000-03-21', '漢検5級'
);