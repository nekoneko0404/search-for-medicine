
import fs from 'fs';
import path from 'path';

const csvPath = "C:\\Users\\kiyoshi\\Downloads\\医薬品供給データ（厚労省）_スプレッドシート.csv";
const calcJsPath = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');

// 1. Load PEDIATRIC_DRUGS from calc.js
const calcJsContent = fs.readFileSync(calcJsPath, 'utf-8');
// Extract object
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find drugs"); process.exit(1); }
// Evaluate safely-ish (by mocking)
const PEDIATRIC_DRUGS = eval(`[${match[1]}]`);


// 2. Read and Parse CSV
const buffer = fs.readFileSync(csvPath);
const decoder = new TextDecoder('shift_jis');
const csvContent = decoder.decode(buffer);
const lines = csvContent.split(/\r?\n/);

// Find indices
// Line 2 (index 1) has headers: ①薬剤区分,"②薬効分類...",③成分名...,⑤YJコード,"⑥品名
// Let's assume standard columns or find them.
// Based on previous cat:
// col 0: ①薬剤区分
// col 4: ⑤YJコード (but might be shifted if quotes contain commas)
// Simple CSV parser handles quotes
function parseCSVLine(line) {
    const res = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') { inQuote = !inQuote; }
        else if (c === ',' && !inQuote) { res.push(current); current = ''; }
        else { current += c; }
    }
    res.push(current);
    return res;
}

const headerLine = lines[1];
const headers = parseCSVLine(headerLine);
const yjIndex = headers.findIndex(h => h.includes('YJコード'));
const nameIndex = headers.findIndex(h => h.includes('品名'));

if (yjIndex === -1 || nameIndex === -1) {
    console.error("Could not find YJ or Name column in CSV");
    console.log("Headers:", headers);
    process.exit(1);
}

const csvDb = [];
for (let i = 2; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < nameIndex) continue;
    const yj = cols[yjIndex]?.trim();
    const name = cols[nameIndex]?.trim().replace(/^"|"$/g, ''); // remove quotes
    if (yj && name) {
        csvDb.push({ yj, name });
    }
}

console.log(`Loaded ${csvDb.length} rows from CSV.`);

// 3. Verify
console.log("\n--- Verification Report ---\n");
let warnings = 0;

PEDIATRIC_DRUGS.forEach(drug => {
    const entry = csvDb.find(d => d.yj === drug.yjCode);
    const brand = drug.brandName || drug.name.split('／')[0];

    if (entry) {
        // Check form mismatch
        // If drug name in calc.js implies powder (DS/細粒/散/シロップ)
        // But CSV name implies Tablet (錠/カプセル)
        const isPowderCalc = drug.name.match(/ドライシロップ|細粒|顆粒|散|シロップ|液|懸濁/);
        const isTabletCsv = entry.name.match(/錠|カプセル|ＯＤ|フィルム/);

        // Exceptions
        if (entry.name.includes('ドライシロップ')) isTabletCsv = false; // "錠" might be part of string? Unlikely but safe check.

        if (isPowderCalc && isTabletCsv && !entry.name.includes('細粒') && !entry.name.includes('散')) {
            console.log(`[WARNING] Form Mismatch?`);
            console.log(`  Drug: ${drug.name} (YJ: ${drug.yjCode})`);
            console.log(`  CSV Name: ${entry.name}`);
            warnings++;
        } else {
            // console.log(`[OK] ${drug.name} matches ${entry.name}`);
        }
    } else {
        console.log(`[MISSING] YJ Code not found in CSV: ${drug.yjCode}`);
        console.log(`  Drug: ${drug.name}`);
        // Search for candidates
        const candidates = csvDb.filter(d => d.name.includes(brand) && (d.name.includes('細粒') || d.name.includes('散') || d.name.includes('ドライシロップ') || d.name.includes('シロップ') || d.name.includes('顆粒')));
        if (candidates.length > 0) {
            console.log(`  Potential Candidates in CSV:`);
            candidates.forEach(c => console.log(`    - ${c.name} : ${c.yj}`));
        } else {
            console.log(`  No powder/granule candidates found for "${brand}"`);
        }
        warnings++;
    }
});

console.log(`\nVerification Complete. ${warnings} warnings found.`);
