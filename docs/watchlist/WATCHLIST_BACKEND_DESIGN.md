# 店舗採用薬 供給監視機能 バックエンド設計書 (B2Pharmacy)

## 1. 概要
本ドキュメントは、店舗採用薬（約2000品目）の供給状況監視および自動通知を実現するためのバックエンド（Cloudflare Workers / D1）の設計方針を定義します。

## 2. アーキテクチャ構成
Cloudflareのエッジコンピューティング環境を最大限に活用し、スケーラビリティと低コストを両立します。

- **Database**: Cloudflare D1 (SQLiteベースの分散データベース)
- **Execution**: Cloudflare Workers (TypeScript)
- **Scheduler**: Cloudflare Workers Cron Triggers (日次または定期的実行)
- **Notification**: LINE Messaging API / SendGrid (Email)

## 3. データベーススキーマ (Cloudflare D1)

### 3.1. `stores` テーブル
店舗情報および通知設定を管理します。
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | プライマリーキー |
| `name` | TEXT | 店舗名 |
| `plan_type` | TEXT | プラン区分 ('trial', 'standard') |
| `notify_channel` | TEXT | 通知先 ('line', 'email') |
| `notify_endpoint` | TEXT | LINEユーザーID または メールアドレス |
| `created_at` | TIMESTAMP | 登録日 |

### 3.2. `watch_items` テーブル
各店舗が監視している品目リスト。
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `store_id` | TEXT (UUID) | `stores.id` への外部キー |
| `yj_code` | TEXT | 監視対象のYJコード |
| `last_notified_status` | TEXT | 最後に通知した際のステータス |
| `updated_at` | TIMESTAMP | 更新日時 |

### 3.3. `market_status_snapshots` テーブル
市場全体の最新供給状況のキャッシュ。
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `yj_code` | TEXT | プライマリーキー |
| `status` | TEXT | 最新の出荷状況文言 |
| `last_updated` | TIMESTAMP | 厚労省/PMDAデータの更新日 |

## 4. 処理フロー (差分検知エンジン)

1. **データ取得**: Cron Trigger が起動し、外部ソース (CSV等) から最新の供給状況を取得。
2. **市場データ更新**: 取得したデータを `market_status_snapshots` と比較し、変化があったレコードを特定。
3. **マッチング**: `watch_items` を全件走査し、「変化があったYJコード」かつ「`last_notified_status` と現在の市場ステータスが異なる」ものを抽出。
4. **通知実行**: 該当する店舗（`stores`）に対し、指定の `notify_channel` 経由でメッセージを送信。
5. **完了処理**: `watch_items` の `last_notified_status` を最新状態に同期。

## 5. セキュリティとプライバシー
- **最小限のデータ保持**: 患者情報は一切保持せず、医薬品コードと通知先情報のみを管理します。
- **セキュリティ**: APIエンドポイントはシークレットキーまたは認証トークンで保護します。

## 6. マネタイズ（B2Pharmacyプラン）への対応
- **制限管理**:
    - **Freeプラン**: 登録可能数 20品目まで。
    - **Standardプラン**: 登録可能数 3,000品目まで (月額 5,000円)。
- **認証**: 各店舗固有のパスコードによる監視リスト管理。
