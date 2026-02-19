
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const PMDA_DIR = String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217`;
const CSV_PATH = path.join(PMDA_DIR, 'ファイルリスト.csv');
const XML_base_DIR = path.join(PMDA_DIR, 'SGML_XML');

// CSV Parser (Robust regex for quoted fields)
function parseCSV(text) {
    console.log(`CSV Text Length: ${text.length}`);
    const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
    console.log(`CSV Line Count: ${lines.length}`);
    if (lines.length === 0) return new Map();

    // Remove BOM if present
    let headerLine = lines[0];
    if (headerLine.charCodeAt(0) === 0xFEFF) {
        headerLine = headerLine.slice(1);
    }

    // Helper: Split by comma, respecting quotes
    const parseLine = (line) => {
        const res = [];
        let current = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
                inQuote = !inQuote;
            } else if (c === ',' && !inQuote) {
                res.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
                current = '';
            } else {
                current += c;
            }
        }
        res.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
        return res;
    };

    const headers = parseLine(headerLine);
    console.log("Detected Headers:", headers);

    const yjIndex = headers.indexOf('販売名コード');
    let fileIndex = headers.indexOf('ファイル名');
    if (fileIndex === -1) fileIndex = headers.indexOf('パス');

    if (yjIndex === -1 || fileIndex === -1) {
        console.error("CSV Headers missing required columns:", headers);
        return new Map();
    }

    const map = new Map();
    const debugRows = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseLine(lines[i]);
        if (i < 10) {
            debugRows.push(`Row ${i} len=${cols.length}, YJ[${yjIndex}]=${cols[yjIndex]}`);
            debugRows.push(JSON.stringify(cols));
        }
        if (cols[yjIndex]) {
            map.set(cols[yjIndex], cols[fileIndex]);
        }
    }
    const debugPath = path.join(process.cwd(), 'debug_rows.txt');
    console.log(`Writing debug rows to ${debugPath} (rows=${debugRows.length})`);
    try {
        fs.writeFileSync(debugPath, debugRows.join('\n'));
    } catch (e) {
        console.error("Error writing debug file:", e);
    }
    return map;
}

// 1. Load YJ Codes from calc.js
const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find PEDIATRIC_DRUGS"); process.exit(1); }

let PEDIATRIC_DRUGS;
try {
    PEDIATRIC_DRUGS = eval(`[${match[1]}]`);
} catch (e) {
    console.error("Eval error:", e);
    process.exit(1);
}

// 2. Load CSV Map
console.log("Loading PMDA File List...");
let yjToXmlMap = new Map();
try {
    const buffer = fs.readFileSync(CSV_PATH);
    const decoder = new TextDecoder('shift-jis');
    const csvText = decoder.decode(buffer);
    yjToXmlMap = parseCSV(csvText);
    console.log(`Loaded ${yjToXmlMap.size} entries from CSV.`);
    // Debug: print first 5 keys
    let count = 0;
    for (const key of yjToXmlMap.keys()) {
        console.log(`Map Key: '${key}' -> '${yjToXmlMap.get(key)}'`);
        count++;
        if (count > 5) break;
    }
} catch (e) {
    console.error("Error reading CSV:", e);
    process.exit(1);
}

// 3. Audit
const report = [];
const missingFiles = [];
const noPediatricMention = [];

console.log("Starting Audit...");

for (const drug of PEDIATRIC_DRUGS) {
    const yj = drug.yjCode;
    // YJ Code in calc.js might be 12 digits.
    // CSV might have 12 digits.

    // Check if map has it
    if (!yjToXmlMap.has(yj)) {
        // Try removing last digit? YJ codes are 12 digits.
        report.push(`[MISSING_CSV] ${drug.name} (YJ: ${yj}) - Not found in PMDA List`);
        continue;
    }

    const xmlFileName = yjToXmlMap.get(yj);
    const xmlPath = path.join(XML_base_DIR, xmlFileName);

    if (!fs.existsSync(xmlPath)) {
        report.push(`[MISSING_XML] ${drug.name} (YJ: ${yj}) - XML file not found at ${xmlPath}`);
        missingFiles.push(drug.name);
        continue;
    }

    // Read XML
    try {
        const xmlContent = fs.readFileSync(xmlPath, 'utf-8'); // XML implies UTF-8 usually
        // Check for Pediatric Keywords
        // Keywords: 小児, 幼児, 乳児, 新生児
        // Also check specifically in <usage> or similar if possible, but full search is safer for "mention".

        const hasPediatric = xmlContent.includes('小児') || xmlContent.includes('幼児') || xmlContent.includes('乳児') || xmlContent.includes('新生児');

        if (hasPediatric) {
            report.push(`[OK] ${drug.name} (YJ: ${yj}) - Pediatric mention found.`);
        } else {
            report.push(`[NO_PEDIATRIC] ${drug.name} (YJ: ${yj}) - NO pediatric keywords found in XML.`);
            noPediatricMention.push({ name: drug.name, yj: yj, id: drug.id });
        }

    } catch (e) {
        report.push(`[READ_ERROR] ${drug.name} (YJ: ${yj}) - Error reading XML: ${e.message}`);
    }
}

// Output Report
const reportPath = path.join(process.cwd(), 'audit_report.txt');
fs.writeFileSync(reportPath, report.join('\n'));
console.log(`Audit complete. Report saved to ${reportPath}`);

if (noPediatricMention.length > 0) {
    console.log("Drugs with NO pediatric mention:", noPediatricMention.map(d => d.name));
}
