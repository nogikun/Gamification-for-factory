-- テストテーブルの作成
CREATE TABLE test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- テストデータの挿入
INSERT INTO test (name, description) VALUES ('テスト項目1', 'これはテストデータです');
INSERT INTO test (name, description) VALUES ('テスト項目2', '別のテストデータです');