import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = 'c:/Users/kiyoshi/Github_repository/search-for-medicine/lab/pediatric-calc/calc.js';
const PMDA_BASE_PATH = 'C:/Users/kiyoshi/OneDrive/ドキュメント/pmda_all_sgml_xml_20260217/SGML_XML';

/**
 * Extracts PEDIATRIC_DRUGS object from calc.js
 */
function extractDrugsFromCalcJs() {
    const content = fs.readFileSync(CALC_JS_PATH, 'utf8');
    const startMarker = 'const PEDIATRIC_DRUGS = ';
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) {
        console.error('Could not find start marker');
        return [];
    }

    const remaining = content.substring(startIdx + startMarker.length);
    const endIdx = remaining.indexOf('];');
    if (endIdx === -1) {
        console.error('Could not find end marker');
        return [];
    }

    const arrayStr = remaining.substring(0, endIdx + 1);

    try {
        // Use Function to evaluate the string as a JS expression
        const drugs = new Function(`return ${arrayStr}`)();
        return Array.isArray(drugs) ? drugs : [];
    } catch (e) {
        console.error('Failed to evaluate drugs array:', e.message);
        return [];
    }
}

/**
 * Normalizes drug name for matching
 */
function normalizeName(name) {
    if (!name) return '';
    return name
        .replace(/[（）()]/g, '')
        .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)) // Wide to narrow numbers
        .replace(/[ａ-ｚＡ-Ｚ]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)) // Wide to narrow letters
        .replace(/％/g, '%')
        .replace(/[\s　]/g, '')
        .toLowerCase();
}

/**
 * Audit process
 */
async function audit() {
    console.log('Extracting drugs from calc.js...');
    const drugs = extractDrugsFromCalcJs();
    console.log(`Extracted ${drugs.length} drugs.`);

    if (drugs.length === 0) {
        console.log('Abort: No drugs found.');
        return;
    }

    console.log('Scanning PMDA folders...');
    const pmdaFolders = fs.readdirSync(PMDA_BASE_PATH);
    const folderMap = new Map();
    pmdaFolders.forEach(folder => {
        folderMap.set(normalizeName(folder), folder);
    });

    const results = [];

    for (const drug of drugs) {
        const normName = normalizeName(drug.name);
        let folderName = folderMap.get(normName);

        // Try fallback matches if not found (e.g. without suffix)
        if (!folderName) {
            for (const [key, value] of folderMap) {
                if (key.includes(normName) || normName.includes(key)) {
                    folderName = value;
                    break;
                }
            }
        }

        const result = {
            id: drug.id,
            name: drug.name,
            yjCode: drug.yjCode,
            currentSnippet: drug.piSnippet || '',
            pmdaData: null,
            match: false,
            error: null
        };

        if (folderName) {
            const folderPath = path.join(PMDA_BASE_PATH, folderName);
            const files = fs.readdirSync(folderPath);
            const xmlFile = files.find(f => f.endsWith('.xml'));

            if (xmlFile) {
                try {
                    const xmlContent = fs.readFileSync(path.join(folderPath, xmlFile), 'utf8');

                    const doseMatch = xmlContent.match(/<InfoDoseAdmin[^>]*>([\s\S]*?)<\/InfoDoseAdmin>/);
                    const precautionsMatch = xmlContent.match(/<InfoPrecautionsDosage[^>]*>([\s\S]*?)<\/InfoPrecautionsDosage>/);

                    let pmdaText = '';
                    if (doseMatch) {
                        pmdaText += doseMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    }
                    if (precautionsMatch) {
                        pmdaText += ' ' + precautionsMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    }

                    result.pmdaData = pmdaText || '(Dose info tags not found)';
                    result.match = true;
                } catch (e) {
                    result.error = `Error reading XML: ${e.message}`;
                }
            } else {
                result.error = 'No XML file found in folder';
            }
        } else {
            result.error = 'No matching PMDA folder found';
        }

        results.push(result);
    }

    // Write report
    let reportContent = '# Drug Data Audit Report (PMDA Cross-check)\n\n';
    reportContent += `Audit Date: ${new Date().toLocaleString()}\n\n`;
    reportContent += `Total Drugs Audited: ${drugs.length}\n`;
    reportContent += `Matched: ${results.filter(r => r.match).length}\n`;
    reportContent += `Unmatched: ${results.filter(r => !r.match).length}\n\n`;

    reportContent += '## Audit Details\n\n';

    results.forEach(r => {
        reportContent += `### ${r.name} (${r.yjCode})\n`;
        if (r.match) {
            reportContent += `- **Status**: [MATCHED]\n`;
            reportContent += `- **Current Snippet**: ${r.currentSnippet}\n`;
            reportContent += `- **PMDA Extraction**: ${r.pmdaData}\n`;

            const diff = r.currentSnippet && !r.pmdaData.includes(r.currentSnippet.substring(0, 5));
            if (diff) {
                reportContent += `- > [!WARNING]\n`;
                reportContent += `- > Snippet might be different from PMDA data. Please verify.\n`;
            }
        } else {
            reportContent += `- **Status**: [ERROR/MISSING] - ${r.error}\n`;
        }
        reportContent += '\n---\n\n';
    });

    fs.writeFileSync('c:/Users/kiyoshi/Github_repository/search-for-medicine/docs/audit_drug_data_report.md', reportContent);
    console.log('Audit completed. Report generated at docs/audit_drug_data_report.md');
}

audit();
