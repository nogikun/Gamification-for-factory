-- テストテーブルの作成
CREATE TYPE event_type_enum AS ENUM ('インターンシップ', '説明会');

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    company_id UUID NOT NULL,
    event_type event_type_enum,
    title VARCHAR(255) NOT NULL,
    image BYTEA,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location VARCHAR(255),
    reward VARCHAR(100),
    required_qualifications TEXT,
    available_spots INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


<<<<<<< Updated upstream
CREATE TYPE event_type AS ENUM ('インターンシップ', '説明会');

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,                              -- イベントID（主キー）
    company_id UUID NOT NULL,                                 -- 企業ID（外部キー）
    event_type event_type NOT NULL,                           -- イベントのタイプ（列挙型）
    title VARCHAR(255) NOT NULL,                              -- イベントのタイトル
    image BYTEA,                                              -- イベントサムネイル（base64エンコード済のバイナリ）
    description TEXT,                                         -- イベントの説明
    start_date TIMESTAMP NOT NULL,                            -- 開始日時
    end_date TIMESTAMP NOT NULL,                              -- 終了日時
    location VARCHAR(255),                                    -- 場所
    reward VARCHAR(100),                                      -- 報酬（円）
    required_qualifications TEXT,                             -- 必要資格
    available_spots INTEGER,                                  -- 募集人数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           -- 更新日時
    tags JSON                                                 -- タグ・ジャンル
);

-- テストデータの挿入
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

=======
-- テストデータの挿入
INSERT INTO test (name, description) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'インターンシップ', 
'夏季エンジニアインターン2025', NULL, '実際の業務に近い開発体験ができます。', '2025-08-01 10:00:00', '2025-08-15 18:00:00', '東京本社', 
'日給1万円', 'プログラミング経験1年以上', 5, NOW(), NOW(), 'これはテストデータです');
INSERT INTO test (name, description) VALUES ('550e8400-e29b-41d4-a716-446655440001', '説明会', '新卒向け会社説明会', 
NULL, '弊社のカルチャーや働き方をご紹介します。', '2025-05-10 14:00:00', '2025-05-10 16:00:00', 'オンライン（Zoom）',
 NULL, NULL, 100, NOW(), NOW(), '別のテストデータです');
>>>>>>> Stashed changes

CREATE TABLE applications (
    application_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id), -- usersテーブルのuser_idを参照
    event_id UUID REFERENCES events(event_id), -- eventsテーブルのevent_idを参照
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
-- ダミーデータ1
INSERT INTO applications (application_id, user_id, event_id, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),  -- application_id
    gen_random_uuid(),  -- user_id (実際には存在するusersテーブルのIDを指定)
    gen_random_uuid(),  -- event_id (実際には存在するeventsテーブルのIDを指定)
    '未対応',            -- status
    NOW() - INTERVAL '3 days', -- created_at (3日前のタイムスタンプ)
    NOW() - INTERVAL '3 days'  -- updated_at (3日前のタイムスタンプ)
);
-- ダミーデータ2
INSERT INTO applications (application_id, user_id, event_id, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    '承認',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day' -- updated_at (1日前に更新)
);
-- ダミーデータ3
INSERT INTO applications (application_id, user_id, event_id, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    '拒否',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
);
-- ダミーデータ4 (別のステータスの例)
INSERT INTO applications (application_id, user_id, event_id, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    '処理中',
    NOW() - INTERVAL '10 hours',
    NOW() - INTERVAL '2 hours'
);
-- ダミーデータ5
INSERT INTO applications (application_id, user_id, event_id, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    '承認',
    '2025-05-01 10:00:00', -- 特定の日時を指定
    '2025-05-02 15:30:00'  -- 特定の日時を指定
);

-- ENUMの定義（先に実行）
CREATE TYPE user_type_enum AS ENUM ('参加者', '企業');

-- テーブル作成
CREATE TABLE "user" (
    user_id UUID PRIMARY KEY,                       -- ユーザーID（主キー）
    user_type user_type_enum,                       -- ユーザータイプ（ENUM）
    user_name VARCHAR(50),                          -- ユーザー名・企業名
    created_at TIMESTAMP,                           -- 作成日時
    login_time TIMESTAMP,                           -- 最終ログイン日時
    ai_advice TEXT                                   -- AIによるアドバイス
);
-- ユーザー1：参加者
INSERT INTO "user" (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '参加者',
    '田中 太郎',
    '2025-05-01 10:00:00',
    '2025-05-22 08:30:00',
    'ポジティブな姿勢が高評価でした。今後は質問への具体性を意識しましょう。'
);

-- ユーザー2：企業
INSERT INTO "user" (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '企業',
    '株式会社テック未来',
    '2025-04-15 09:00:00',
    '2025-05-20 17:45:00',
    '参加者のスキルに対する評価が一貫しており、信頼されています。'
);

-- ユーザー3：参加者（アドバイスなし）
INSERT INTO "user" (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '参加者',
    '佐藤 花子',
    '2025-03-10 14:20:00',
    '2025-05-21 12:00:00',
    NULL
);

-- ユーザー4：企業（ログイン履歴なし）
INSERT INTO "user" (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '企業',
    '人材ラボ株式会社',
    '2025-01-05 11:00:00',
    NULL,
    '新しいイベントに積極的に参加しています。'
);

-- ユーザー5：参加者
INSERT INTO "user" (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '参加者',
    '山田 一郎',
    '2025-05-10 08:00:00',
    '2025-05-22 09:15:00',
    '自己分析がしっかりできており、志望動機に説得力がありました。'
);
