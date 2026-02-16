const fs = require('fs');
const CALC_JS_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\lab\\pediatric-calc\\calc.js';

let content = fs.readFileSync(CALC_JS_PATH, 'utf8');

const mapping = {
    'オセルタミビル': 'tamiflu-ds',
    'セフカペン': 'flomox-ds',
    'セフジトレン': 'meiact-ms',
    'モンテルカスト': 'singulair-fine',
    'アジスロマイシン': 'zithromac-ds',
    'クラリスロマイシン': 'claris-takata',
    'セチリジン': 'zyrtec-ds',
    'ツロブテロール': 'hokunalin-ds',
    'フェキソフェナジン': 'allegra-ds',
    'ロラタジン': 'clara-ds',
    'カルボシステイン': 'mucodyne-ds',
    'アンブロキソール': 'mucodyne-ds', // 実際はムコソルバンだが、とりあえず去痰剤として
    'プランルカスト': 'onon-ds'
};

// 既存の薬剤ブロックを抽出
const drugBlocks = [];
let braceCount = 0;
let currentBlock = '';
const drugArrayMatch = content.match(/const PEDIATRIC_DRUGS = (\[[\s\S]*?\]);/);
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

// 参照用の辞書作成
const drugsById = {};
drugBlocks.forEach(block => {
    const idMatch = block.match(/id:\s*"(.*?)"/);
    if (idMatch) drugsById[idMatch[1]] = block;
});

const updatedBlocks = drugBlocks.map(block => {
    const nameMatch = block.match(/name:\s*"(.*?)"/);
    const idMatch = block.match(/id:\s*"(.*?)"/);
    const dosageMatch = block.match(/dosage:\s*\{\s*minMgKg:\s*0/);

    if (!nameMatch || !idMatch) return block;

    const name = nameMatch[1];
    let id = idMatch[1];
    let newBlock = block;

    // IDを綺麗にする
    if (id.includes('master')) {
        let cleanId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (cleanId === '') cleanId = 'drug-' + Math.random().toString(36).substr(2, 5);
        newBlock = newBlock.replace(`id: "${id}"`, `id: "${cleanId}"`);
        id = cleanId;
    }

    // 用量継承
    if (dosageMatch) {
        for (const [ingredient, sourceId] of Object.entries(mapping)) {
            if (name.includes(ingredient) && drugsById[sourceId]) {
                const sourceBlock = drugsById[sourceId];
                // dosage, potency, calcType, fixedDoses, weightSteps, hasSubOptions, subOptions 等をコピー
                // 簡易的に正規表現で抜き出して置換
                const propsToCopy = ['dosage', 'potency', 'calcType', 'fixedDoses', 'weightSteps', 'hasSubOptions', 'subOptions', 'unit', 'adultDose'];
                propsToCopy.forEach(prop => {
                    const regex = new RegExp(prop + ':\\s*([\\s\\S]*?)(?=,\\s*\\w+:|\\s*\\})');
                    const sourceMatch = sourceBlock.match(regex);
                    if (sourceMatch) {
                        const targetRegex = new RegExp(prop + ':\\s*([\\s\\S]*?)(?=,\\s*\\w+:|\\s*\\})');
                        if (newBlock.match(targetRegex)) {
                            newBlock = newBlock.replace(targetRegex, `${prop}: ${sourceMatch[1]}`);
                        } else {
                            // プロパティがない場合は挿入（idの後に）
                            newBlock = newBlock.replace(/(id:\s*".*?",)/, `$1\n        ${prop}: ${sourceMatch[1]},`);
                        }
                    }
                });
                break;
            }
        }
    }

    return newBlock;
});

const finalContent = content.replace(/const PEDIATRIC_DRUGS = \[[\s\S]*?\];/, `const PEDIATRIC_DRUGS = [\n    ${updatedBlocks.join(',\n    ')}\n];`);
fs.writeFileSync(CALC_JS_PATH, finalContent, 'utf8');
console.log('Fixed and inherited dosages.');
