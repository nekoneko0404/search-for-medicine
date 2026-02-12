---
name: monorepo-deployment-workflow-jp
description: モノレポ構成（Vite + Next.js複数）のプロジェクトにおける、統一ビルドスクリプト（build.js）を使用したビルド手順と、Cloudflare Pagesへのデプロイ方法に関するガイドライン。
---

# モノレポ・デプロイメント・ワークフロー

## 概要
本プロジェクト（`search-for-medicine`）は、ルートの静的サイト（Vite）と、サブディレクトリに配置された複数のNext.jsアプリケーションで構成されるモノレポです。
npm workspaces と統一ビルドスクリプト `build.js` を使用してデプロイします。

### プロジェクト構成

| アプリ | 種別 | ディレクトリ | basePath | 出力先 |
| :--- | :--- | :--- | :--- | :--- |
| ルートサイト | Vite (静的HTML) | `/` | なし | `dist/` |
| Drug Navigator | Next.js (Static Export) | `drug-navigator/` | `/drug-navigator` | `dist/drug-navigator/` |
| Okusuri Pakkun | Next.js (Static Export) | `okuri_pakkun/okusuri-pakkun-app/` | `/okuri_pakkun` | `dist/okuri_pakkun/` |
| Recipe Worker | Cloudflare Worker | `recipe-worker/` | — | 別途Workers にデプロイ |

### npm workspaces 構成
ルートの `package.json` で以下の workspaces を定義:
```json
"workspaces": [
  "drug-navigator",
  "okuri_pakkun/okusuri-pakkun-app",
  "recipe-worker"
]
```

## ビルドプロセス

### 1. 統一ビルドコマンド
ルートディレクトリで以下のコマンドを実行します。

```bash
npm run build
```

このコマンドは内部で `node build.js` を呼び出し、以下の処理を順次実行します。

1.  **[1/3] ルート（Vite）のビルド**: `npm run build:vite` を実行し、静的アセットを `dist/` に生成。
2.  **[2/3] サブアプリ（Next.js）のビルド**: `npm run build --workspaces --if-present` でワークスペース内の全アプリを一括ビルド。
3.  **[3/3] アーティファクトの統合**: 各Next.jsアプリの `out/` ディレクトリを `dist/` 配下にコピー。
    - `drug-navigator/out/` → `dist/drug-navigator/`
    - `okuri_pakkun/okusuri-pakkun-app/out/` → `dist/okuri_pakkun/`

### 2. 開発サーバー起動
全アプリの開発サーバーを一括起動:
```bash
npm run dev
```
内部で `concurrently` を使い、Vite + 各Next.jsの開発サーバーを同時起動します。

### 3. 出力ディレクトリ構造 (`dist/`)
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

## Next.js アプリ固有の設定

### Static Export 設定
両方の Next.js アプリは `output: 'export'` を使用して静的HTMLを出力します。

**drug-navigator/next.config.ts:**
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/drug-navigator',
  images: { unoptimized: true },
};
```

**okuri_pakkun/okusuri-pakkun-app/next.config.ts:**
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/okuri_pakkun',
};
```

> [!IMPORTANT]
> `basePath` はデプロイ先のURLパスと一致させる必要があります。変更すると全てのリンクやアセット参照が壊れます。

### TypeScript カスタム要素の型定義（重要）

両アプリは共通のWeb Components（`<main-header>`, `<main-footer>`）を使用しています。
Next.js 16 + `jsx: "react-jsx"` 環境では、**`React.JSX.IntrinsicElements` をモジュール拡張で定義する**必要があります。

**正しい方法** (`src/types/declarations.d.ts`):
```typescript
import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'main-header': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>, HTMLElement
      > & {
        'base-dir'?: string;
        'active-page'?: string;
      };
      'main-footer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>, HTMLElement
      > & {
        'base-dir'?: string;
      };
    }
  }
}
```

> [!CAUTION]
> **以下の方法では動作しません（Next.js 16）:**
> - `declare namespace JSX` — グローバルJSX名前空間を拡張するが、Next.js は `React.JSX` を参照するため無効。
> - `declare global { namespace JSX }` — `.d.ts` ファイルでは `export {}` なしだとスクリプト扱いとなり、`declare global` が不正。
> - 型を `any` にするだけ — ローカルでは通ることがあるが、CI環境（Cloudflare Pages等）では失敗する場合がある。

### 共通アセットの配置
共通ヘッダー/フッター用の CSS と画像は、各アプリの `public/` に配置:
- `public/css/v2-shared.css` — 共通スタイル
- `public/images/KusuriCompass.png` — ロゴ画像
- `public/js/components/MainHeader.js`, `MainFooter.js` — Web Components

## デプロイ手順 (Cloudflare Pages)

Cloudflare Pages の設定:
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `dist`

### 環境分け戦略 (Branching Strategy)

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

### TypeScript ビルドエラー: `Property 'main-header' does not exist on type 'JSX.IntrinsicElements'`
- **原因**: カスタム要素の型が `React.JSX.IntrinsicElements` に正しく登録されていない。
- **対処**: 上記「[TypeScript カスタム要素の型定義](#typescript-カスタム要素の型定義重要)」セクションの正しい方法に従い、`declare module 'react'` を使用する。
- **確認**: ローカルで `npx next build` を実行し、TypeScriptエラーが出ないことを確認してからプッシュする。

### ビルドスクリプトが失敗する場合
- 各サブディレクトリの `package.json` に `build` スクリプトが正しく定義されているか確認。
- `npm install` がルートで実行されているか確認（workspaces により子も自動インストールされる）。
- CI環境で `npm ci` が使われている場合、`package-lock.json` が最新か確認。

### リンクが機能しない場合
- デプロイ後のサイトで `drug-navigator/` などにアクセスし、アプリケーション画面が表示されるか確認。
- 表示されない場合は、`build.js` によるファイルコピー（`copyDir`）が正しく行われていない可能性がある。`dist` ディレクトリの中身を確認。
- `basePath` が `next.config.ts` とデプロイ先URLで一致しているか確認。

### npm workspaces 関連のエラー
- `npm run build --workspaces --if-present` が失敗する場合、特定のワークスペースだけビルドして問題を切り分ける:
  ```bash
  npm run build --workspace=drug-navigator
  npm run build --workspace=okuri_pakkun/okusuri-pakkun-app
  ```
