-- レビュー関連テーブルのテストデータ挿入

-- 直接IDを指定してレビューリクエストとレビューのテストデータを挿入
-- 最初のapplication_idを取得
\set app_id1 '\'2e031414-9964-4626-8108-d356d8e4d8f4\''
-- 2番目のapplication_idを取得
\set app_id2 '\'f39137f0-2c47-46e1-a160-a7dfdd576206\''
-- 企業ユーザーID
\set company_id1 '\'c0000001-0000-0000-0000-000000000001\''
\set company_id2 '\'c0000002-0000-0000-0000-000000000002\''

-- review_requestsテーブルにテストデータを挿入
INSERT INTO review_requests (
    application_id,
    requested_by,
    requested_at,
    request_message,
    status
) VALUES
(
    :app_id1,
    :company_id1,
    NOW() - INTERVAL '2 days',
    'イベント参加後のフィードバックをお願いします。',
    'REQUESTED'
),
(
    :app_id2,
    :company_id1,
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
    :app_id1,
    :company_id1,
    4.5,
    '積極的に参加され、良い質問をされていました。次回のイベントにもぜひ参加してください。'
),
(
    :app_id2,
    :company_id2,
    3.8,
    '基本的な知識は十分にありますが、もう少し事前準備が必要です。'
);
