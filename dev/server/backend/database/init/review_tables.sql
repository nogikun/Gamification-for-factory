--------------------------------------------------
--   TABLE NAME: review_requests
-- DESCRIPTIONS: イベント応募に対するレビューリクエストを管理するテーブル
--------------------------------------------------
CREATE TYPE review_status_enum AS ENUM ('REQUESTED', 'COMPLETED');
CREATE TABLE review_requests (
    review_request_id SERIAL PRIMARY KEY,                        -- レビューリクエストID（主キー）
    application_id UUID NOT NULL,                                -- 応募ID（外部キー）
    requested_by UUID NOT NULL,                                  -- リクエスト者ID
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,            -- リクエスト日時
    request_message TEXT,                                        -- リクエストメッセージ
    status review_status_enum NOT NULL DEFAULT 'REQUESTED',         -- ステータス
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE -- * 応募が削除された場合、関連するレビューリクエストも削除
);

--------------------------------------------------
--   TABLE NAME: reviews
-- DESCRIPTIONS: イベント応募に対するレビューを管理するテーブル
--------------------------------------------------
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,                                -- レビューID（主キー）
    application_id UUID NOT NULL,                                -- 応募ID（外部キー）
    reviewer_id UUID NOT NULL,                                   -- レビュアーID
    rating FLOAT NOT NULL,                                       -- 評価（星など）
    comment TEXT,                                                -- コメント
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE -- * 応募が削除された場合、関連するレビューも削除
);
