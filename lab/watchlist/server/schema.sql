-- stores: 店舗情報および通知設定
CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'standard'
    notify_channel TEXT DEFAULT 'none',    -- 'none', 'line', 'email'
    notify_endpoint TEXT,                 -- LINE ID or Email address
    notify_filter TEXT DEFAULT 'all',      -- 'all', 'restored_only'
    passcode TEXT NOT NULL,                -- 簡易認証用パスコード
    stripe_customer_id TEXT,               -- Stripe 顧客ID
    stripe_subscription_id TEXT,           -- Stripe サブスクリプションID
    subscription_status TEXT DEFAULT 'none', -- サブスクステータス
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- watch_items: 各店舗が監視している品目リスト
CREATE TABLE IF NOT EXISTS watch_items (
    store_id TEXT NOT NULL,
    yj_code TEXT NOT NULL,
    last_notified_status TEXT,             -- 最後に通知した際の出荷状況
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (store_id, yj_code),
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- market_status_snapshots: 市場全体の供給状況スナップショット
CREATE TABLE IF NOT EXISTS market_status_snapshots (
    yj_code TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_watch_items_yj ON watch_items(yj_code);

-- system_config: システム全体のメタ情報（クローラーのハッシュ等）
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
