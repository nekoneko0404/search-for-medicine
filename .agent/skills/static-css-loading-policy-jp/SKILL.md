---
name: static-css-loading-policy-jp
description: 静的HTMLプロジェクトにおけるCSSとTailwindの読み込み方針。JSによるCSS importを避け、ブラウザが直接解釈可能な方法を選択するためのガイドライン。
---

# 静的WebアプリにおけるCSS読み込みポリシー

## 背景
Cloudflare Pages 等でホストされる静的HTMLプロジェクトにおいて、JavaScriptファイル内での `import './style.css';` はブラウザで直接動作しません（Viteなどのビルドツールが実行時に解決することを前提とした構文です）。
本プロジェクトでは、ビルドステップの有無に関わらず確実にスタイルを適用するため、以下のルールを遵守します。

## ルール

### 1. JSでのCSS import禁止
JavaScriptファイル内でのCSS読み込み（`import '...css'`）は行わないでください。
ブラウザはこれをJSとして解釈しようとし、シンタックスエラー（Unexpected token）を引き起こすか、単に無視されます。

### 2. HTMLでの直接読み込み
CSSは必ず HTML の `<head>` 内で `<link>` タグを使用して読み込んでください。

```html
<!-- 正しい例 -->
<link rel="stylesheet" href="style.css">
```

### 3. Tailwind CSS の適用
本プロジェクトで Tailwind CSS のクラスを使用する場合、以下のいずれかの方法を選択してください。

#### A. Tailwind Play CDN (推奨)
ビルド設定が不明確な場合や、手軽に確実に適用したい場合は、Tailwind Play CDN を使用してください。

```html
<script src="https://cdn.tailwindcss.com"></script>
```

#### B. ビルド済みCSSの読み込み
`dist/output.css` など、ビルド済みのCSSファイルが存在する場合は、それを `<link>` で指定してください。

### 4. 特定のデザイン上書き (!important)
グローバルCSS（`css/style.css` 等）が `body` などの広いセレクタに対して強力なスタイル（背景のグラデーションなど）を設定している場合、各サブアプリのスタイルが適用されないことがあります。
その場合は、サブアプリ側の CSS で `!important` を使用して強制的に上書きしてください。

```css
/* anonymous-bbs/style.css の例 */
body {
    background: var(--bg-color) !important;
    background-image: none !important;
}
```

## 修正後のチェックリスト
- [ ] `script.js` 等から CSS の `import` 文が削除されているか。
- [ ] `index.html` に必要な Tailwind CDN または `<link>` タグが含まれているか。
- [ ] Google Fonts が正しく読み込まれているか（`display=swap` 推奨）。
