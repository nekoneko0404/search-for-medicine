
import fs from 'fs';
import path from 'path';

// Resolve paths relative to CWD
const cwd = process.cwd();
console.log(`Current Working Directory: ${cwd}`);

const calcJsPath = path.resolve(cwd, 'lab/pediatric-calc/calc.js');
const xmlBaseDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const outputJsonPath = path.resolve(cwd, 'lab/pediatric-calc/data/dosage_details.json');

console.log(`Target calc.js path: ${calcJsPath}`);

// Ensure output directory exists
const outputDir = path.dirname(outputJsonPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function extractYjCodes() {
    console.log(`Reading calc.js...`);

    if (!fs.existsSync(calcJsPath)) {
        console.error(`ERROR: File not found at ${calcJsPath}`);
        return [];
    }

    const content = fs.readFileSync(calcJsPath, 'utf-8');
    console.log(`Read ${content.length} bytes from calc.js`);
    console.log("--- START OF CALC.JS PREVIEW (First 200 chars) ---");
    console.log(content.substring(0, 200));
    console.log("--- END OF CALC.JS PREVIEW ---");

    const yjCodes = [];
    const regex = /["']?yjCode["']?\s*:\s*["']([A-Za-z0-9]{12})["']/g;

    let match;
    let matchCount = 0;
    while ((match = regex.exec(content)) !== null) {
        yjCodes.push(match[1]);
        matchCount++;
        if (matchCount <= 5) {
            console.log(`DEBUG: Matched YJ Code: ${match[1]}`);
        }
    }

    console.log(`Total regular expression matches: ${matchCount}`);

    if (yjCodes.length === 0) {
        console.warn("WARNING: No YJ codes matched regex!");
        // Try a simpler check
        if (content.indexOf("yjCode") !== -1) {
            console.log("DEBUG: 'yjCode' string exists in content.");
            // Show context around "yjCode"
            const idx = content.indexOf("yjCode");
            console.log("Context around first yjCode:");
            console.log(content.substring(idx - 50, idx + 50));
        } else {
            console.error("DEBUG: 'yjCode' string NOT found in content.");
        }
    }

    return [...new Set(yjCodes)]; // Unique codes
}

function findXmlFile(yjCode) {
    return searchFileRecursive(xmlBaseDir, yjCode);
}

function searchFileRecursive(dir, yjCode) {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return null;
    }

    for (const file of files) {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) {
            continue;
        }

        if (stat.isDirectory()) {
            const result = searchFileRecursive(fullPath, yjCode);
            if (result) return result;
        } else if (file.includes(yjCode) && file.endsWith('.xml')) {
            return fullPath;
        }
    }
    return null;
}

function parseDoseAdmin(xmlContent) {
    const doseAdminMatch = xmlContent.match(/<DoseAdmin>([\s\S]*?)<\/DoseAdmin>/);
    if (!doseAdminMatch) return null;

    let content = doseAdminMatch[1];
    content = content.replace(/\sxmlns:?[^=]*=["'][^"']*["']/g, '');
    content = content.replace(/\sxml:?[^=]*=["'][^"']*["']/g, '');

    let html = '';
    const itemRegex = /<Item>([\s\S]*?)<\/Item>/g;
    let itemMatch;
    let hasItems = false;

    while ((itemMatch = itemRegex.exec(content)) !== null) {
        hasItems = true;
        const itemContent = itemMatch[1];
        const langRegex = /<Lang>([\s\S]*?)<\/Lang>/g;
        let langMatch;
        let langs = [];
        while ((langMatch = langRegex.exec(itemContent)) !== null) {
            langs.push(langMatch[1].trim());
        }

        html += '<div class="dosage-section">';
        if (langs.length > 0) {
            const firstLang = langs[0];
            if (/^[〈＜].*[〉＞]$/.test(firstLang) || langs.length > 1) {
                html += `<h4 class="dosage-header">${firstLang}</h4>`;
                for (let i = 1; i < langs.length; i++) {
                    html += `<p class="dosage-text">${langs[i]}</p>`;
                }
            } else {
                html += `<p class="dosage-text">${firstLang}</p>`;
            }
        }
        html += '</div>';
    }

    if (!hasItems) {
        const langRegex = /<Lang>([\s\S]*?)<\/Lang>/g;
        let langMatch;
        while ((langMatch = langRegex.exec(content)) !== null) {
            html += `<p class="dosage-text">${langMatch[1].trim()}</p>`;
        }
    }

    return html;
}

// Main Execution
try {
    const yjCodes = extractYjCodes();
    console.log(`Found ${yjCodes.length} YJ codes in calc.js`);

    const dosageMap = {};
    let foundCount = 0;

    for (const code of yjCodes) {
        console.log(`Processing ${code}...`);
        const xmlPath = findXmlFile(code);

        if (xmlPath) {
            console.log(`  Found XML: ${xmlPath}`);
            const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
            const dosageHtml = parseDoseAdmin(xmlContent);

            if (dosageHtml) {
                dosageMap[code] = dosageHtml;
                foundCount++;
            } else {
                console.warn(`  No <DoseAdmin> section found for ${code}`);
                dosageMap[code] = '<p class="dosage-empty">用法・用量情報の抽出に失敗しました。</p>';
            }
        } else {
            console.warn(`  XML file not found for ${code}`);
            dosageMap[code] = '<p class="dosage-empty">添付文書データが見つかりませんでした。</p>';
        }
    }

}

    const jsContent = `export default ${JSON.stringify(dosageMap, null, 2)};`;
const outputJsPath = outputJsonPath.replace('.json', '.js');
fs.writeFileSync(outputJsPath, jsContent, 'utf-8');
console.log(`\nExtraction complete. Saved ${foundCount}/${yjCodes.length} records to ${outputJsPath}`);
} catch (e) {
    console.error("An error occurred during execution:", e);
}
