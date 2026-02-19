
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';

const filePath = String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\ファイルリスト.csv`;

try {
    const buffer = fs.readFileSync(filePath);
    const decoder = new TextDecoder('shift-jis');
    const text = decoder.decode(buffer);
    const lines = text.split(/\r?\n/).slice(0, 10);
    console.log("File List Preview:");
    lines.forEach((line, i) => console.log(`${i}: ${line}`));
} catch (err) {
    console.error("Error reading file:", err);
}
