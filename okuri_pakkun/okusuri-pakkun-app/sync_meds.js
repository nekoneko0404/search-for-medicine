const fs = require('fs');
const path = require('path');

const MASTER_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\okuri_pakkun\\okusuri-pakkun-app\\public\\meds_master.json';
const CALC_JS_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\lab\\pediatric-calc\\calc.js';

const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

// 既存のcalc.jsから薬剤データを抽出
const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf8');
const drugArrayMatch = calcJsContent.match(/const PEDIATRIC_DRUGS = (\[[\s\S]*?\]);/);
if (!drugArrayMatch) {
    console.error('PEDIATRIC_DRUGS not found in calc.js');
    process.exit(1);
}

const drugBlocks = [];
let braceCount = 0;
let currentBlock = '';
const drugArrayStr = drugArrayMatch[1];

for (let i = 0; i < drugArrayStr.length; i++) {
    const char = drugArrayStr[i];
    if (char === '{') {
        if (braceCount === 0) currentBlock = '';
        braceCount++;
    }
    if (braceCount > 0) currentBlock += char;
    if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
            drugBlocks.push(currentBlock);
        }
    }
}

const existingDrugsMap = {};
drugBlocks.forEach(block => {
    const nameMatch = block.match(/name:\s*"(.*?)"/);
    if (nameMatch) {
        existingDrugsMap[nameMatch[1]] = block;
    }
});

function normalizeName(name) {
    return name.replace(/[％%]/g, '%').replace(/[（(].*?[）)]/g, '').trim();
}

const newPEDIATRIC_DRUGS = masterData.map(m => {
    let existingBlock = existingDrugsMap[m.brand_name];
    if (!existingBlock) {
        const keys = Object.keys(existingDrugsMap);
        const nearMatchKey = keys.find(k => normalizeName(k) === normalizeName(m.brand_name));
        if (nearMatchKey) existingBlock = existingDrugsMap[nearMatchKey];
    }

    if (existingBlock) {
        let updatedBlock = existingBlock;
        updatedBlock = updatedBlock.replace(/name:\s*".*?"/, `name: "${m.brand_name}"`);
        updatedBlock = updatedBlock.replace(/yjCode:\s*".*?"/, `yjCode: "${m.yj_code}"`);
        updatedBlock = updatedBlock.replace(/piUrl:\s*".*?"/, `piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${m.yj_code}?user=1"`);
        return updatedBlock;
    } else {
        const id = m.brand_name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-master';
        let potency = 100;
        if (m.brand_name.includes('10%')) potency = 100;
        else if (m.brand_name.includes('20%')) potency = 200;
        else if (m.brand_name.includes('50%')) potency = 500;
        else if (m.brand_name.includes('5%')) potency = 50;

        return `{
        id: "${id}",
        name: "${m.brand_name}",
        yjCode: "${m.yj_code}",
        potency: ${potency},
        dosage: { minMgKg: 0, maxMgKg: 0, note: "用量データ未設定" },
        piSnippet: "${m.special_notes.replace(/"/g, '\\"')}",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${m.yj_code}?user=1"
    }`;
    }
});

const finalContent = calcJsContent.replace(/const PEDIATRIC_DRUGS = \[[\s\S]*?\];/, `const PEDIATRIC_DRUGS = [\n    ${newPEDIATRIC_DRUGS.join(',\n    ')}\n];`);

fs.writeFileSync(CALC_JS_PATH, finalContent, 'utf8');
console.log('Synchronization complete.');
