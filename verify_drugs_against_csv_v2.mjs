
import fs from 'fs';
import path from 'path';

const csvPath = "C:\\Users\\kiyoshi\\Downloads\\医薬品供給データ（厚労省）_スプレッドシート.csv";
const calcJsPath = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');

// 1. Load PEDIATRIC_DRUGS from calc.js
const calcJsContent = fs.readFileSync(calcJsPath, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find drugs"); process.exit(1); }
// Mock minimal environment for eval
const PHARMA_CLASSIFICATION_MAP = {};
const PEDIATRIC_DRUGS = eval(`[${match[1]}]`);

// 2. Read and Parse CSV with Multiline Support
const buffer = fs.readFileSync(csvPath);
const decoder = new TextDecoder('shift_jis');
const csvContent = decoder.decode(buffer);

function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];

        if (inQuote) {
            if (c === '"') {
                if (next === '"') {
                    currentCell += '"'; // Escaped quote
                    i++;
                } else {
                    inQuote = false; // End of quote
                }
            } else {
                currentCell += c;
            }
        } else {
            if (c === '"') {
                inQuote = true;
            } else if (c === ',') {
                currentRow.push(currentCell);
                currentCell = '';
            } else if (c === '\r') {
                if (next === '\n') i++; // Skip \n
                currentRow.push(currentCell);
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
            } else if (c === '\n') {
                currentRow.push(currentCell);
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
            } else {
                currentCell += c;
            }
        }
    }
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
    }
    return rows;
}

console.log("Parsing CSV...");
const allRows = parseCSV(csvContent);
console.log(`Parsed ${allRows.length} rows.`);

// Find header row (it might not be the first row)
// Header should contain "YJコード" and "品名"
let headerRowIndex = -1;
let yjIndex = -1;
let nameIndex = -1;

for (let i = 0; i < Math.min(10, allRows.length); i++) {
    const row = allRows[i];
    const yj = row.findIndex(c => c.includes('YJコード'));
    const name = row.findIndex(c => c.includes('品名'));
    if (yj !== -1 && name !== -1) {
        headerRowIndex = i;
        yjIndex = yj;
        nameIndex = name;
        break;
    }
}

if (headerRowIndex === -1) {
    console.error("Could not find YJ/Name headers in first 10 rows.");
    process.exit(1);
}

console.log(`Header found at row ${headerRowIndex}. YJ index: ${yjIndex}, Name index: ${nameIndex}`);

const csvDb = [];
for (let i = headerRowIndex + 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (row.length <= nameIndex) continue;

    const yj = row[yjIndex]?.trim();
    const name = row[nameIndex]?.trim();

    if (yj && name) {
        csvDb.push({ yj, name });
    }
}
console.log(`Loaded ${csvDb.length} valid entries.`);


// 3. Verify
console.log("\n--- Verification Report ---\n");
let warnings = 0;
let missing = 0;

PEDIATRIC_DRUGS.forEach(drug => {
    const entry = csvDb.find(d => d.yj === drug.yjCode);

    // Brand name extraction: "Name / Generic" -> "Name"
    let brand = drug.name.split('／')[0];
    if (drug.brandName) brand = drug.brandName;

    // Remove "顆粒" etc from brand for fuzzy matching
    const searchBrand = brand.replace(/顆粒|細粒|ドライシロップ|散|シロップ|液|注|軟膏|クリーム|錠|カプセル/g, '').trim();

    if (entry) {
        // Check form mismatch
        const isPowderCalc = drug.name.match(/ドライシロップ|細粒|顆粒|散|シロップ|液|懸濁/);
        const isTabletCsv = entry.name.match(/錠|カプセル|ＯＤ|フィルム/);

        // Exclude false positives for TabletCsv
        // if name contains "ドライシロップ" it is NOT a tablet even if it says "錠" (unlikely but safe)
        const reallyTablet = isTabletCsv && !entry.name.match(/ドライシロップ|細粒|顆粒|散|シロップ|液|懸濁/);

        if (isPowderCalc && reallyTablet) {
            console.log(`[WARNING] Form Mismatch?`);
            console.log(`  Calc.js: ${drug.name} (YJ: ${drug.yjCode})`);
            console.log(`  CSV Data: ${entry.name}`);
            warnings++;
        }
    } else {
        console.log(`[MISSING] YJ Code in Calc.js NOT found in CSV: ${drug.yjCode}`);
        console.log(`  Calc.js Name: ${drug.name}`);

        // Fuzzy search in CSV
        const candidates = csvDb.filter(d =>
            d.name.includes(searchBrand) &&
            (d.name.match(/ドライシロップ|細粒|顆粒|散|シロップ|液|懸濁/))
        );

        if (candidates.length > 0) {
            console.log(`  Potential Candidates in CSV (Powder/Granule/Liquid):`);
            // Limit to top 5
            candidates.slice(0, 5).forEach(c => console.log(`    - ${c.name} : ${c.yj}`));
        } else {
            console.log(`  No powder/granule candidates found for "${searchBrand}"`);
            // Try searching just by name without form restriction?
            const anyCandidates = csvDb.filter(d => d.name.includes(searchBrand));
            if (anyCandidates.length > 0) {
                console.log(`  Other form candidates:`);
                anyCandidates.slice(0, 3).forEach(c => console.log(`    - ${c.name} : ${c.yj}`));
            }
        }
        missing++;
    }
});

console.log(`\nVerification Complete. Missing: ${missing}, Warnings: ${warnings}`);
