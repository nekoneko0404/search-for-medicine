
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';

const CSV_PATH = String.raw`C:\Users\kiyoshi\Downloads\医薬品供給データ（厚労省）_スプレッドシート.csv`;

console.log("Reading CSV...");
const buffer = fs.readFileSync(CSV_PATH);
const decoder = new TextDecoder('shift-jis');
const csvText = decoder.decode(buffer);
const lines = csvText.split(/\r?\n/);

const drugName = "メイアクト"; // Search target
const yjCode = "6132015C1103"; // calc.js YJ

let foundYJ = false;
let foundNameMatches = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (!cols || cols.length < 2) continue;

    const yj = cols[0].replace(/^,/, '').replace(/^"|"$/g, '').trim();
    const name = cols[1].replace(/^,/, '').replace(/^"|"$/g, '').trim();

    if (yj === yjCode) foundYJ = true;
    if (name.includes(drugName)) {
        foundNameMatches.push({ yj, name });
    }
}

console.log(`YJ ${yjCode} Found in CSV: ${foundYJ}`);
console.log(`Name Matches for '${drugName}':`);
foundNameMatches.forEach(m => console.log(`- [${m.yj}] ${m.name}`));
