
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { TextDecoder } from 'util';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const PMDA_DIR = String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217`;
const CSV_PATH = path.join(PMDA_DIR, 'ファイルリスト.csv');
const XML_base_DIR = path.join(PMDA_DIR, 'SGML_XML');

// 1. Load YJ Codes from calc.js
const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find PEDIATRIC_DRUGS"); process.exit(1); }

let PEDIATRIC_DRUGS;
try {
    // Need dummy variables if eval needs them, but calc.js seems self-contained or simple objects
    PEDIATRIC_DRUGS = eval(`[${match[1]}]`);
} catch (e) {
    console.error("Eval error:", e);
    process.exit(1);
}

const report = [];
const noPediatricMention = [];
const missingFiles = [];

console.log(`Starting Audit for ${PEDIATRIC_DRUGS.length} drugs...`);
const decoder = new TextDecoder('shift-jis');

for (const drug of PEDIATRIC_DRUGS) {
    const yj = drug.yjCode;
    try {
        // Use findstr to search for YJ code in CSV
        // /C:"string" forces literal search
        const cmd = `findstr /C:"${yj}" "${CSV_PATH}"`;
        // stdio: 'pipe' to capture output
        const outputBuffer = execSync(cmd, { stdio: 'pipe' });
        const outputText = decoder.decode(outputBuffer);

        // Output might have multiple lines, take the first one that contains SGML_XML
        const lines = outputText.split(/\r?\n/);
        let targetLine = lines.find(l => l.includes('SGML_XML') || l.includes('.xml'));

        if (!targetLine) {
            report.push(`[NOT_FOUND_XML_PATH] ${drug.name} (YJ: ${yj}) - Found in CSV but no XML path in line.`);
            continue;
        }

        // Extract filename. Usually "./SGML_XML/filename.xml" or just "filename.xml"
        // Regex to find .xml file
        const xmlMatch = targetLine.match(/[^",]+\.xml/);
        if (!xmlMatch) {
            report.push(`[NO_XML_EXT] ${drug.name} (YJ: ${yj}) - Could not extract .xml filename from line.`);
            continue;
        }

        // Clean up filename (remove leading ./SGML_XML/ if present in match, or join later)
        let xmlFileName = xmlMatch[0];
        // If it returns full path like ./SGML_XML/foo.xml, extracting basename might be safer if we join with XML_base_DIR
        // But XML_base_DIR is .../SGML_XML
        // If CSV says "./SGML_XML/foo.xml", valid path is PMDA_DIR + "/SGML_XML/foo.xml".
        // If CSV says "foo.xml", valid path is PMDA_DIR + "/SGML_XML/foo.xml".

        // Let's assume standard structure: XMLs are in SGML_XML folder.
        const basename = path.basename(xmlFileName);
        const xmlPath = path.join(XML_base_DIR, basename);

        if (!fs.existsSync(xmlPath)) {
            report.push(`[MISSING_XML_FILE] ${drug.name} (YJ: ${yj}) - File not found: ${basename}`);
            missingFiles.push(drug.name);
            continue;
        }

        // Read XML
        const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
        const hasPediatric = xmlContent.includes('小児') || xmlContent.includes('幼児') || xmlContent.includes('乳児') || xmlContent.includes('新生児');

        if (hasPediatric) {
            report.push(`[OK] ${drug.name} (YJ: ${yj})`);
        } else {
            report.push(`[NO_PEDIATRIC] ${drug.name} (YJ: ${yj}) - NO pediatric keywords found.`);
            noPediatricMention.push(drug.name);
        }

    } catch (e) {
        // execSync throws if command fails (exit code 1 = not found)
        report.push(`[NOT_FOUND_CSV] ${drug.name} (YJ: ${yj}) - findstr returned no match.`);
        missingFiles.push(drug.name);
    }
}

const reportPath = path.join(process.cwd(), 'audit_report_findstr.txt');
fs.writeFileSync(reportPath, report.join('\n'));
console.log(`Audit complete. Report saved to ${reportPath}`);
console.log(`Missing/Not Found: ${missingFiles.length}`);
console.log(`No Pediatric Mention: ${noPediatricMention.length}`);
