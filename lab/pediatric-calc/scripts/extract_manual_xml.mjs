import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const TARGET_FILES = [
    { name: "Zovirax", code: "6250002D1024", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ゾビラックス顆粒４０％\340278_6250002D1024_1_17.xml` },
    { name: "Xofluza", code: "6250047F1022", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ゾフルーザ顆粒２％分包\340018_6250047F1022_1_20\340018_6250047F1022_1_20.xml` }, // Updated code from D1021 to F1022 based on path
    { name: "Polaramine Powder 1%", code: "4419002B1033", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ポララミン散１％\400186_4419002B1033_2_05.xml` },
    { name: "Polaramine DS 0.2%", code: "4419002R1031", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ポララミンドライシロップ０．２％\400186_4419002R1031_2_08.xml` },
    { name: "Periactin", code: "4419005B1045", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ペリアクチン散１％\530169_4419005B1045_2_05.xml` },
    { name: "Biofermin R", code: "2316004B1036", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ビオフェルミンＲ散\650006_2316004B1036_1_10.xml` },
    { name: "Miya BM", code: "2316009C1026", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ミヤＢＭ細粒\750144_2316009C1026_1_07.xml` },
    { name: "Mukodyne DS 50%", code: "2233002R2029", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ムコダインＤＳ５０％\231099_2233002R2029_2_03.xml` },
    { name: "Meptin DS 0.005%", code: "2259004R2024", path: String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\メプチンドライシロップ０．００５％\180078_2259004R2024_1_11.xml` },
    { name: "Sawasillin/Widercillin", code: "6131001C1210", path: path.join("lab/pediatric-calc/data/xml/Widercillin_20.xml") }
];

function parseDoseAdmin(xmlContent, code) {
    if (xmlContent.charCodeAt(0) === 0xFEFF) {
        xmlContent = xmlContent.slice(1);
    }

    const $ = cheerio.load(xmlContent, { xmlMode: true });

    // Extract Brand Name
    let brandNameSource = '';
    const brandNameEl = $('ApprovalBrandName Lang, BrandName Lang').first();
    if (brandNameEl.length > 0) {
        brandNameSource = brandNameEl.text().trim();
    }


    function processTable(tblBlock) {
        let tableHtml = '';

        // Handle TblCaption
        const caption = tblBlock.find('TblCaption, tblcaption').text().trim();
        if (caption) {
            tableHtml += `<p class="dosage-header fw-bold mb-1">${caption}</p>`;
        }

        tableHtml += '<div class="table-responsive"><table class="dosage-table table table-bordered table-sm">';

        // 1. Try Standard SGML Table
        const table = tblBlock.find('table, Table').first();
        if (table.length > 0) {
            console.log('    DEBUG: Found Standard Table tag');
            // Process Thead
            const thead = table.find('thead, Thead');
            if (thead.length > 0) {
                thead.find('row, Row').each((i, row) => {
                    tableHtml += '<tr>';
                    $(row).find('entry, Entry').each((j, entry) => {
                        const cellText = $(entry).text().trim();
                        const namest = $(entry).attr('namest');
                        const nameend = $(entry).attr('nameend');
                        let colspan = 1;
                        let rowspan = 1;
                        const morerows = $(entry).attr('morerows');
                        if (morerows) rowspan = parseInt(morerows) + 1;
                        if (namest && nameend && namest !== nameend) {
                            colspan = 2; // placeholder
                        }
                        let style = 'style="text-align:center;vertical-align:middle;"';
                        tableHtml += `<td rowspan="${rowspan}" colspan="${colspan}" ${style}>${cellText}</td>`;
                    });
                    tableHtml += '</tr>';
                });
            }

            // Process Tbody
            const tbody = table.find('tbody, Tbody');
            if (tbody.length > 0) {
                tbody.find('row, Row').each((i, row) => {
                    tableHtml += '<tr>';
                    $(row).find('entry, Entry').each((j, entry) => {
                        const cellText = $(entry).text().trim();
                        const morerows = $(entry).attr('morerows');
                        let rowspan = 1;
                        if (morerows) rowspan = parseInt(morerows) + 1;
                        let style = 'style="text-align:left;vertical-align:top;"';
                        tableHtml += `<td rowspan="${rowspan}" ${style}>${cellText}</td>`;
                    });
                    tableHtml += '</tr>';
                });
            }
        }
        // 2. Try SimpleTable (Xofluza style)
        else {
            const simpleTable = tblBlock.find('SimpleTable, simpletable').first();
            if (simpleTable.length > 0) {
                console.log('    DEBUG: Found SimpleTable tag');
                simpleTable.find('SimpTblRow, simptblrow').each((i, row) => {
                    tableHtml += '<tr>';
                    $(row).find('SimpTblCell, simptblcell').each((j, cell) => {
                        const cellEl = $(cell);
                        const cellText = cellEl.text().trim();

                        let rowspan = 1;
                        let colspan = 1;

                        // Check attributes - Xofluza uses 'rspan' and probably 'cspan'
                        const rspan = cellEl.attr('rspan');
                        const cspan = cellEl.attr('cspan');
                        const align = cellEl.attr('align') || 'left';
                        const valign = cellEl.attr('valign') || 'top';

                        if (rspan) rowspan = parseInt(rspan);
                        if (cspan) colspan = parseInt(cspan);

                        let style = `style="text-align:${align};vertical-align:${valign};"`;
                        tableHtml += `<td rowspan="${rowspan}" colspan="${colspan}" ${style}>${cellText}</td>`;
                    });
                    tableHtml += '</tr>';
                });
            } else {
                console.log('    DEBUG: No Table or SimpleTable found in tblblock');
                return '';
            }
        }

        tableHtml += '</table></div>';
        return tableHtml;
    }

    function processItem(item, depth = 0) {
        let itemHtml = '<div class="dosage-item mb-2">';
        const indent = '  '.repeat(depth);
        // console.log(`${indent}Processing item...`);

        // Use contents() to include text nodes and elements
        $(item).contents().each((i, child) => {
            // Handle Text Nodes
            if (child.type === 'text') {
                const text = $(child).text().trim();
                // console.log(`${indent}  Text node: "${text.substring(0, 20)}..."`);
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

            console.log(`${indent}  Tag: ${tagName}`);

            if (tagName === 'item') {
                // Recursive call for Item tags
                itemHtml += processItem(child, depth + 1);
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
                        itemHtml += processItem(listChild, depth + 1);
                    } else if (['header', 'caption', 'head'].includes(lcTag)) {
                        const lcText = $(listChild).text().trim();
                        if (lcText) itemHtml += `<p class="dosage-header fw-bold mb-1">${lcText}</p>`;
                    } else if (lcTag === 'lang') {
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

        // console.log(`${indent}  Item HTML length: ${itemHtml.length}, Clean text length: ${cleanText.length}`);

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
            console.log(`DEBUG: Found DoseAdmin tag: ${$(el).prop('tagName')}`);
            doseAdmin = $(el);
            return false; // Break the loop
        }
    });

    if (!doseAdmin || doseAdmin.length === 0) {
        console.log(`DEBUG: DoseAdmin NOT FOUND for ${code}`);
        // DEBUG: Print all root tags
        const rootTags = [];
        $('*').each((i, el) => {
            if (el.parent === null || el.parent.type === 'root') rootTags.push(el.tagName);
        });
        console.log(`DEBUG: Root tags found: ${rootTags.join(', ')}`);
        return null; // Return null to indicate failure
    }

    // Found InfoDoseAdmin or DoseAdmin.
    // If it's InfoDoseAdmin, check if it has DoseAdmin child.
    const rootTagName = (doseAdmin.prop('tagName') || '').toLowerCase();

    console.log(`DEBUG: Root Tag Name matched: ${rootTagName}`);

    // If it is InfoDoseAdmin, we iterate children to find DoseAdmin or process directly if structure differs
    if (rootTagName === 'infodoseadmin') {
        let hasDoseAdminChild = false;
        doseAdmin.children().each((i, child) => {
            const t = ($(child).prop('tagName') || '').toLowerCase();
            console.log(`DEBUG: InfoDoseAdmin child: ${t}`);
            if (t === 'doseadmin') {
                hasDoseAdminChild = true;
                console.log(`DEBUG: Found nested DoseAdmin`);
                // Process this DoseAdmin child
                $(child).contents().each((j, subChild) => {
                    if (subChild.type === 'tag') {
                        const subChildTag = ($(subChild).prop('tagName') || '').toLowerCase();
                        console.log(`DEBUG: DoseAdmin subChild tag: ${subChildTag}`);
                        if (subChildTag === 'item' || subChildTag === 'detail' || subChildTag === 'simplelist' || subChildTag === 'unorderedlist' || subChildTag === 'orderedlist') {
                            html += processItem(subChild, 0);
                        } else if (subChildTag === 'tblblock' || subChildTag === 'simpletable') {
                            html += processTable($(subChild));
                        } else if (subChildTag === 'paragraph' || subChildTag === 'p' || subChildTag === 'lang') {
                            const text = $(subChild).text().trim();
                            if (text) html += `<p class="dosage-text mb-1">${text}</p>`;
                        }
                    } else if (subChild.type === 'text') {
                        const text = $(subChild).text().trim();
                        // console.log(`DEBUG: DoseAdmin subChild text: "${text.substring(0, 20)}..."`);
                    }
                });
            }
        });

        if (!hasDoseAdminChild) {
            console.log(`DEBUG: No nested DoseAdmin found, processing InfoDoseAdmin children directly`);
            // Fallback: treat InfoDoseAdmin as DoseAdmin (iterate its children)
            doseAdmin.children().each((i, child) => {
                const childTag = ($(child).prop('tagName') || '').toLowerCase();
                if (childTag === 'item') {
                    html += processItem(child, 0);
                } else if (childTag === 'tblblock' || childTag === 'simpletable') {
                    html += processTable($(child));
                } else if (childTag === 'paragraph' || childTag === 'p') {
                    const text = $(child).text().trim();
                    if (text) html += `<p class="dosage-text mb-1">${text}</p>`;
                }
            });
        }
    } else {
        // Root is DoseAdmin
        doseAdmin.children().each((i, child) => {
            const tagName = $(child).prop('tagName').toLowerCase();
            if (tagName === 'item') {
                html += processItem(child);
            } else if (tagName === 'tblblock' || tagName === 'simpletable') {
                html += processTable($(child));
            }
        });
    }

    return { html: html.trim() || null, source: brandNameSource };
}

const RESULTS = {};

for (const target of TARGET_FILES) {
    console.log(`Processing ${target.name} (${target.code})...`);
    try {
        if (!fs.existsSync(target.path)) {
            console.error(`  File not found: ${target.path}`);
            continue;
        }

        const buffer = fs.readFileSync(target.path);
        let xmlContent = '';

        // Simple encoding detection
        const head = buffer.toString('ascii', 0, 100);
        if (head.includes('Shift_JIS') || head.includes('shift_jis') || head.includes('SHIFT-JIS')) {
            console.log('  > Detected Shift_JIS encoding.');
            const decoder = new TextDecoder('shift-jis');
            xmlContent = decoder.decode(buffer);
        } else {
            console.log('  > Assuming UTF-8 encoding.');
            const decoder = new TextDecoder('utf-8');
            xmlContent = decoder.decode(buffer);
        }

        // Strip BOM just in case
        xmlContent = xmlContent.replace(/^\uFEFF/, '');

        // Just to be safe with Cheerio XML parser and encoding declaration
        // We replace the encoding declaration to utf-8 because we have decoded it to JS string (which is UTF-16/UCS-2 effectively, but Cheerio handles it)
        xmlContent = xmlContent.replace(/encoding="Shift_JIS"/i, 'encoding="UTF-8"');

        const result = parseDoseAdmin(xmlContent, target.code);

        if (result && result.html) {
            RESULTS[target.code] = result;
            console.log(`  > Success (${result.html.length} chars) from ${result.source}`);
        } else {
            console.error(`  > Failed to extract dosage content.`);
        }
    } catch (e) {
        console.error(`  > Error: ${e.message}`);
    }
}

// Write result to JS file
// const jsContent = `export default ${JSON.stringify(RESULTS, null, 2)};`;
// const outputJsPath = path.resolve('lab/pediatric-calc/data/dosage_details.js'); 

const outputJsonPath = path.resolve('lab/pediatric-calc/data/manual_dosage_extract.json');
fs.writeFileSync(outputJsonPath, JSON.stringify(RESULTS, null, 2), 'utf8');
console.log(`\nExtraction complete. Saved to ${outputJsonPath}`);

// MERGE LOGIC
const existingJsPath = path.resolve('lab/pediatric-calc/data/dosage_details.js');
let existingData = {};

if (fs.existsSync(existingJsPath)) {
    console.log(`\nMerging with existing ${existingJsPath}...`);
    try {
        const content = fs.readFileSync(existingJsPath, 'utf-8');
        // Extract JSON part from "export default {...};"
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonStr = content.substring(jsonStart, jsonEnd + 1);
            // Function wrapper to safely parse JS object if not pure JSON (though likely JSON-ish)
            // But since previous script wrote it as JSON.stringify, it should be valid JSON
            try {
                existingData = JSON.parse(jsonStr);
                console.log(`  Loaded ${Object.keys(existingData).length} existing records.`);
            } catch (parseErr) {
                console.warn(`  Failed to JSON.parse existing data (might contain JS comments/syntax?): ${parseErr.message}`);
                // Fallback: try eval? (Use with caution)
                existingData = eval(`(${jsonStr})`);
            }
        }
    } catch (readErr) {
        console.error(`  Failed to read existing file: ${readErr.message}`);
    }
}

const mergedData = { ...existingData, ...RESULTS };
const mergedJsContent = `export default ${JSON.stringify(mergedData, null, 4)};`;
fs.writeFileSync(existingJsPath, mergedJsContent, 'utf-8');
console.log(`  Merged and saved ${Object.keys(mergedData).length} records to ${existingJsPath}`);
