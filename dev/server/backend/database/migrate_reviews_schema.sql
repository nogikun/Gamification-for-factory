-- reviews テーブルを新しいスキーマに移行
-- application_id -> (reviewee_id, event_id) への変更

BEGIN;

-- 1. まず新しいカラムを追加
ALTER TABLE reviews 
ADD COLUMN reviewee_id UUID,
ADD COLUMN event_id UUID;

-- 2. 既存データから新しいカラムに値を移行
-- application_id から applications テーブルを参照して reviewee_id と event_id を取得
UPDATE reviews 
SET 
    reviewee_id = a.user_id,
    event_id = a.event_id
FROM applications a 
WHERE reviews.application_id = a.application_id;

-- 3. 新しいカラムにNOT NULL制約を追加
ALTER TABLE reviews 
ALTER COLUMN reviewee_id SET NOT NULL,
ALTER COLUMN event_id SET NOT NULL;

-- 4. 外部キー制約を追加
ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_event_id 
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_reviews_reviewee_id 
    FOREIGN KEY (reviewee_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_reviews_reviewer_id 
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- 5. インデックスを追加（パフォーマンス最適化）
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_event_id ON reviews(event_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_reviewee_event ON reviews(reviewee_id, event_id);

-- 6. 古いカラムと制約を削除
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_application_id_fkey;
ALTER TABLE reviews DROP COLUMN application_id;

COMMIT;
