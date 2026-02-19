
import fs from 'fs';
import { TextDecoder } from 'util';

const filePath = String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\ファイルリスト.csv`;

try {
    const buffer = fs.readFileSync(filePath);
    // Try converting first 1000 bytes to hex to see BOM or weird chars
    console.log("First 100 bytes (Hex):");
    console.log(buffer.slice(0, 100).toString('hex'));

    const decoder = new TextDecoder('shift-jis');
    const text = decoder.decode(buffer);
    const lines = text.split(/\r?\n/);

    console.log("\n--- Line 0 (Header) ---");
    console.log(lines[0]);
    console.log("Chars:", lines[0].split('').map(c => c.charCodeAt(0)));

    console.log("\n--- Line 1 ---");
    console.log(lines[1]);

    // Attempt standard split
    const headers = lines[0].split(',');
    console.log("\nHeaders split by comma:");
    headers.forEach((h, i) => console.log(`${i}: [${h}]`));

} catch (err) {
    console.error(err);
}
