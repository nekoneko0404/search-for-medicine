# ビルド・開発ガイド (Build & Development Guide)

このプロジェクトは、**Vite** (ルートサイト) と複数の **Next.js** (サブアプリ) で構成されるモノレポです。
`npm workspaces` と統一ビルドスクリプト `build.js` を使用して管理されています。

## 1. 事前準備 (Prerequisites)

- **Node.js**: 最新の LTS 版（v18以上推奨）
- **Git**: ブランチ運用のため必須

## 2. インストール (Installation)

ルートディレクトリで一度だけ実行します。各ワークスペースの依存関係も自動的にインストールされます。

```bash
npm install
```

## 3. 開発用サーバーの起動 (Development)

全てのアプリケーション（Vite + Next.js）の開発サーバーを同時に起動します。

```bash
npm run dev
```

- **ルートサイト**: `http://localhost:5173`
- **Drug Navigator**: `/drug-navigator` 配下
- **Okusuri Pakkun**: `/okuri_pakkun` 配下
※Next.js 側はそれぞれ個別のポート（3001, 3002など）で起動しますが、`concurrently` により一括管理されます。

## 4. 本番用ビルドと統合 (Production Build)

全アプリをビルドし、成果物を1つの `dist` フォルダに統合します。

```bash
npm run build
```

このコマンドは `node build.js` を実行し、以下の処理を自動で行います：
1. **ルートのビルド**: Vite によるルートサイトのビルド（`dist/`）。
2. **サブアプリのビルド**: `workspaces` を利用した全 Next.js アプリのビルド（`out/`）。
3. **成果物の統合**: 各アプリのビルド成果物を `dist/` の適切なサブパスにコピー。

### 出力ディレクトリ構造 (`dist/`)
```text
dist/
├── index.html              # トップページ
├── assets/                 # 全体共通アセット
├── drug-navigator/         # Drug Navigator (Next.js)
└── okuri_pakkun/           # Okusuri Pakkun (Next.js)
```

## 5. デプロイフロー (Deployment)

Cloudflare Pages を利用したブランチベースのデプロイを採用しています。

| 環境 | ブランチ | デプロイ先 | 用途 |
| :--- | :--- | :--- | :--- |
| **テスト環境** | `debug-deploy` | Preview 環境 | 動作確認、レビュー用 |
| **本番環境** | `main` | Production 環境 | 一般公開用 |

### 本番マージの手順
1. `debug-deploy` でテスト完了後、ユーザーの承認を得る。
2. `main` ブランチに `debug-deploy` をマージ。
3. `main` をプッシュすると、自動的に本番ビルドとデプロイが実行される。

## コマンド一覧 (package.json scripts)

| コマンド | 説明 | 
| --- | --- |
| `npm run dev` | 全アプリの開発サーバーを一括起動 |
| `npm run build` | 全アプリのビルドと成果物の統合 (`build.js`) |
| `npm run test` | テストの実行 |
| `npm run preview` | ビルド成果物のローカルプレビュー |
| `npm run build:vite` | ルートサイト(Vite)のみのビルド |
