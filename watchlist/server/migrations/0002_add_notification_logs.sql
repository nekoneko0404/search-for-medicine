-- 0002_add_notification_logs.sql
-- notification_logs: 通知送信履歴（ダッシュボード用）
CREATE TABLE IF NOT EXISTS notification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id TEXT NOT NULL,
    channel TEXT NOT NULL,       -- 'line', 'email', 'webhook'
    recipient_hash TEXT,         -- 通知先のハッシュ（個人特定防止しつつ統計可能に）
    title TEXT,
    content_summary TEXT,        -- 送信内容の要約（薬剤名など）
    status TEXT DEFAULT 'sent',  -- 'sent', 'failed'
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_store ON notification_logs(store_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON notification_logs(created_at);
