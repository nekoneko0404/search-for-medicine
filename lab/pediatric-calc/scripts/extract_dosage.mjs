
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// Resolve paths relative to CWD
const cwd = process.cwd();
console.log(`Current Working Directory: ${cwd}`);

// If running from lab/pediatric-calc, calc.js is directly in CWD
const calcJsPath = path.join(cwd, 'calc.js');
const xmlBaseDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const outputJsonPath = path.join(cwd, 'data', 'dosage_details.json');

console.log(`Target calc.js path: ${calcJsPath}`);

// Ensure output directory exists
const outputDir = path.dirname(outputJsonPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const DIRECTORY_KEYWORD_MAPPING = {
    "6135001R2110": ["ホスミシンドライシロップ"],
    "6250022G1022": ["イナビル吸入粉末剤"],
    "6149003R1143": ["クラリスドライシロップ", "小児用"],
    "6149002R1033": ["エリスロシンドライシロップW"],
    "6250017G1029": ["リレンザ"],
    "6250047F1022": ["ゾフルーザ顆粒", "ゾフルーザ"],
    "2259005R1029": ["ホクナリンドライシロップ"],
    "4413003F1020": ["オキサトミドドライシロップ", "小児用"],
    "2359005X1026": ["モビコール配合内用剤"],
    "4413004C2022": ["ゼスラン小児用細粒"],
    "3222012Q1030": ["インクレミンシロップ"],
    "6131001C1210": ["サワシリン細粒"],
    "6250019D1020": ["バルトレックス"],
    "6250021R1024": ["タミフル"]
};

function loadDrugsFromCalcJs() {
    console.log(`Reading calc.js...`);
    if (!fs.existsSync(calcJsPath)) {
        console.error(`ERROR: File not found at ${calcJsPath}`);
        return [];
    }

    const content = fs.readFileSync(calcJsPath, 'utf-8');

    // Find PEDIATRIC_DRUGS definition
    const startTag = 'const PEDIATRIC_DRUGS = [';
    const startIndex = content.indexOf(startTag);

    if (startIndex === -1) {
        console.error("Could not find PEDIATRIC_DRUGS definition in calc.js");
        return [];
    }

    // Bracket matching to find the end
    let bracketCount = 0;
    let endIndex = -1;
    let started = false;

    // Start scanning from the opening bracket of the array
    const scanStart = startIndex + startTag.length - 1; // points to '['

    for (let i = scanStart; i < content.length; i++) {
        const char = content[i];
        if (char === '[') {
            bracketCount++;
            started = true;
        } else if (char === ']') {
            bracketCount--;
            if (started && bracketCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }

    if (endIndex === -1) {
        console.error("Could not find matching closing bracket for PEDIATRIC_DRUGS");
        return [];
    }

    const arraySource = content.substring(startIndex, endIndex);

    try {
        const cleanSource = arraySource.replace('const PEDIATRIC_DRUGS =', 'return');
        const getDrugs = new Function(cleanSource);
        const drugs = getDrugs();

        console.log(`Successfully extracted ${drugs.length} drugs via source parsing.`);
        return drugs;

    } catch (e) {
        console.error("Failed to parse extracted source:", e);
        const arrayOnly = content.substring(scanStart, endIndex);
        try {
            const drugs = eval(arrayOnly);
            console.log(`Successfully extracted ${drugs.length} drugs via direct eval.`);
            return drugs;
        } catch (e2) {
            console.error("Failed fallback eval:", e2);
            return [];
        }
    }
}

function getSearchKeywords(drug) {
    if (DIRECTORY_KEYWORD_MAPPING[drug.yjCode]) {
        return DIRECTORY_KEYWORD_MAPPING[drug.yjCode];
    }

    const keywords = [];
    if (drug.brandName) keywords.push(drug.brandName);
    if (drug.name) {
        const parts = drug.name.split(/／|（|\(/);
        if (parts[0]) keywords.push(parts[0].trim());
        if (parts.length > 1 && parts[1]) keywords.push(parts[1].trim());
    }
    return [...new Set(keywords)].filter(k => k.length > 2);
}

function parseDoseAdmin(xmlContent, drugCode) {
    // Strip namespaces to avoid Cheerio extraction issues
    const cleanXml = xmlContent.replace(/xmlns="[^"]*"/g, '');
    const $ = cheerio.load(cleanXml, { xmlMode: true });

    let doseAdmin = $('DoseAdmin');
    if (doseAdmin.length === 0) doseAdmin = $('*[nodeName="DoseAdmin"]');
    if (doseAdmin.length === 0) return null;

    let html = '';

    function processTable(tblBlock) {
        let tableHtml = '<div class="table-responsive"><table class="dosage-table table table-bordered table-sm">';
        const title = tblBlock.find('Title').first().text();
        if (title) tableHtml = `<h5>${title}</h5>` + tableHtml;

        let rows = tblBlock.find('Table Row');
        if (rows.length === 0) {
            rows = tblBlock.find('SimpleTable SimpTblRow');
        }

        if (rows.length === 0) {
            console.log(`[WARN] Table found but zero rows (checked Table/Row and SimpleTable/SimpTblRow).`);
        }

        rows.each((i, row) => {
            tableHtml += '<tr>';

            let cells = $(row).find('Cell');
            if (cells.length === 0) {
                cells = $(row).find('SimpTblCell');
            }

            cells.each((j, cell) => {
                const content = $(cell).text().trim();
                const rspan = $(cell).attr('rspan');
                const cspan = $(cell).attr('cspan');
                const align = $(cell).attr('align');
                const valign = $(cell).attr('valign');

                let attrs = '';
                if (rspan) attrs += ` rowspan="${rspan}"`;
                if (cspan) attrs += ` colspan="${cspan}"`;

                let style = '';
                if (align) style += `text-align:${align};`;
                if (valign) style += `vertical-align:${valign};`;
                if (style) attrs += ` style="${style}"`;

                tableHtml += `<td${attrs}>${content}</td>`;
            });
            tableHtml += '</tr>';
        });

        tableHtml += '</table></div>';
        return tableHtml;
    }

    function processItem(item) {
        let itemHtml = '<div class="dosage-item mb-2">';

        $(item).children().each((i, child) => {
            const tagName = $(child).prop('tagName');

            if (tagName === 'Header' || tagName === 'Caption' || tagName === 'Head') {
                const text = $(child).text().trim();
                if (text) {
                    itemHtml += `<p class="dosage-header fw-bold mb-1">${text}</p>`;
                }
            } else if (tagName === 'Lang') {
                const text = $(child).text().trim();
                if (text) {
                    itemHtml += `<p class="dosage-text mb-1">${text}</p>`;
                }
            } else if (tagName === 'Detail') {
                const text = $(child).text().trim();
                if (text.length < 20) {
                    // Short Details are often labels like "成人" or "小児"
                    itemHtml += `<p class="dosage-sub-header fw-bold mb-1">${text}</p>`;
                } else {
                    itemHtml += `<p class="dosage-text mb-1">${text}</p>`;
                }
            } else if (tagName === 'SimpleList' || tagName === 'UnorderedList' || tagName === 'OrderedList' || tagName === 'Content') {
                $(child).find('> Item').each((j, nestedItem) => {
                    itemHtml += processItem(nestedItem);
                });
                // If Content has no Items, check for direct Langs
                if (tagName === 'Content' && $(child).find('> Item').length === 0) {
                    $(child).find('Lang').each((k, cl) => {
                        itemHtml += `<p class="dosage-text mb-1">${$(cl).text().trim()}</p>`;
                    });
                }
            } else if (tagName === 'TblBlock') {
                itemHtml += processTable($(child));
            }
        });

        itemHtml += '</div>';

        // Cleanup empty items
        const $check = cheerio.load(itemHtml);
        const cleanText = $check.root().text().trim();
        if (!cleanText && !itemHtml.includes('<img') && !itemHtml.includes('<table')) {
            return "";
        }

        return itemHtml;
    }

    let items = doseAdmin.find('> Item');
    if (items.length === 0) {
        // Handle SimpleList wrapper for Zeslan etc.
        items = doseAdmin.find('> SimpleList > Item');
    }

    if (items.length > 0) {
        items.each((i, item) => html += processItem(item));
    } else {
        const tables = doseAdmin.find('> TblBlock');
        if (tables.length > 0) {
            tables.each((i, tbl) => html += processTable($(tbl)));
        } else {
            // Handle direct Detail (Fosmicin) or Lang
            const details = doseAdmin.find('> Detail');
            if (details.length > 0) {
                details.each((i, detail) => {
                    $(detail).find('Lang').each((j, lang) => html += `<p class="dosage-text">${$(lang).text().trim()}</p>`);
                });
            } else {
                const langs = doseAdmin.find('> Lang');
                if (langs.length > 0) langs.each((i, lang) => html += `<p class="dosage-text">${$(lang).text().trim()}</p>`);
            }
        }
    }
    return html;
}

(async () => {
    try {
        console.log("Starting script execution...");
        const drugs = loadDrugsFromCalcJs();
        console.log(`Loaded ${drugs.length} drugs.`);

        if (drugs.length === 0) {
            console.error("No drugs loaded. Exiting.");
            return;
        }

        console.log(`Reading XML Base Directory: ${xmlBaseDir}`);
        const allDirs = fs.readdirSync(xmlBaseDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`Found ${allDirs.length} top-level directories.`);

        const dosageMap = {};
        let foundCount = 0;

        for (const drug of drugs) {
            const yjCode = drug.yjCode;
            if (!yjCode) continue;

            const searchKeywords = getSearchKeywords(drug);

            let foundDir = null;
            for (const keyword of searchKeywords) {
                const match = allDirs.find(dirName => dirName.includes(keyword));
                if (match) {
                    foundDir = match;
                    break;
                }
            }

            if (foundDir) {
                const fullDirPath = path.join(xmlBaseDir, foundDir);
                let xmlFiles = [];
                try {
                    xmlFiles = fs.readdirSync(fullDirPath).filter(f => f.endsWith('.xml'));
                } catch (e) {
                    console.warn(`Failed to read dir content: ${fullDirPath}`);
                }

                if (xmlFiles.length > 0) {
                    const xmlPath = path.join(fullDirPath, xmlFiles[0]);
                    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
                    const dosageHtml = parseDoseAdmin(xmlContent, yjCode);

                    if (dosageHtml) {
                        dosageMap[yjCode] = dosageHtml;
                        foundCount++;
                    } else {
                        dosageMap[yjCode] = '<p class="dosage-empty">用法・用量情報の抽出に失敗しました。</p>';
                    }
                } else {
                    dosageMap[yjCode] = '<p class="dosage-empty">添付文書データ（XML）が見つかりませんでした。</p>';
                }

            } else {
                dosageMap[yjCode] = '<p class="dosage-empty">添付文書データが見つかりませんでした。</p>';
            }
        }

        const jsContent = `export default ${JSON.stringify(dosageMap, null, 2)};`;
        const outputJsPath = outputJsonPath.replace('.json', '.js');
        fs.writeFileSync(outputJsPath, jsContent, 'utf-8');
        console.log(`\nExtraction complete. Saved ${foundCount}/${drugs.length} records to ${outputJsPath}`);

        const checkList = {
            '6131001C1210': 'Amoxicillin',
            '4413004C2022': 'Zeslan',
            '6135001R2110': 'Fosmicin',
            '3222012Q1030': 'Incremin',
            '6250022G1022': 'Inavir',
            '6149003R1143': 'Clarith'
        };

        for (const [code, name] of Object.entries(checkList)) {
            if (dosageMap[code] && !dosageMap[code].includes('見つかりませんでした') && !dosageMap[code].includes('抽出に失敗しました') && !dosageMap[code].includes('<table></table>') && !dosageMap[code].includes('dosage-item mb-2"></div>')) {
                // Check if it's just empty divs
                const cleanText = cheerio.load(dosageMap[code]).text().trim();
                if (!cleanText && !dosageMap[code].includes('<table')) {
                    console.warn(`${name}: Data Missing or Empty (Empty Divs) ❌`);
                } else {
                    console.log(`${name}: Data Extracted ✅`);
                }
            } else {
                console.warn(`${name}: Data Missing or Empty ❌`);
            }
        }

    } catch (e) {
        console.error("An error occurred during execution:", e);
    }
})();
