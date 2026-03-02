# PMDAアラート連携用 GASデプロイ手順書

PMDAのRSSフィードを取得し、フロントエンドにJSON形式で配信するためのGoogle Apps Script (GAS) の設定手順です。

## 1. GASプロジェクトの作成
1. [Google Apps Script](https://script.google.com/) にアクセスし、「新しいプロジェクト」を作成します。
2. プロジェクト名を「PMDA-RSS-Proxy」などに変更します。

## 2. コードの貼り付け
以下のコードを `コード.gs` に貼り付けて保存します。

```javascript
function doGet() {
  const rssUrls = [
    'https://www.pmda.go.jp/safety/info-services/rss/0001.xml', // 安全性情報
    'https://www.pmda.go.jp/safety/info-services/rss/0002.xml'  // 回収情報
  ];
  
  let allAlerts = [];
  
  rssUrls.forEach((url, index) => {
    try {
      const response = UrlFetchApp.fetch(url);
      const xml = response.getContentText();
      const document = XmlService.parse(xml);
      const root = document.getRootElement();
      const channel = root.getChild('channel');
      const items = channel.getChildren('item');
      
      items.forEach(item => {
        const title = item.getChildText('title');
        const link = item.getChildText('link');
        const pubDate = item.getChildText('pubDate');
        const description = item.getChildText('description');
        
        // 日付の簡易フォーマット (JST)
        const dateObj = new Date(pubDate);
        const formattedDate = Utilities.formatDate(dateObj, "JST", "yyyy/MM/dd");
        
        // 簡易的なカテゴリ判定
        let type = 'info';
        let typeLabel = '安全性情報';
        
        if (index === 1) {
          type = 'recall';
          typeLabel = '自主回収';
        } else if (title.includes('緊急') || title.includes('イエロー')) {
          type = 'emergency';
          typeLabel = '緊急安全性情報';
        }
        
        allAlerts.push({
          date: formattedDate,
          type: type,
          typeLabel: typeLabel,
          title: title,
          desc: description,
          url: link
        });
      });
    } catch (e) {
      console.error('Error fetching ' + url + ': ' + e);
    }
  });

  // 日付順にソート（新しい順）
  allAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return ContentService.createTextOutput(JSON.stringify({ alerts: allAlerts.slice(0, 10) }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. デプロイ設定
1. 右上の「デプロイ」>「新しいデプロイ」を選択します。
2. 種類の選択で「ウェブアプリ」を選びます。
3. 設定:
   - 次のユーザーとして実行: 「自分」
   - アクセスできるユーザー: 「全員」
4. 「デプロイ」ボタンを押し、承認を求められたら許可します。

## 4. フロントエンドへの反映
1. 発行された「ウェブアプリのURL」をコピーします。
2. `search-for-medicine/lab/pmda-alerts/alerts.js` の `GAS_API_URL` 定数にそのURLを貼り付け、再度デプロイしてください。
