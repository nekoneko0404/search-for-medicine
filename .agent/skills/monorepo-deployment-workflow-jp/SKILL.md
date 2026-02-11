---
name: monorepo-deployment-workflow-jp
description: モノレポ構成（Vite + Next.js複数）のプロジェクトにおける、統一ビルドスクリプト（build.js）を使用したビルド手順と、Cloudflare Pagesへのデプロイ方法に関するガイドライン。
---

# モノレポ・デプロイメント・ワークフロー

## 概要
本プロジェクト（`search-for-medicine`）は、ルートの静的サイト（Vite）と、サブディレクトリに配置された複数のNext.jsアプリケーション（`drug-navigator`, `okuri_pakkun`）で構成されるモノレポです。
これらを統合して正しくデプロイするために、統一ビルドスクリプト `build.js` を使用します。

## ビルドプロセス

### 1. 統一ビルドコマンド
ルートディレクトリで以下のコマンドを実行します。

```bash
npm run build
```

このコマンドは内部で `node build.js` を呼び出し、以下の処理を順次実行します。

1.  **ルート（Vite）のビルド**: `vite build` を実行し、静的アセットを生成します。
2.  **Drug Navigator（Next.js）のビルド**: `drug-navigator` ディレクトリで `npm run build` （Static Export）を実行します。
3.  **Okuri Pakkun（Next.js）のビルド**: `okuri_pakkun/okusuri-pakkun-app` ディレクトリで `npm run build` （Static Export）を実行します。
4.  **アーティファクトの統合**: 各ビルド成果物を `dist` ディレクトリに集約します。
    - Next.jsアプリの出力（`out`）は、それぞれ `dist/drug-navigator`, `dist/okuri_pakkun` に正しく配置されます。

### 2. 出力ディレクトリ構造 (`dist/`)
ビルド成功後、`dist` ディレクトリは以下の構造になります。これがデプロイ用ディレクトリです。

```text
dist/
├── index.html              # ルートのトップページ
├── search.html             # 検索ページ
├── assets/                 # ルートの静的アセット (JS, CSS)
├── drug-navigator/         # Drug Navigator アプリ (Next.js Export)
│   ├── index.html
│   └── ...
└── okuri_pakkun/           # Okuri Pakkun アプリ (Next.js Export)
    ├── index.html
    └── ...
```

## デプロイ手順 (Cloudflare Pages)

Cloudflare Pages 等の静的ホスティングサービスにデプロイする際は、以下の設定を使用してください。

- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `dist`

### 環境分け戦略 (Branching Strategy)
テスト環境と本番環境を明確に区別するため、以下のブランチ戦略を適用します。

| 環境 | 対応ブランチ | デプロイタイプ | 用途 |
| :--- | :--- | :--- | :--- |
| **テスト環境** | `debug-deploy` | Preview (Cloudflare Pages) | 開発中の動作確認、ユーザーレビュー用 |
| **本番環境** | `main` | Production | 一般公開用 |

#### デプロイフロー
1.  **開発・修正**: 全ての変更は `debug-deploy` ブランチに対して行います。
2.  **テストデプロイ**: `debug-deploy` にプッシュすると、Cloudflare Pages が自動的にプレビュー環境（テスト環境）を構築します。
3.  **ユーザー確認**: プレビューURLにて動作確認を行います。
4.  **本番リリース（承認）**: ユーザーから「本番へ反映してください」等の明示的な指示があった場合のみ、`debug-deploy` を `main` にマージします。
    ```bash
    git checkout main
    git merge debug-deploy
    git push origin main
    ```
5.  **本番デプロイ**: `main` へのプッシュをトリガーに、本番環境へのデプロイが実行されます。

## トラブルシューティング

### ビルドスクリプトが失敗する場合
- 各サブディレクトリの `package.json` に `build` スクリプトが正しく定義されているか確認してください。
- `npm install` がルートおよび各サブディレクトリで実行されているか確認してください（`build.js` は自動で `npm install` を行いますが、依存関係のエラーがないか確認が必要です）。

### リンクが機能しない場合
- デプロイ後のサイトで `drug-navigator/` などにアクセスし、ソースコードのファイル一覧ではなく、アプリケーション画面が表示されるか確認してください。
- 表示されない場合は、`build.js` によるファイル移動（`copyDir`）が正しく行われていない可能性があります。`dist` ディレクトリの中身を確認してください。
