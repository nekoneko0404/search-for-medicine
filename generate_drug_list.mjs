import { PHARMA_CLASSIFICATION_MAP } from './lab/pediatric-calc/pharma_classification.js';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function simplifyName(name) {
    if (!name) return '';
    let simple = name;

    // 1. Remove details after full-width semicolon
    simple = simple.split('；')[0];

    // 2. Specific replacements for readability (Same logic as generate_review_table.mjs)
    const replacements = [
        [/副腎皮質ホルモン製剤/g, 'ステロイド'],
        [/解熱鎮痛消炎剤/g, '解熱鎮痛薬'],
        [/鎮咳去痰剤/g, '鎮咳去痰薬'],
        [/鎮咳剤/g, '鎮咳薬'],
        [/去痰剤/g, '去痰薬'],
        [/主としてカビに作用するもの/g, '抗真菌薬'],
        [/主としてグラム陽性菌に作用するもの/g, 'グラム陽性菌用薬'],
        [/主としてグラム陰性菌に作用するもの/g, 'グラム陰性菌用薬'],
        [/主としてグラム陽性・陰性菌に作用するもの/g, 'グラム陽性・陰性菌用薬'],
        [/主として/g, ''],
        [/に作用するもの/g, '用薬'],
        [/抗生物質製剤/g, '系'],
        [/系製剤/g, '系'],
        [/類製剤/g, '類'],
        [/類$/g, ''],
        [/製剤$/g, ''],
        [/化合物/g, ''],
        [/及び/g, '・'],
        [/、/g, '・'],
    ];

    replacements.forEach(([regex, replacement]) => {
        simple = simple.replace(regex, replacement);
    });

    // Clean up "系系" double suffix
    simple = simple.replace(/系系/g, '系');

    return simple;
}

// Read calc.js to extract PEDIATRIC_DRUGS
const calcJsPath = path.resolve('lab/pediatric-calc/calc.js');
const calcJsContent = fs.readFileSync(calcJsPath, 'utf8');

// Extract the PEDIATRIC_DRUGS array definition
// Looking for "const PEDIATRIC_DRUGS = [" until the matching closing bracket or semicolon
// Since it's a valid JS file, we can try to find the start and end of the array.
// Simplest way: find "const PEDIATRIC_DRUGS =" and match the array block.
const match = calcJsContent.match(/const\s+PEDIATRIC_DRUGS\s*=\s*(\[[\s\S]*?\]);/);

if (!match) {
    console.error('Could not find PEDIATRIC_DRUGS in calc.js');
    process.exit(1);
}

const drugsSource = match[1];
const sandbox = {};
let pediatricDrugs = [];

try {
    pediatricDrugs = vm.runInNewContext(`(${drugsSource})`, sandbox);
} catch (e) {
    console.error('Error parsing PEDIATRIC_DRUGS:', e);
    process.exit(1);
}

const lines = [
    '# 登録医薬品 3桁・4桁分類一覧',
    '',
    '現在ツールに登録されている医薬品の、3桁分類および4桁分類（簡略名称版）の一覧です。',
    '',
    '| 薬剤名 | 3桁分類 (大分類) | 4桁分類 (詳細分類) |',
    '| :--- | :--- | :--- |'
];

pediatricDrugs.forEach(drug => {
    if (!drug.yjCode) return;
    const code = drug.yjCode.replace('yj-', '');
    const p3 = code.substring(0, 3);
    const p4 = code.substring(0, 4);

    const name3 = PHARMA_CLASSIFICATION_MAP[p3] || '不明';
    const name4 = PHARMA_CLASSIFICATION_MAP[p4] || '不明';

    const simple3 = simplifyName(name3);
    const simple4 = simplifyName(name4);

    lines.push(`| ${drug.name} | ${simple3} (${p3}) | ${simple4} (${p4}) |`);
});

const outputPath = path.resolve('docs/registered_drugs_classification.md');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`Generated registered drugs classification list at ${outputPath}`);
