
import fs from 'fs';
import path from 'path';

const filePath = "C:\\Users\\kiyoshi\\Downloads\\医薬品供給データ（厚労省）_スプレッドシート.csv";

try {
    const buffer = fs.readFileSync(filePath);
    const decoder = new TextDecoder('shift_jis');
    const content = decoder.decode(buffer);
    const lines = content.split(/\r?\n/);

    console.log("--- First 5 lines ---");
    for (let i = 0; i < 5; i++) {
        console.log(lines[i]);
    }
} catch (e) {
    console.error("Error reading CSV:", e);
}
