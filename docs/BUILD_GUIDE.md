# ビルド・開発ガイド (Build & Development Guide)

このプロジェクトは **Vite** を使用して構築されています。
以下の手順に従って、開発環境のセットアップや本番用ビルトを行ってください。

## 1. 事前準備 (Prerequisites)

- **Node.js**: 最新の LTS 版（v18以上推奨）がインストールされている必要があります。
  - 確認コマンド: `node -v`

## 2. インストール (Installation)

プロジェクトの依存関係（ライブラリなど）をインストールします。最初の1回だけ実行します。

```bash
npm install
```

## 3. 開発用サーバーの起動 (Development)

ローカルで動作確認をしながら開発を行うためのコマンドです。
実行すると、ローカルサーバー（通常は `http://localhost:5173`）が立ち上がり、ファイルの変更を検知して自動的にリロードされます。

```bash
npm run dev
```

終了するには、ターミナルで `Ctrl + C` を押します。

## 4. 本番用ビルド (Production Build)

Webサーバーにアップロードするための最適化されたファイルを生成します。
`dist` フォルダに生成物が作成されます。

```bash
npm run build
```

- **出力先**: `./dist`
- この `dist` フォルダの中身を Webサーバー（Cloudflare Pages, Vercel, レンタルサーバーなど）にアップロードします。

## 5. ビルド結果のプレビュー (Preview)

`npm run build` で生成された `dist` フォルダの中身を使って、ローカルで疑似的な本番サーバーを立ち上げます。
ビルドが正しく行われたか確認するために使用します。

```bash
npm run preview
```

## コマンド一覧 (package.json scripts)

| コマンド | 説明 | 
| --- | --- |
| `npm run dev` | 開発サーバー起動 (Vite) |
| `npm run build` | 本番用ビルド (Vite Build) |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run test` | テスト実行 (Vitest) |
