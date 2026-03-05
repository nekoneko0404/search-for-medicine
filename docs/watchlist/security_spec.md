# セキュリティ仕様書：watchlist バックエンド認証・パスコード管理

> ファイル: `search-for-medicine/docs/watchlist/security_spec.md`  
> 最終更新: 2026-03-04

---

## 1. 概要

watchlistバックエンド（Cloudflare Workers + D1）における認証およびシークレット管理の仕様を定義する。

---

## 2. パスコード保存仕様（店舗認証）

### 2-1. アルゴリズム

| 項目 | 値 |
|---|---|
| KDF | PBKDF2 |
| ハッシュ関数 | SHA-256 |
| イテレーション数 | 100,000 回 |
| ソルト長 | 16 バイト（`crypto.getRandomValues` による乱数生成） |
| 保存形式 | `{saltHex}:{hashHex}` （文字列） |

### 2-2. 実装箇所

- **ハッシュ化:** `src/index.ts` `hashPasscode()` 関数
- **検証:** `src/index.ts` `verifyPasscode()` 関数（定数時間比較でタイミング攻撃を防止）
- **使用API:** Cloudflare Workers 組み込みの `crypto.subtle` (Web Crypto API)

### 2-3. ハッシュ化が適用されるエンドポイント

| エンドポイント | 動作 |
|---|---|
| `POST /api/stores/register` | 登録時にパスコードをハッシュ化してDBへ保存 |
| `GET /api/watch-items/get` | ハッシュと入力値を `verifyPasscode()` で比較 |
| `POST /api/watch-items/batch` | 同上 |
| `POST /api/notifications/test` | 同上 |

### 2-4. 移行期間の後方互換

既存の平文パスコードが残存する移行期間中、`verifyPasscode()` は`:` を含まない文字列を平文として扱う。
移行完了後（全店舗の再登録確認後）この分岐を削除すること。

```typescript
// 移行完了後に削除すべきコード（index.ts）
if (!stored.includes(':')) {
    return input === stored; // ← 削除対象
}
```

---

## 3. 管理者APIシークレット管理

### 3-1. Cloudflare Workers側

管理者API（`/api/admin/trigger-sync`）の認証には `env.ADMIN_PASSCODE` を使用する。  
この値は **Cloudflare Secrets** に保存し、ソースコードには一切記載しない。

```bash
# 一度だけ実行（ダッシュボードまたはCLIから設定）
wrangler secret put ADMIN_PASSCODE
```

### 3-2. GAS（sync_master.gs）側

`getAdminPasscode()` 関数を通じて、GASの**スクリプトプロパティ**から取得する。

設定手順：
1. GASエディタを開く
2. 「プロジェクトの設定」→「スクリプトプロパティ」
3. キー: `ADMIN_PASSCODE`、値: Cloudflareに設定したパスコードと同一の値を登録

---

## 4. その他のシークレット一覧

以下のシークレットはすべて `wrangler secret put` で設定し、ソースコード・`wrangler.toml` には記載しない。

| シークレット名 | 用途 |
|---|---|
| `ADMIN_PASSCODE` | GAS→Worker管理者API認証 |
| `LINE_ACCESS_TOKEN` | LINE Messaging API |
| `RESEND_API_KEY` | Resend メール送信API |
| `STRIPE_SECRET_KEY` | Stripe 決済処理 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook署名検証 |

---

## 5. エラーレスポンスポリシー

本番環境（Cloudflare Worker）のエラーレスポンスには **スタックトレースを含めない**。

- ✅ `console.error()` によるサーバーサイドログへの記録
- ❌ クライアントへの `stack` フィールドの返却（除去済み）

```typescript
// index.ts: 500エラー時のレスポンス
return new Response(JSON.stringify({
    success: false,
    error: "Internal Server Error" // 詳細は返さない
}), { status: 500 });
```
