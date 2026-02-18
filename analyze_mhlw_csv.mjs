
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';

const CSV_PATH = String.raw`C:\Users\kiyoshi\Downloads\医薬品供給データ（厚労省）_スプレッドシート.csv`;

try {
    const buffer = fs.readFileSync(CSV_PATH);
    const decoder = new TextDecoder('shift-jis');
    const text = decoder.decode(buffer);

    const lines = text.split(/\r?\n/);
    console.log(`Total Lines: ${lines.length}`);

    // Header
    const headers = lines[0].split(',');
    console.log("--- Headers ---");
    headers.forEach((h, i) => console.log(`[${i}] ${h}`));

    // First data row
    if (lines.length > 1) {
        const row = lines[1].split(',');
        console.log("--- Row 1 ---");
        row.forEach((c, i) => console.log(`[${i}] ${c}`));
    }
} catch (e) {
    console.error("Error reading CSV:", e);
}
