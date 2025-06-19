-- テストデータの挿入
INSERT INTO test (name, description) VALUES ('テスト項目1', 'これはテストデータです');
INSERT INTO test (name, description) VALUES ('テスト項目2', '別のテストデータです');

--userダミーデータ
-- ユーザー1：参加者
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'APPLICANT',
    '田中 太郎',
    '2025-05-01 10:00:00',
    '2025-05-22 08:30:00',
    'ポジティブな姿勢が高評価でした。今後は質問への具体性を意識しましょう。'
);

-- ユーザー2：企業
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'COMPANY',
    '株式会社テック未来',
    '2025-04-15 09:00:00',
    '2025-05-20 17:45:00',
    '参加者のスキルに対する評価が一貫しており、信頼されています。'
);

-- ユーザー3：参加者（アドバイスありに変更）
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'APPLICANT',
    '佐藤 花子',
    '2025-03-10 14:20:00',
    '2025-05-21 12:00:00',
    '受け答えが丁寧で、好印象を与えていました。'
);

-- ユーザー4：企業（ログイン履歴追加）
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    'COMPANY',
    '人材ラボ株式会社',
    '2025-01-05 11:00:00',
    '2025-05-22 16:30:00',
    '新しいイベントに積極的に参加しています。'
);

-- ユーザー5：参加者
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    'APPLICANT',
    '山田 一郎',
    '2025-05-10 08:00:00',
    '2025-05-22 09:15:00',
    '自己分析がしっかりできており、志望動機に説得力がありました。'
);

-- 企業ユーザー追加（会社情報と関連付けるため）
INSERT INTO users (user_id, user_type, user_name, created_at, login_time, ai_advice)
VALUES 
    ('c0000001-0000-0000-0000-000000000001', 'COMPANY', '株式会社テックソリューション', '2025-04-01 09:00:00', '2025-05-21 15:30:00', NULL),
    ('c0000002-0000-0000-0000-000000000002', 'COMPANY', '株式会社イノベーション', '2025-04-02 10:00:00', '2025-05-22 14:20:00', NULL),
    ('c0000003-0000-0000-0000-000000000003', 'COMPANY', '株式会社フューチャー', '2025-04-03 11:00:00', '2025-05-20 16:45:00', NULL),
    ('12345678-1234-1234-1234-123456789012', 'COMPANY', '株式会社サンプル', '2025-04-04 12:00:00', '2025-05-22 13:00:00', NULL);

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
    ('c0000001-0000-0000-0000-000000000001', '株式会社テックソリューション', 'tech@example.com', '03-1234-5678', '東京都渋谷区', 50000000, 100, '2020-01-01 00:00:00', 'AI・IT技術企業', CURRENT_TIMESTAMP),
    ('c0000002-0000-0000-0000-000000000002', '株式会社イノベーション', 'innovation@example.com', '06-9876-5432', '大阪府大阪市', 30000000, 80, '2019-05-15 00:00:00', 'Web開発企業', CURRENT_TIMESTAMP),
    ('c0000003-0000-0000-0000-000000000003', '株式会社フューチャー', 'future@example.com', '052-1111-2222', '愛知県名古屋市', 100000000, 200, '2018-03-10 00:00:00', 'ゲーム開発企業', CURRENT_TIMESTAMP),
    ('12345678-1234-1234-1234-123456789012', '株式会社サンプル', 'sample@example.com', '03-9999-8888', '東京都千代田区', 25000000, 50, '2021-06-01 00:00:00', 'サンプル企業', CURRENT_TIMESTAMP);

-- eventsテストデータの挿入（company_idは実際に存在するcompany.user_idを使用）
DO $$
DECLARE
    company_id1 UUID := 'c0000001-0000-0000-0000-000000000001';
    company_id2 UUID := 'c0000002-0000-0000-0000-000000000002';
    company_id3 UUID := 'c0000003-0000-0000-0000-000000000003';
BEGIN
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
(company_id1, 'INTERNSHIP', 'AI業界の最前線を体験！1Dayインターン', NULL, '最新AI技術を学べる特別プログラム', '2025-05-10 10:00', '2025-05-10 17:00', '東京本社', '10000円', 'Python基礎知識', 20, '["AI", "技術", "1Day"]'),
-- 2
(company_id2, 'SEMINAR', 'Web業界まるわかり企業説明会', NULL, 'IT業界の構造や働き方を紹介します', '2025-05-11 13:00', '2025-05-11 15:00', 'オンライン', '', '', 100, '["Web", "IT", "説明会"]'),
-- 3
(company_id3, 'INTERNSHIP', '3Daysデータ分析インターン', NULL, '実データを用いた分析体験', '2025-05-13 09:00', '2025-05-15 17:00', '大阪オフィス', '30000円', '統計学の基礎', 10, '["データ", "分析", "統計"]'),
-- 4
(company_id1, 'SEMINAR', 'ベンチャー企業向け就活ガイダンス', NULL, '急成長企業の魅力をご紹介', '2025-05-14 16:00', '2025-05-14 18:00', 'Zoom', '', '', 200, '["ベンチャー", "就活"]'),
-- 5
(company_id2, 'INTERNSHIP', 'ゲーム開発体験インターン', NULL, 'Unityを使ってゲームを作ろう！', '2025-05-16 10:00', '2025-05-17 17:00', '名古屋支社', '15000円', 'C#の経験', 15, '["ゲーム", "開発", "Unity"]'),
-- 6
(company_id3, 'SEMINAR', 'エンジニア志望向け業界説明会', NULL, '業界の動向とキャリアパスを紹介', '2025-05-18 10:00', '2025-05-18 12:00', 'オンライン', '', '', 50, '["エンジニア", "説明会"]'),
-- 7
(company_id1, 'INTERNSHIP', 'IoT開発1Weekインターン', NULL, 'センサー技術を用いた開発演習', '2025-05-19 09:00', '2025-05-23 17:00', '福岡オフィス', '50000円', 'C言語経験', 8, '["IoT", "開発", "技術"]'),
-- 8
(company_id2, 'SEMINAR', 'DX企業紹介セミナー', NULL, 'デジタル変革を推進する企業の実例を紹介', '2025-05-20 14:00', '2025-05-20 16:00', 'Teams', '', '', 150, '["DX", "IT企業"]'),
-- 9
(company_id3, 'INTERNSHIP', '2Daysハッカソンチャレンジ', NULL, 'チームでアイデアを形にする短期集中型', '2025-05-21 09:00', '2025-05-22 18:00', '渋谷Lab', '20000円', 'プログラミング経験', 12, '["ハッカソン", "開発", "チーム"]'),
-- 10
(company_id1, 'SEMINAR', '大手企業の最新働き方紹介セミナー', NULL, 'テレワークやフレックス制度などの紹介', '2025-05-23 11:00', '2025-05-23 13:00', 'YouTube配信', '', '', 300, '["働き方", "説明会", "制度"]');

END $$;

--applicationsダミーデータ
-- applicationsテーブルの挿入は後で行います（applicantテーブル作成後）

-- applicant用デモデータの挿入（参加者ユーザーをapplicantテーブルにも登録）
DO $$
DECLARE
    user_id1 UUID := '11111111-1111-1111-1111-111111111111'; -- 田中太郎
    user_id2 UUID := '33333333-3333-3333-3333-333333333333'; -- 佐藤花子
    user_id3 UUID := '55555555-5555-5555-5555-555555555555'; -- 山田一郎
    event_id1 UUID;
    event_id2 UUID;
    event_id3 UUID;
BEGIN
    -- applicantテーブルにデータを挿入
    INSERT INTO applicant (
        user_id, last_name, first_name, mail_address, phone_number, address, birth_date, license
    ) VALUES
    (user_id1, '田中', '太郎', 'tanaka@example.com', '090-1111-2222', '東京都新宿区', '1995-10-15', '普通自動車免許'),
    (user_id2, '佐藤', '花子', 'sato@example.com', '080-3333-4444', '大阪府大阪市', '1998-05-20', 'TOEIC 800点'),
    (user_id3, '山田', '一郎', 'yamada@example.com', '070-5555-6666', '福岡県福岡市', '1997-12-10', '基本情報技術者');
    
    -- eventsテーブルから最初のイベントIDを取得
    SELECT event_id INTO event_id1 FROM events LIMIT 1 OFFSET 0;
    SELECT event_id INTO event_id2 FROM events LIMIT 1 OFFSET 1;
    SELECT event_id INTO event_id3 FROM events LIMIT 1 OFFSET 2;
    
    -- applicationsテーブルにテストデータを挿入
    -- ダミーデータ1
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),  -- application_id
        event_id1,           -- event_id (実際に存在するeventsテーブルのIDを指定)
        user_id1,            -- user_id (田中太郎)
        'PENDING',            -- status
        NOW() - INTERVAL '3 days', -- applied_at (3日前のタイムスタンプ)
        NOW() - INTERVAL '3 days'  -- processed_at (3日前のタイムスタンプ)
    );
    -- ダミーデータ2
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id2,
        user_id2,            -- user_id (佐藤花子)
        'APPROVED',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '1 day' -- processed_at (1日前に更新)
    );
    -- ダミーデータ3
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id3,
        user_id3,            -- user_id (山田一郎)
        'REJECTED',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
    );
    -- ダミーデータ4 (別のステータスの例)
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id1,
        user_id1,            -- user_id (田中太郎)
        'PENDING',  -- '処理中'は定義されていないため'PENDING'に変更
        NOW() - INTERVAL '10 hours',
        NOW() - INTERVAL '2 hours'
    );
    -- ダミーデータ5
    INSERT INTO applications (application_id, event_id, user_id, status, applied_at, processed_at)
    VALUES (
        uuid_generate_v4(),
        event_id2,
        user_id2,            -- user_id (佐藤花子)
        'APPROVED',
        '2025-05-01 10:00:00', -- 特定の日時を指定
        '2025-05-02 15:30:00'  -- 特定の日時を指定
    );
    
    -- applicationメッセージ付きデータ
    INSERT INTO applications (
        event_id, user_id, status, message, applied_at, processed_at
    ) VALUES
    (event_id1, user_id1, 'PENDING', 'このインターンシップに非常に興味があります。ぜひ参加させてください。', NOW() - INTERVAL '5 days', NULL),
    (event_id1, user_id2, 'APPROVED', '貴社のインターンシップに参加したいです。', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
    (event_id1, user_id3, 'REJECTED', '参加を希望します。', NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days');
END $$;

-- applicationsダミーデータ
-- 既に上記で適切なデータを挿入済み
INSERT INTO participants (
    event_id,
    user_id,
    status
) VALUES (
    (SELECT event_id FROM events LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    'ACTIVE'
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
    '11111111-1111-1111-1111-111111111111', -- 田中太郎のユーザーID
    5,
    10,
    '{
        "skill_data":[
            {
                "skill_label":"プログラミング",
                "skill_level":3,
                "skill_exp":150
            },
            {
                "skill_label":"コミュニケーション",
                "skill_level":2,
                "skill_exp":80
            }
        ]
    }',
    '{
        "items":[
            {
                "item_id":"book1",
                "durability":100
            },
            {
                "item_id":"laptop1",
                "durability":80
            }
        ]
    }',
    CURRENT_TIMESTAMP
);

-- レビュー関連テーブルのテストデータ挿入
DO $$
DECLARE
    app_id1 UUID;
    app_id2 UUID;
BEGIN
    -- applicationsテーブルからIDを動的に取得
    SELECT application_id INTO app_id1 FROM applications LIMIT 1;
    SELECT application_id INTO app_id2 FROM applications LIMIT 1 OFFSET 1;
    
    -- アプリケーションIDが存在する場合のみデータを挿入
    IF app_id1 IS NOT NULL AND app_id2 IS NOT NULL THEN
        -- review_requestsテーブルにテストデータを挿入
        INSERT INTO review_requests (
            application_id,
            requested_by,
            requested_at,
            request_message,
            status
        ) VALUES
        (
            app_id1,
            'c0000001-0000-0000-0000-000000000001',
            NOW() - INTERVAL '2 days',
            'イベント参加後のフィードバックをお願いします。',
            'REQUESTED'
        ),
        (
            app_id2,
            'c0000001-0000-0000-0000-000000000001',
            NOW() - INTERVAL '1 day',
            'イベント申請に対する審査をお願いします。',
            'COMPLETED'
        );

        -- reviewsテーブルにテストデータを挿入
        INSERT INTO reviews (
            application_id,
            reviewer_id,
            rating,
            comment
        ) VALUES
        (
            app_id1,
            'c0000001-0000-0000-0000-000000000001',
            4.5,
            '積極的に参加され、良い質問をされていました。次回のイベントにもぜひ参加してください。'
        ),
        (
            app_id2,
            'c0000002-0000-0000-0000-000000000002',
            3.8,
            'チームでの協力が求められる場面で、リーダーシップを発揮していました。もう少し他のメンバーとの連携を意識するとさらに良くなるでしょう。'
        );
        
        RAISE NOTICE 'レビューテストデータを正常に挿入しました。';
    ELSE
        RAISE NOTICE 'applicationsテーブルに十分なデータが存在しません。レビューデータの挿入をスキップします。';
    END IF;
END
$$;

-- game_itemテーブルにダミーデータを挿入
INSERT INTO game_item (item_id, item_type, atk, hit_rate, crit_dmg, crit_rate) VALUES
('00000000-0000-0000-0000-000000000001', '武器', 120, 0.85, 60, 0.25),
('00000000-0000-0000-0000-000000000002', '武器', 200, 0.60, 90, 0.40),
('00000000-0000-0000-0000-000000000003', '支援アイテム', 30, 1.00, 0, 0.10),
('00000000-0000-0000-0000-000000000004', '支援アイテム', 0, 0.00, 50, 0.00);

-- game_progressテーブルにダミーデータを挿入
CREATE OR REPLACE FUNCTION update_progress_percentage()
RETURNS TRIGGER AS $$
DECLARE
    total_stages INTEGER := 3; -- 総ステージ数
BEGIN
    -- 小数→四捨五入して整数にして保存
    NEW.progress_percentage := ROUND((NEW.cleared_stages::NUMERIC / total_stages) * 100);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_update_progress_percentage
BEFORE INSERT OR UPDATE ON game_progress
FOR EACH ROW
EXECUTE FUNCTION update_progress_percentage();
INSERT INTO game_progress (user_id, cleared_stages, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 1,  '2025-06-10 12:30:00'),  -- → 33%
('22222222-2222-2222-2222-222222222222', 2, '2025-06-12 15:45:00'),  -- → 67%
('33333333-3333-3333-3333-333333333333', 3, '2025-06-14 09:00:00'),  -- → 100%
('44444444-4444-4444-4444-444444444444', 0,  '2025-06-01 08:00:00');  -- → 0%
SELECT * FROM game_progress;

-- game_logsテーブルにダミーデータを挿入
INSERT INTO game_logs (user_id, log_type_id, details, created_at) VALUES
-- ログタイプ: 1 = アイテム使用
('11111111-1111-1111-1111-111111111111', 1,
 '{"item_id": "item001", "item_name": "回復薬", "effect": "HP+50"}',
 '2025-06-18 14:30:00'),

-- ログタイプ: 2 = ステージクリア
('11111111-1111-1111-1111-111111111111', 2,
 '{"stage": 2, "result": "クリア"}',
 '2025-06-18 14:35:00'),

-- ログタイプ: 3 = ガチャ結果
('22222222-2222-2222-2222-222222222222', 3,
 '{"gacha_type": "プレミアム", "result": "レア剣", "rarity": "SR"}',
 '2025-06-18 16:00:00'),

-- ログタイプ: 4 = ログイン
('33333333-3333-3333-3333-333333333333', 4,
 '{"ip": "192.168.1.1", "device": "android"}',
 '2025-06-18 09:00:00');