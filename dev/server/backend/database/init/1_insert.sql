-- test用デモデータの挿入
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