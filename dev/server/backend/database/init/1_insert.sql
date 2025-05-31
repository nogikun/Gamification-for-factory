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

--applicationsダミーデータ
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

--userダミーデータ
-- ユーザー1：参加者
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '参加者',
    '田中 太郎',
    '2025-05-01 10:00:00',
    '2025-05-22 08:30:00',
    'ポジティブな姿勢が高評価でした。今後は質問への具体性を意識しましょう。'
);

-- ユーザー2：企業
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '企業',
    '株式会社テック未来',
    '2025-04-15 09:00:00',
    '2025-05-20 17:45:00',
    '参加者のスキルに対する評価が一貫しており、信頼されています。'
);

-- ユーザー3：参加者（アドバイスありに変更）
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '参加者',
    '佐藤 花子',
    '2025-03-10 14:20:00',
    '2025-05-21 12:00:00',
    '受け答えが丁寧で、好印象を与えていました。'
);

-- ユーザー4：企業（ログイン履歴追加）
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '企業',
    '人材ラボ株式会社',
    '2025-01-05 11:00:00',
    '2025-05-22 16:30:00',
    '新しいイベントに積極的に参加しています。'
);

-- ユーザー5：参加者
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '参加者',
    '山田 一郎',
    '2025-05-10 08:00:00',
    '2025-05-22 09:15:00',
    '自己分析がしっかりできており、志望動機に説得力がありました。'
);

-- company用デモデータの挿入
INSERT INTO company (
    user_id,
    company_name,
    mail_address,
    phone_number,
    address,
    capital,
    employees,
    establishment_date,
    overview,
    updated_at
)VALUES(
    uuid_generate_v4(),
    '株式会社A',
    'A@gmail.com',
    '080-1234-5678',
    '大阪府大阪市中央区',
    10000000,
    50,
    '2025-05-01 00:00:00',
    '製造企業',
    CURRENT_TIMESTAMP
);

-- company用デモデータの挿入
INSERT INTO company (
    user_id,
    company_name,
    mail_address,
    phone_number,
    address,
    capital,
    employees,
    establishment_date,
    overview,
    updated_at
)VALUES(
    uuid_generate_v4(),
    '株式会社A',
    'A@gmail.com',
    '080-1234-5678',
    '大阪府大阪市中央区',
    10000000,
    50,
    '2025-05-01 00:00:00',
    '製造企業',
    CURRENT_TIMESTAMP
);

-- applicant用デモデータの挿入
INSERT INTO applicant (
    user_id,
    last_name,
    first_name,
    mail_address,
    phone_number,
    address,
    birth_date,
    license,
    updated_at
) VALUES (
    uuid_generate_v4(),
    '山田',
    '太郎',
    'A@example.com',
    '080-1234-5678',
    '東京都新宿区',
    '2000-01-01 00:00:00',
    '普通自動車免許',
    CURRENT_TIMESTAMP
);

-- participants用テストデータの挿入
INSERT INTO participants (
    event_id,
    user_id,
    status
    ) VALUES (
        1,
        '11111111-1111-1111-1111-111111111111',
        '参加中'
        );
);

-- player用デモデータの挿入
INSERT INTO player (
    user_id,
    level,
    experience,
    skill_data,
    item_data,
    updated_at
) VALUES (
    gen_random_uuid(),
    5,
    10,
    '{
        "skill_data":[
            {
                "skill_label":"",
                "skill_level":0,
                "skill_exp":0
            },
            {
                "skill_label":"",
                "skill_level":0,
                "skill_exp":0
            }
        ]
    }',
    '{
        "items":[
            {
                "item_id":"",
                "durability":0
            },
            {
                "item_id":"",
                "durability":0
            }
        ]
    }',
    CURRENT_TIMESTAMP
);