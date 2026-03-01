/**
 * Google Drive上のマスタファイルをCloudflare Workersへ同期する
 * 
 * 設定手順:
 * 1. GASのエディタに貼り付ける
 * 2. `WORKER_URL` と `ADMIN_PASSCODE` を書き換える
 * 3. 必要に応じて「トリガー」設定から、1日1回などの時間主導型実行を設定する
 */

const FILE_ID = '1iCxc-cclxlFnMhjwA8jyqEmV-F2Q4Hoa'; // 医薬品HOT コードマスター.TXT
const WORKER_URL = 'https://watchlist-backend.neko-neko-0404.workers.dev/api/admin/update-master';
const ADMIN_PASSCODE = 'ADMIN_SECRET_KEY'; // Worker側で判別するパスコード

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
  const options = {
    method: 'post',
    contentType: 'text/plain', // importMasterData が文字列を受け取るため
    headers: {
      'X-Admin-Passcode': ADMIN_PASSCODE
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
    } else {
      Logger.log('Sync failed: ' + (result.error || response.getContentText()));
    }
  } catch (e) {
    Logger.log('Network error: ' + e.toString());
  }
}
