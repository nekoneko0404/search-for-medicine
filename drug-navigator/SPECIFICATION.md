# 代替薬ナビゲーター (Drug Navigator) 仕様書

## 1. 概要
医薬品の供給不足（欠品・出荷調整）時に、薬剤師が迅速かつ安全に代替薬を選定するための支援ツール。
Googleの生成AI（Gemini 1.5 Flash）を活用し、患者の個別背景（小児、妊婦、授乳婦、腎機能低下）を考慮した代替薬の提案、および医師・患者への説明ロジックを自動生成する。

## 2. システム構成
### アーキテクチャ
*   **Framework:** Next.js 16+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **AI Model:** 
    *   Google Gemini 2.0 Flash Lite Preview 09-2025 (Default)
    *   OpenAI GPT-4o mini (User API Key)
    *   Google Gemini (User API Key)
*   **Infrastructure:** Vercel (Deployment)
*   **Data Source:** Google Sheets (CSV) を在庫・出荷状況データソースとして利用

### ディレクトリ構造
```
drug-navigator/
├── src/
│   ├── app/
│   │   ├── api/suggest/route.ts  # AIとの通信を行うAPIエンドポイント (Dynamic)
│   │   └── page.tsx              # メインUI（入力フォーム・結果表示）
│   └── lib/
│       ├── gemini.ts             # Google AI SDKの初期化設定
│       └── shipment-data.ts      # 出荷調整データの取得・正規化ロジック
└── .env.local                    # APIキー管理
```

## 3. 機能要件

### 3.1 ユーザー入力 (Input)
*   **薬剤名入力:** テキストフィールド（例：「アストミン錠10mg」）。YJコードによる検索も可能とする。
*   **患者背景選択 (トグルスイッチ):**
    1.  **小児 (Child):** 小児用量、安全性の考慮
    2.  **妊婦 (Pregnant):** 胎児への影響、催奇形性リスクの考慮
    3.  **授乳婦 (Lactating):** 母乳移行、乳児への影響の考慮
    4.  **腎機能低下 (Renal Impairment):** 腎排泄型薬剤の回避、減量規定の考慮
*   **詳細設定 (Advanced Settings):**
    *   **AIモデル選択:** システムデフォルト(無料)、OpenAI、Geminiから選択可能。
    *   **APIキー:** ユーザー自身のAPIキーを入力可能。

### 3.1.5 プロンプトコピー機能 (New)
*   ユーザーが入力した「薬剤名」「患者背景」に基づき、外部AI (ChatGPT, Gemini Web) で利用可能な最適化されたプロンプト文を生成し、クリップボードにコピーする機能を提供する。
*   ※このプロンプトには、サーバーサイドで管理されている在庫データは含まれない。

### 3.2 AI処理ロジック (Backend)
ユーザーの入力に基づき、在庫データ（CSV）と照合した後、以下のガイドライン・基準を参照してAIが推論を行う。

**代替薬選定の制約:** 提案する代替薬は、検索対象の薬剤と同一の有効成分を含まないものとする。

**参照・準拠する基準:**
1.  **添付文書** (Package Inserts)
2.  **国立成育医療研究センター**「授乳中に安全に使用できると思われる薬」
3.  **虎ノ門病院** 授乳中薬剤基準
4.  **FDA** 薬剤胎児危険度分類基準 (Pregnancy Categories)
5.  **オーストラリア基準** (Categorisation System for Prescribing Medicines in Pregnancy)
6.  **母乳とくすりハンドブック**
7.  **boku-clinic.com** 資料 (https://boku-clinic.com/pdf/d3.pdf)
8.  **日本腎臓病薬物療法学会**「腎機能低下時の薬剤投与量一覧」(https://www.jsnp.org/files/dosage_recommendations_38.pdf)

### 3.3 出力データ (Output)
AIはJSON形式で以下のデータを **15件** 提案する。

| 項目 | 内容 |
| :--- | :--- |
| **Drug Name** | 提案する代替薬の一般名または代表的な商品名 |
| **Mechanism** | 対象薬剤との作用機序の比較・特徴 |
| **Safety Assessment** | 指定された患者背景（授乳等）に対する安全性評価（例：「授乳：Safe (虎ノ門基準適合)」） |
| **Doctor Explanation** | 医師への疑義照会・変更提案のための専門的かつ礼儀正しい文章 |
| **Patient Explanation** | 患者への安心感を与える平易な説明文 |

## 4. UI/UX デザイン
*   **シングルページアプリケーション (SPA):** 画面遷移なしで完結。
*   **カード型レイアウト:** 提案された薬剤をカード形式で一覧表示。
*   **視覚的ステータス:** 安全性評価や説明文を色分け（青：医師用、緑：患者用）して視認性を向上。
*   **レスポンシブ対応:** PC、タブレット、スマートフォンで利用可能。
*   **エラーハンドリング:** API利用枠超過（429エラー）時には、明確なエラーメッセージを表示。
*   **免責事項:** AIの回答精度に関する注意書きを明記。

## 5. セキュリティ・プライバシー
*   **個人情報非保持:** 患者の氏名やIDは入力させない設計。あくまで「背景（属性）」のみを入力するため、個人情報保護法やHIPAAのリスクを最小化。
*   **APIキー管理:** 
    *   システムAPIキーはサーバーサイド環境変数 (`.env.local`) で管理。
    *   ユーザー入力APIキーは、リクエストごとにHTTPSヘッダー経由でサーバーに送信され、AI呼び出しにのみ使用される。データベース等への保存は行わない。
*   **脆弱性対応 (2025/12/23検証):**
    *   **Input Validation:** 入力値の型チェック、文字数制限（100文字）、サニタイズ（改行削除・エスケープ）を実装し、Prompt InjectionおよびDoS攻撃を防止。
    *   **Dependency Check:** `npm audit` にて依存関係の脆弱性が0件であることを確認済み。

## 6. 今後の拡張予定 (To-Do)
*   薬価比較機能の追加
*   履歴保存機能