/**
 * Google Drive上のマスタファイルをCloudflare Workersへ同期する
 * 
 * 設定手順:
 * 1. GASのエディタに貼り付ける
 * 2. 【重要】スクリプトプロパティを設定する:
 *    「プロジェクトの設定」→「スクリプトプロパティ」から以下を登録:
 *    - キー: ADMIN_PASSCODE  値: (Cloudflare Workerに設定したパスコード)
 * 3. 必要に応じて「トリガー」設定から、1日1回などの時間主導型実行を設定する
 */

const FILE_ID = '1iCxc-cclxlFnMhjwA8jyqEmV-F2Q4Hoa'; // 医薬品HOT コードマスター.TXT
const WORKER_URL = 'https://watchlist-backend.neko-neko-0404.workers.dev/api/admin/update-master';
const TRIGGER_URL = 'https://watchlist-backend.neko-neko-0404.workers.dev/api/admin/trigger-sync';

/**
 * スクリプトプロパティからADMIN_PASSCODEを安全に取得する
 * 未設定の場合は実行を中断し、設定手順を促す
 */
function getAdminPasscode() {
  const passcode = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSCODE');
  if (!passcode) {
    throw new Error(
      '【設定エラー】ADMIN_PASSCODEがスクリプトプロパティに設定されていません。\n' +
      'GASエディタの「プロジェクトの設定」→「スクリプトプロパティ」から設定してください。'
    );
  }
  return passcode;
}

function syncMedicineMaster() {
  const file = DriveApp.getFileById(FILE_ID);
  const lastUpdated = file.getLastUpdated().getTime().toString();
  const lastSyncDate = PropertiesService.getScriptProperties().getProperty('last_sync_date');

  // 更新がない場合は終了
  if (lastSyncDate === lastUpdated) {
    Logger.log('No updates detected since last sync.');
    return;
  }

  Logger.log('Updates detected. Starting sync...');

  // ファイル内容を取得 (UTF-8)
  const blob = file.getBlob();
  const csvText = blob.getDataAsString('UTF-8');

  // WorkerへPOST
  const adminPasscode = getAdminPasscode();
  const options = {
    method: 'post',
    contentType: 'text/plain', // importMasterData が文字列を受け取るため
    headers: {
      'X-Admin-Passcode': adminPasscode
    },
    payload: csvText,
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(WORKER_URL, options);
    const result = JSON.parse(response.getContentText());

    if (response.getResponseCode() === 200 && result.success) {
      Logger.log('Sync successful: ' + result.count + ' records imported.');
      // 同期成功時のみ最後の日時を更新
      PropertiesService.getScriptProperties().setProperty('last_sync_date', lastUpdated);
      
      // 即時同期（通知チェック）をトリガー
      triggerImmediateSync();
    } else {
      Logger.log('Sync failed: ' + (result.error || response.getContentText()));
    }
  } catch (e) {
  }
}

/**
 * Workerへ同期（通知チェック）をリクエストする
 */
function triggerImmediateSync() {
  const adminPasscode = getAdminPasscode();
  const options = {
    method: 'post',
    headers: {
      'X-Admin-Passcode': adminPasscode
    },
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(TRIGGER_URL, options);
    Logger.log('Immediate sync triggered: ' + response.getContentText());
  } catch (e) {
    Logger.log('Trigger failed: ' + e.toString());
  }
}
