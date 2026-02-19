
import fs from 'fs';
import { TextDecoder } from 'util';

const filePath = String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\ファイルリスト.csv`;

try {
    const buffer = fs.readFileSync(filePath);
    const decoder = new TextDecoder('shift-jis');
    const text = decoder.decode(buffer);
    const lines = text.split(/\r?\n/);

    // Parse header (assuming comma separated, quoted)
    // Simple split might break if commas inside quotes, but headers usually don't have commas.
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.replace(/^"|"$/g, '').trim());

    console.log("Headers:", headers);

    const yjIndex = headers.indexOf('販売名コード');
    const filenameIndex = headers.indexOf('ファイル名');
    const pathIndex = headers.indexOf('パス'); // Sometimes 'URL' or 'Path'

    console.log(`Indices: YJ=${yjIndex}, Filename=${filenameIndex}, Path=${pathIndex}`);

    // Preview first few rows
    for (let i = 1; i < 5; i++) {
        if (i < lines.length) {
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            console.log(`Row ${i}: YJ=${cols[yjIndex]}, Path=${cols[pathIndex] || cols[filenameIndex]}`);
        }
    }

} catch (err) {
    console.error("Error:", err);
}
