
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// Resolve paths relative to CWD
const cwd = process.cwd();
console.log(`Current Working Directory: ${cwd}`);

// Resolve paths relative to script location
const currentFile = new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1'); // Handle Windows path
const scriptDir = path.dirname(currentFile);
const calcJsPath = path.resolve(scriptDir, '../calc.js');
const xmlBaseDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const outputJsPath = path.resolve(scriptDir, '../data/dosage_details.js');

console.log(`Script Directory: ${scriptDir}`);
console.log(`Target calc.js path: ${calcJsPath}`);

// Ensure output directory exists
const outputDir = path.dirname(outputJsPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const DIRECTORY_KEYWORD_MAPPING = {
    "6135001R2110": ["ホスミシンドライシロップ"],
    "6250022G1022": ["イナビル吸入粉末剤"],
    "6149003R1143": ["クラリスドライシロップ"],
    "6149002R1033": ["エリスロシンドライシロップW"],
    "6250017G1029": ["リレンザ"],
    "6250047F1022": ["ゾフルーザ顆粒", "ゾフルーザ"],
    "2259005R1029": ["ホクナリンドライシロップ"],
    "4413003F1020": ["オキサトミドドライシロップ", "小児用"],
    "2359005X1026": ["モビコール配合内用剤"],
    "4413004C2022": ["ゼスラン小児用細粒"],
    "3222012Q1030": ["インクレミンシロップ"],
    "6131001C1210": ["サワシリン細粒"],
    "6250019D1020": ["バルトレックス顆粒５０％"],
    "6250021R1024": ["タミフルドライシロップ３％"],
    "6131008C1033": ["ユナシン細粒"],
    "6149004C1030": ["ジスロマック細粒"],
    "2251001D1061": ["テオドール顆粒"],
    "4419005B1045": ["ペリアクチン散"],
    "4490003R1228": ["ザジテンドライシロップ"],
    "4490023R2035": ["フェキソフェナジン塩酸塩ＤＳ"],
    "4490025D1022": ["アレロック顆粒"],
    "4490026C1021": ["キプレス細粒"],
    "1141007C1075": ["カロナール細粒"],
    "2239001Q1166": ["小児用ムコソルバンＤＳ"],
    "4490017R1033": ["オノンドライシロップ１０％"],
    "2259002R1061": ["ホクナリンドライシロップ０．１％小児用"],
    "2239001R1072": ["小児用ムコソルバンＤＳ１．５％"],
    "2223001B1210": ["メジコン散１０％"],
    "6241010C1024": ["オゼックス細粒小児用１５％"],
    "6152005D1094": ["ミノマイシン顆粒２％"],
    "6132002E1034": ["Ｌ-ケフレックス小児用顆粒"],
    "6132013C1031": ["セフゾン細粒小児用１０％"],
    "6132005C1053": ["ケフラール細粒小児用１００ｍｇ"],
    "6250002D1024": ["ゾビラックス顆粒４０％"]
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

function parseDoseAdmin(xmlContent, code) {
    if (!xmlContent || xmlContent.trim().length === 0) {
        console.error(`ERROR: XML content is empty for ${code}`);
        return null;
    }

    const cleanXml = xmlContent.replace(/<\/?([a-zA-Z0-9]+):/g, (match, prefix) => {
        return match.startsWith('</') ? '</' : '<';
    }).replace(/\sxmlns(:[a-zA-Z0-9]+)?="[^"]*"/g, '');

    // console.log(`DEBUG: Clean XML Length: ${cleanXml.length}`);
    const $ = cheerio.load(cleanXml, { xmlMode: true });

    // Extract Brand Name
    let brandNameSource = '';

    // Match by YJ code if possible
    $('DetailBrandName').each((i, el) => {
        const yjCodes = $(el).find('YJCode').map((j, c) => $(c).text().trim()).get();
        if (yjCodes.includes(code)) {
            const name = $(el).find('ApprovalBrandName Lang').first().text().trim();
            if (name) {
                brandNameSource = name;
                return false;
            }
        }
    });

    if (!brandNameSource) {
        const brandNameEl = $('ApprovalBrandName Lang, BrandName Lang').first();
        if (brandNameEl.length > 0) {
            brandNameSource = brandNameEl.text().trim();
        }
    }

    // --- NEW: Resolve Brand Name References ---
    // Create a mapping of id -> brand name for resolving <ApprovalBrandNameRef> etc.
    const brandMap = {};
    $('DetailBrandName').each((i, el) => {
        const id = $(el).attr('id');
        const name = $(el).find('ApprovalBrandName Lang').first().text().trim();
        if (id && name) {
            brandMap[id] = name;
        }
    });

    // Replace <ApprovalBrandNameRef> and <BrandNameRef> with actual text
    $('*').each((i, el) => {
        const tagName = ($(el).prop('tagName') || '').toLowerCase();
        if (tagName.endsWith('brandnameref')) {
            const refId = $(el).attr('ref');
            if (refId && brandMap[refId]) {
                $(el).replaceWith(brandMap[refId]);
            } else {
                // Fallback: remove the tag if not found, or use empty string
                $(el).replaceWith("");
            }
        }
    });
    // --- END NEW ---

    function processTable(tblBlock) {
        let tableHtml = '<div class="table-responsive"><table class="dosage-table table table-bordered table-sm">';

        let title = '';
        $(tblBlock).children().each((i, child) => {
            if ($(child).prop('tagName').toLowerCase() === 'title') {
                title = $(child).text();
            }
        });

        if (title) tableHtml = `<h5>${title}</h5>` + tableHtml;

        // Find rows case-insensitively
        let rows = $(tblBlock).find('*').filter((i, el) => {
            const t = $(el).prop('tagName').toLowerCase();
            return t === 'row' || t === 'simptblrow';
        });

        // Ensure rows are found
        // if (rows.length === 0) console.log('DEBUG: processTable found 0 rows');

        rows.each((i, row) => {
            tableHtml += '<tr>';

            // Find cells case-insensitively
            let cells = $(row).find('*').filter((i, el) => {
                const t = $(el).prop('tagName').toLowerCase();
                return t === 'cell' || t === 'simptblcell';
            });

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

        // Use contents() to include text nodes and elements
        $(item).contents().each((i, child) => {

            // Handle Text Nodes
            if (child.type === 'text') {
                const text = $(child).text().trim();
                if (text) {
                    itemHtml += `<p class="dosage-text mb-1">${text}</p>`;
                }
                return;
            }

            // Handle Element Nodes
            if (child.type !== 'tag') return;

            const childEl = $(child);
            const tagName = (childEl.prop('tagName') || '').toLowerCase();
            const text = childEl.text().trim();

            if (tagName === 'item') {
                // Recursive call for Item tags
                itemHtml += processItem(child);
            } else if (['paragraph', 'p'].includes(tagName)) {
                if (text) itemHtml += `<p class="dosage-text mb-1">${text}</p>`;
            } else if (['header', 'caption', 'head'].includes(tagName)) {
                if (text) {
                    itemHtml += `<p class="dosage-header fw-bold mb-1">${text}</p>`;
                }
            } else if (tagName === 'lang') {
                if (text) {
                    itemHtml += `<p class="dosage-text mb-1">${text}</p>`;
                }
            } else if (tagName === 'detail') {
                if (text.length < 20) {
                    itemHtml += `<p class="dosage-sub-header fw-bold mb-1">${text}</p>`;
                } else {
                    itemHtml += `<p class="dosage-text mb-1">${text}</p>`;
                }
            } else if (['simplelist', 'unorderedlist', 'orderedlist', 'content'].includes(tagName)) {
                // Iterate children of the list to preserve order of Headers and Items
                childEl.children().each((j, listChild) => {
                    const lcTag = ($(listChild).prop('tagName') || '').toLowerCase();
                    if (lcTag === 'item') {
                        itemHtml += processItem(listChild);
                    } else if (['header', 'caption', 'head'].includes(lcTag)) {
                        const lcText = $(listChild).text().trim();
                        if (lcText) itemHtml += `<p class="dosage-header fw-bold mb-1">${lcText}</p>`;
                    } else if (lcTag === 'lang') { // Content might have direct Lang
                        const lcText = $(listChild).text().trim();
                        if (lcText) itemHtml += `<p class="dosage-text mb-1">${lcText}</p>`;
                    }
                });
            } else if (['tblblock', 'simpletable'].includes(tagName)) {
                itemHtml += processTable(childEl);
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

    let html = '';

    let doseAdmin = null;
    $('*').each((i, el) => {
        const t = ($(el).prop('tagName') || '').toLowerCase();
        if (t.endsWith('doseadmin')) {
            // console.log(`DEBUG: Found DoseAdmin tag: ${$(el).prop('tagName')}`);
            doseAdmin = $(el);
            return false;
        }
    });

    if (!doseAdmin || doseAdmin.length === 0) {
        console.log(`DEBUG: DoseAdmin NOT FOUND for ${code}`);
        return null; // Return null to indicate failure
    }

    // Found InfoDoseAdmin or DoseAdmin.
    // If it's InfoDoseAdmin, check if it has DoseAdmin child.
    const rootTagName = (doseAdmin.prop('tagName') || '').toLowerCase();

    // If it is InfoDoseAdmin, we iterate children to find DoseAdmin or process directly if structure differs
    if (rootTagName === 'infodoseadmin') {
        let hasDoseAdminChild = false;
        doseAdmin.children().each((i, child) => {
            const t = ($(child).prop('tagName') || '').toLowerCase();
            // console.log(`DEBUG: InfoDoseAdmin child: ${t}`);
            if (t === 'doseadmin') {
                hasDoseAdminChild = true;
                console.log(`DEBUG: Found nested DoseAdmin`);
                // Process this DoseAdmin child
                $(child).children().each((j, subChild) => {
                    html += processItem(subChild);
                });
            }
        });

        if (!hasDoseAdminChild) {
            console.log(`DEBUG: No nested DoseAdmin found, processing InfoDoseAdmin children directly`);
            // Fallback: treat InfoDoseAdmin as DoseAdmin (iterate its children)
            doseAdmin.children().each((i, child) => {
                html += processItem(child);
            });
        }
    } else {
        // It is DoseAdmin (or similar)
        doseAdmin.children().each((i, child) => {
            html += processItem(child);
        });
    }

    return { html: html.trim() || null, source: brandNameSource };
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
            console.log(`Searching for drug: ${drug.name || drug.brandName} (${yjCode}) with keywords: ${searchKeywords.join(', ')}`);

            let foundDir = null;
            for (const keyword of searchKeywords) {
                const match = allDirs.find(dirName => dirName.includes(keyword));
                if (match) {
                    foundDir = match;
                    console.log(`  Found directory: ${foundDir} for keyword: ${keyword}`);
                    break;
                }
            }

            if (foundDir) {
                const fullDirPath = path.join(xmlBaseDir, foundDir);

                function findXmlRecursive(dir) {
                    let results = [];
                    try {
                        const list = fs.readdirSync(dir);
                        for (let file of list) {
                            const fullPath = path.join(dir, file);
                            const stat = fs.statSync(fullPath);
                            if (stat && stat.isDirectory()) {
                                results = results.concat(findXmlRecursive(fullPath));
                            } else if (file.endsWith('.xml')) {
                                results.push(fullPath);
                            }
                        }
                    } catch (e) {
                        console.warn(`  Error searching in ${dir}: ${e.message}`);
                    }
                    return results;
                }

                const xmlFiles = findXmlRecursive(fullDirPath);

                if (xmlFiles.length > 0) {
                    // console.log(`  Found ${xmlFiles.length} XML files, using ${xmlFiles[0]}`);
                    const xmlPath = xmlFiles[0];
                    let xmlContent = fs.readFileSync(xmlPath, 'utf-8');
                    let originalXmlLength = xmlContent.length;
                    // Strip BOM if present
                    xmlContent = xmlContent.replace(/^\uFEFF/, '');

                    // console.log(`DEBUG: XML Content Start (${yjCode}):`, xmlContent.substring(0, 200));
                    const result = parseDoseAdmin(xmlContent, yjCode);

                    if (result && result.html) {
                        dosageMap[yjCode] = result;
                        foundCount++;
                        console.log(`  Successfully extracted dosage for ${yjCode} from ${result.source}`);
                    } else {
                        dosageMap[yjCode] = { html: '<p class="dosage-empty">用法・用量情報の抽出に失敗しました。</p>', source: '' };
                        console.warn(`  Failed to extract dosage content from XML for ${yjCode} in ${xmlPath}`);
                    }
                } else {
                    dosageMap[yjCode] = { html: '<p class="dosage-empty">添付文書データ（XML）が見つかりませんでした。</p>', source: '' };
                    console.warn(`  No XML files found in ${fullDirPath} (searched recursively)`);
                }

            } else {
                dosageMap[yjCode] = { html: '<p class="dosage-empty">添付文書データが見つかりませんでした。</p>', source: '' };
                console.warn(`  No matching directory found for ${drug.name || drug.brandName} (${yjCode})`);
            }
        }

        const jsContent = `export default ${JSON.stringify(dosageMap, null, 2)};`;
        fs.writeFileSync(outputJsPath, jsContent, 'utf-8');
        console.log(`\nExtraction complete. Saved ${foundCount}/${drugs.length} records to ${outputJsPath}`);

    } catch (e) {
        console.error("An error occurred during execution:", e);
    }
})();
