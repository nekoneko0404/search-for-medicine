
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const CSV_PATH = String.raw`C:\Users\kiyoshi\Downloads\医薬品供給データ（厚労省）_スプレッドシート.csv`;

// 1. Read calc.js
let calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find PEDIATRIC_DRUGS"); process.exit(1); }

let PEDIATRIC_DRUGS;
try {
    PEDIATRIC_DRUGS = eval(`[${match[1]}]`);
} catch (e) {
    console.error("Eval Error:", e);
    process.exit(1);
}

// 2. Read CSV (Shift-JIS)
console.log("Reading CSV...");
const buffer = fs.readFileSync(CSV_PATH);
const decoder = new TextDecoder('shift-jis');
const csvText = decoder.decode(buffer);
const lines = csvText.split(/\r?\n/);

// Parse CSV into a list of { yj, name }
const csvDrugs = [];
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Simple split by comma (assuming no commas in YJ or Name for now, or handle quotes)
    // The header analysis showed quotes might be involved.
    // Let's use a slightly better regex split or just simple split if fields are simple.
    // Column 0 is YJ, Column 1 is Name.
    // Excel CSVs usually quote fields with commas.

    // Quick parse: match comma not inside quotes
    const cols = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (!cols || cols.length < 2) continue;

    // Clean up cols (remove leading comma match, remove quotes)
    const yjRaw = cols[0].replace(/^,/, '').replace(/^"|"$/g, '').trim();
    const nameRaw = cols[1].replace(/^,/, '').replace(/^"|"$/g, '').trim();

    if (yjRaw && nameRaw) {
        csvDrugs.push({ yj: yjRaw, name: nameRaw });
    }
}
console.log(`Loaded ${csvDrugs.length} drugs from CSV.`);

// 3. Match and Update
let updatedCount = 0;
const log = [];

PEDIATRIC_DRUGS.forEach(drug => {
    try {
        const originalYJ = drug.yjCode;
        if (!originalYJ) {
            console.warn(`Skipping ${drug.name}: No YJ Code`);
            return;
        }
        const searchName = drug.brandName || (drug.name ? drug.name.split('／')[0] : "");

        // Strategy 1: Exact YJ Match
        const exactYJMatch = csvDrugs.find(d => d.yj === originalYJ);

        // Strategy 2: Exact Name Match
        const exactNameMatch = csvDrugs.find(d => d.name === searchName);

        // Strategy 3: Fuzzy Name Match
        const startsWithMatch = csvDrugs.filter(d => d.name.startsWith(searchName));
        startsWithMatch.sort((a, b) => a.name.length - b.name.length);
        const bestNameMatch = startsWithMatch.length > 0 ? startsWithMatch[0] : null;

        let newYJ = null;

        if (exactYJMatch) {
            if (exactNameMatch && exactNameMatch.yj !== originalYJ) {
                newYJ = exactNameMatch.yj;
            } else {
                newYJ = originalYJ;
            }
        } else {
            if (exactNameMatch) {
                newYJ = exactNameMatch.yj;
            } else if (bestNameMatch) {
                newYJ = bestNameMatch.yj;
            }
        }

        if (!newYJ) {
            newYJ = originalYJ;
        }

        // Update URL to rdSearch/02
        // Ensure newYJ is valid string
        const newUrl = `https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${newYJ}?user=1`;

        if (drug.yjCode !== newYJ || drug.piUrl !== newUrl) {
            log.push(`Update ${drug.name}: YJ ${drug.yjCode} -> ${newYJ} | URL Updated`);
            drug.yjCode = newYJ;
            drug.piUrl = newUrl;
            updatedCount++;
        }
    } catch (err) {
        console.error(`Error processing drug ${drug.name}:`, err);
    }
});

console.log(`Updated ${updatedCount} drugs.`);
if (updatedCount > 0) {
    fs.writeFileSync('match_log.txt', log.join('\n'));
    console.log("Log saved to match_log.txt");

    // Reconstruct calc.js content
    // We need to replace the array content. 
    // Serializing PEDIATRIC_DRUGS back to JS string is tricky because of function syntax if any (none here)
    // and maintaining comments/formatting.
    // However, PEDIATRIC_DRUGS is a pure data array in this file.
    // We can use JSON.stringify but need to format it nicely to match source style (keys unquoted if possible, or just standard JSON is fine for JS)
    // To preserve the file structure, we'll just replace the array part.
    // BUT JSON.stringify puts quotes around keys "id": "...", which is valid JS but style-changing.
    // Let's use a custom stringifier or just JSON and accept quotes. JS accepts quoted keys.

    const newArrayStr = JSON.stringify(PEDIATRIC_DRUGS, null, 4);
    // Remove quotes from simple keys (alphanumeric + underscore)
    const styledArrayStr = newArrayStr.replace(/"([a-zA-Z0-9_]+)":/g, '$1:');

    // Replace the variable definition
    const newContent = calcJsContent.replace(
        /const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/,
        `const PEDIATRIC_DRUGS = ${styledArrayStr};`
    );

    fs.writeFileSync(CALC_JS_PATH, newContent, 'utf-8');
    console.log(`calc.js updated with ${updatedCount} changes.`);
} else {
    console.log("No changes needed.");
}
