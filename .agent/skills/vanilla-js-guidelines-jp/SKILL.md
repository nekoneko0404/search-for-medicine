---
name: vanilla-js-guidelines-jp
description: ビルドツールを使用しない（Vanilla JS / Non-Module）環境におけるJavaScript開発ガイドライン。グローバルスコープの管理とカスタム要素のスタイリングについて記述。
---

# Vanilla JS (Non-Module) 開発ガイドライン

## 背景
本プロジェクトの一部（`pollen-app` など）では、ビルドプロセスを経ずにブラウザで直接実行される「Vanilla JS」が採用されています。
特に `<script type="module">` を使用しない（標準スクリプト）場合、変数のスコープや依存関係の管理に特有の注意が必要です。

## ルール

### 1. グローバルスコープへの明示的な公開
モジュール（`type="module"`）ではないスクリプト間で変数を共有する場合、単に `const` や `let` で宣言するだけでは、読み込み順序やスコープによっては参照できない場合があります。
確実に共有するためには、`window` オブジェクトに明示的に代入してください。

```javascript
/* cities.js (データ定義ファイル) */
const CITIES = [ ... ];

// windowオブジェクトに公開することで、後続の script.js から確実に参照可能にする
window.CITIES = CITIES;
```

```javascript
/* script.js (利用側) */
// window.CITIES が定義されていることを前提に処理を行う
if (window.CITIES) {
    // ...
}
```

### 2. カスタム要素 (Web Components) の表示設定
`HTMLElement` を継承したカスタム要素を作成する場合、ブラウザのデフォルトスタイルでは `display: inline` として扱われることが多く、幅や高さ、余白（margin/padding）が正しく適用されない原因になります。
カスタム要素を定義する際は、ホスト要素自体に `display: block` （または適切な表示形式）を設定してください。

#### A. CSSで設定する場合 (推奨)
```css
/* style.css */
main-header {
    display: block;
}
```

#### B. コンポーネント内で設定する場合
Shadow DOM を使用しない場合でも、`connectedCallback` 内で自身のスタイルを設定することで自己完結させることができます。

```javascript
class MainHeader extends HTMLElement {
    connectedCallback() {
        // ホスト要素自身をブロック要素として振る舞わせる
        this.style.display = 'block';
        
        this.innerHTML = `...`;
    }
}
```

## トラブルシューティング
- **"Uncaught ReferenceError: X is not defined"**: 
    -変数が定義されているファイルが先に読み込まれているか確認してください。
    - 定義側で `window.X = X;` としているか確認してください。
- **レイアウト崩れ（高さ 0 や 重なり）**:
    - カスタム要素に `display: block` が当たっているか、開発者ツールで確認してください。
