-- テストデータの挿入
INSERT INTO test (name, description) VALUES ('テスト項目1', 'これはテストデータです');
INSERT INTO test (name, description) VALUES ('テスト項目2', '別のテストデータです');

-- company用のテストデータ（eventsで参照するため先に挿入）
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
) VALUES
    (uuid_generate_v4(), '株式会社テックソリューション', 'tech@example.com', '03-1234-5678', '東京都渋谷区', 50000000, 100, '2020-01-01 00:00:00', 'AI・IT技術企業', CURRENT_TIMESTAMP),
    (uuid_generate_v4(), '株式会社イノベーション', 'innovation@example.com', '06-9876-5432', '大阪府大阪市', 30000000, 80, '2019-05-15 00:00:00', 'Web開発企業', CURRENT_TIMESTAMP),
    (uuid_generate_v4(), '株式会社フューチャー', 'future@example.com', '052-1111-2222', '愛知県名古屋市', 100000000, 200, '2018-03-10 00:00:00', 'ゲーム開発企業', CURRENT_TIMESTAMP);

-- eventsテストデータの挿入（company_idは実際に存在するcompany.user_idを使用）
DO $$
DECLARE
    company_id1 UUID;
    company_id2 UUID;
    company_id3 UUID;
BEGIN
    -- 既存のcompany IDを取得
    SELECT user_id INTO company_id1 FROM company WHERE company_name = '株式会社テックソリューション' LIMIT 1;
    SELECT user_id INTO company_id2 FROM company WHERE company_name = '株式会社イノベーション' LIMIT 1;
    SELECT user_id INTO company_id3 FROM company WHERE company_name = '株式会社フューチャー' LIMIT 1;

    -- eventsテーブルにデータを挿入
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
(company_id1, 'インターンシップ', 'AI業界の最前線を体験！1Dayインターン', NULL, '最新AI技術を学べる特別プログラム', '2025-05-10 10:00', '2025-05-10 17:00', '東京本社', '10000円', 'Python基礎知識', 20, '["AI", "技術", "1Day"]'),
-- 2
(company_id2, '説明会', 'Web業界まるわかり企業説明会', NULL, 'IT業界の構造や働き方を紹介します', '2025-05-11 13:00', '2025-05-11 15:00', 'オンライン', '', '', 100, '["Web", "IT", "説明会"]'),
-- 3
(company_id3, 'インターンシップ', '3Daysデータ分析インターン', NULL, '実データを用いた分析体験', '2025-05-13 09:00', '2025-05-15 17:00', '大阪オフィス', '30000円', '統計学の基礎', 10, '["データ", "分析", "統計"]'),
-- 4
(company_id1, '説明会', 'ベンチャー企業向け就活ガイダンス', NULL, '急成長企業の魅力をご紹介', '2025-05-14 16:00', '2025-05-14 18:00', 'Zoom', '', '', 200, '["ベンチャー", "就活"]'),
-- 5
(company_id2, 'インターンシップ', 'ゲーム開発体験インターン', NULL, 'Unityを使ってゲームを作ろう！', '2025-05-16 10:00', '2025-05-17 17:00', '名古屋支社', '15000円', 'C#の経験', 15, '["ゲーム", "開発", "Unity"]'),
-- 6
(company_id3, '説明会', 'エンジニア志望向け業界説明会', NULL, '業界の動向とキャリアパスを紹介', '2025-05-18 10:00', '2025-05-18 12:00', 'オンライン', '', '', 50, '["エンジニア", "説明会"]'),
-- 7
(company_id1, 'インターンシップ', 'IoT開発1Weekインターン', NULL, 'センサー技術を用いた開発演習', '2025-05-19 09:00', '2025-05-23 17:00', '福岡オフィス', '50000円', 'C言語経験', 8, '["IoT", "開発", "技術"]'),
-- 8
(company_id2, '説明会', 'DX企業紹介セミナー', NULL, 'デジタル変革を推進する企業の実例を紹介', '2025-05-20 14:00', '2025-05-20 16:00', 'Teams', '', '', 150, '["DX", "IT企業"]'),
-- 9
(company_id3, 'インターンシップ', '2Daysハッカソンチャレンジ', NULL, 'チームでアイデアを形にする短期集中型', '2025-05-21 09:00', '2025-05-22 18:00', '渋谷Lab', '20000円', 'プログラミング経験', 12, '["ハッカソン", "開発", "チーム"]'),
-- 10
(company_id1, '説明会', '大手企業の最新働き方紹介セミナー', NULL, 'テレワークやフレックス制度などの紹介', '2025-05-23 11:00', '2025-05-23 13:00', 'YouTube配信', '', '', 300, '["働き方", "説明会", "制度"]');

END $$;

--applicationsダミーデータ
-- applicationsテーブルで実際に存在するevent_idとuser_idを使用
DO $$
DECLARE
    event_id1 UUID;
    event_id2 UUID;
    event_id3 UUID;
    user_id1 UUID;
    user_id2 UUID;
    user_id3 UUID;
BEGIN
    -- 存在するevent_idを取得
    SELECT event_id INTO event_id1 FROM events LIMIT 1 OFFSET 0;
    SELECT event_id INTO event_id2 FROM events LIMIT 1 OFFSET 1;
    SELECT event_id INTO event_id3 FROM events LIMIT 1 OFFSET 2;
    
    -- 存在するapplicant user_idを取得（後で作成されるため、存在しない場合はダミーUUIDを使用）
    user_id1 := uuid_generate_v4();
    user_id2 := uuid_generate_v4();
    user_id3 := uuid_generate_v4();

    -- ダミーデータ1
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),  -- application_id
        event_id1,           -- event_id (実際に存在するeventsテーブルのIDを指定)
        user_id1,            -- user_id
        '未対応',            -- status
        NOW() - INTERVAL '3 days', -- applied_at (3日前のタイムスタンプ)
        NOW() - INTERVAL '3 days'  -- processed_at (3日前のタイムスタンプ)
    );
    -- ダミーデータ2
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id2,
        user_id2,
        '承認',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '1 day' -- processed_at (1日前に更新)
    );
    -- ダミーデータ3
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id3,
        user_id3,
        '否認',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
    );
    -- ダミーデータ4 (別のステータスの例)
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id1,
        user_id1,
        '未対応',  -- '処理中'は定義されていないため'未対応'に変更
        NOW() - INTERVAL '10 hours',
        NOW() - INTERVAL '2 hours'
    );
    -- ダミーデータ5
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id2,
        user_id2,
        '承認',
        '2025-05-01 10:00:00', -- 特定の日時を指定
        '2025-05-02 15:30:00'  -- 特定の日時を指定
    );
END $$;

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

-- applicant用デモデータの挿入
-- 既存のユーザーデータを保持（変数に格納）
DO $$
DECLARE
    user_id1 UUID;
    event_id1 UUID;
    company_id1 UUID;
BEGIN
    -- applicantテーブルにデータを挿入し、IDを取得
    INSERT INTO applicant (
        user_id, last_name, first_name, mail_address, phone_number, address, birth_date, license
    ) VALUES (
        uuid_generate_v4(), '山田', '太郎', 'yamada@example.com', '090-1234-5678', '東京都渋谷区', '1998-05-15', '基本情報技術者'
    ) RETURNING user_id INTO user_id1;
    
    -- テスト用に既存のapplicantも保持
    INSERT INTO applicant (
        user_id, last_name, first_name, mail_address, phone_number, address, birth_date, license
    ) VALUES (
        uuid_generate_v4(), '石田', '省吾', 'ishida@gmail.com', '012000000000', '大阪', '2000-03-21', '漢検5級'
    );

    -- eventsテーブルから最初のイベントIDを取得
    SELECT event_id INTO event_id1 FROM events LIMIT 1;
    
    -- applicationsテーブルにテストデータを挿入
    INSERT INTO applications (
        event_id, user_id, status, message
    ) VALUES (
        event_id1, user_id1, '未対応', 'このインターンシップに非常に興味があります。ぜひ参加させてください。'
    );
END $$;

-- participants用テストデータの挿入
INSERT INTO participants (
    event_id,
    user_id,
    status
    ) VALUES (
        (SELECT event_id FROM events LIMIT 1),
        '11111111-1111-1111-1111-111111111111',
        '参加中'
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
    uuid_generate_v4(),
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