/**
 * Google Drive Trigger for GitHub Actions
 *
 * このスクリプトは、指定されたGoogle Driveファイルまたはフォルダの更新を検知し、
 * GitHubのrepository_dispatchイベントをトリガーします。
 *
 * 設定方法:
 * 1. Google Driveで新規スクリプトを作成 (拡張機能 > Apps Script)
 * 2. 下記の定数を設定 (GITHUB_TOKEN, REPO_OWNER, REPO_NAME, EVENT_TYPE)
 * 3. `TARGET_FILE_ID` に監視したいファイルのIDを設定
 * 4. トリガーを設定 (時計マーク > トリガーを追加 > 時間主導型 > 分ベース > 15分おきなど)
 *    ※リアルタイムではないですが、Driveの "変更" トリガーはGAS単体ではファイル特定が難しいため、
 *      定期実行で最終更新日時をチェックする方法が確実です。
 *      あるいは、ファイルがスプレッドシートなら「編集時」トリガーが使えます。
 *      今回は「定期チェック」方式のコードを記載します。
 *
 * 注意: GitHub Secretsで以下の環境変数を使用します。
 * - GITHUB_TOKEN: Actions起動用
 */

// --- 設定項目 ---
// 実際にはスクリプトプロパティなどで管理することをお勧めします
const GITHUB_TOKEN = 'YOUR_GITHUB_PAT'; // GitHub Personal Access Token (repo権限)
const REPO_OWNER = 'kiyoshi-user'; // ユーザー名 (確認してください)
const REPO_NAME = 'search-for-medicine'; // リポジトリ名
const EVENT_TYPE = 'drive_updated'; // GitHub Action側で受けるイベント名
const TARGET_FILE_ID = 'YOUR_FILE_ID'; // 監視するGoogle DriveファイルのID

// --- プロパティサービスを使って前回の更新日時を保存 ---
const PROPS = PropertiesService.getScriptProperties();

function checkFileUpdate() {
  const file = DriveApp.getFileById(TARGET_FILE_ID);
  const lastUpdated = file.getLastUpdated().getTime();
  const savedLastUpdated = parseFloat(PROPS.getProperty('lastUpdated') || '0');

  // 更新があった場合のみ実行
  if (lastUpdated > savedLastUpdated) {
    Logger.log('File updated. Triggering GitHub Action...');
    
    if (triggerGitHubAction()) {
      // 成功したら更新日時を保存
      PROPS.setProperty('lastUpdated', lastUpdated.toString());
      Logger.log('Successfully triggered and updated timestamp.');
    }
  } else {
    Logger.log('No updates found.');
  }
}

function triggerGitHubAction() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;
  
  const payload = {
    event_type: EVENT_TYPE,
    client_payload: {
      message: "Update detected in Google Drive",
      timestamp: new Date().toISOString()
    }
  };

  const options = {
    'method': 'post',
    'headers': {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      Logger.log('GitHub API request successful.');
      return true;
    } else {
      Logger.log(`Error: ${code} - ${response.getContentText()}`);
      return false;
    }
  } catch (e) {
    Logger.log(`Exception: ${e.message}`);
    return false;
  }
}
