import { PHARMA_CLASSIFICATION_MAP } from './lab/pediatric-calc/pharma_classification.js';
import fs from 'fs';
import path from 'path';

function simplifyName(name) {
    let simple = name;

    // 1. Remove details after full-width semicolon
    simple = simple.split('；')[0];

    // 2. Specific replacements for readability
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
        [/主として/g, ''], // Remove "主として" if remaining
        [/に作用するもの/g, '用薬'], // "～に作用するもの" -> "～用薬"
        [/抗生物質製剤/g, '系'], // "ペニシリン系抗生物質製剤" -> "ペニシリン系"
        [/系製剤/g, '系'], // "テトラサイクリン系製剤" -> "テトラサイクリン系"
        [/類製剤/g, '類'],
        [/類$/g, ''], // "ワクチン類" -> "ワクチン"
        [/製剤$/g, ''], // "ジギタリス製剤" -> "ジギタリス"
        [/化合物/g, ''], // "ヨウ素化合物" -> "ヨウ素"
        [/及び/g, '・'],
        [/、/g, '・'],
    ];

    replacements.forEach(([regex, replacement]) => {
        simple = simple.replace(regex, replacement);
    });

    // Clean up "系系" double suffix if it happened
    simple = simple.replace(/系系/g, '系');

    return simple;
}

const lines = [
    '# 薬効分類名 変更案対比表',
    '',
    'ユーザー要望に基づき、正確すぎる（硬い）表現を、薬剤師にとって直感的な表現に簡略化する案を作成しました。',
    '',
    '| コード | 現在の分類名 (Current) | 変更案 (Proposed) | 備考 |',
    '| :--- | :--- | :--- | :--- |'
];

Object.keys(PHARMA_CLASSIFICATION_MAP).sort().forEach(code => {
    const original = PHARMA_CLASSIFICATION_MAP[code];
    const proposed = simplifyName(original);

    // Only show if different? No, user wants to compare.
    // If the proposed is same as original (after semicolon removal), maybe mark it?
    // But let's show all for completeness, or maybe just the ones that changed significantly?
    // List is long (300+).
    // Let's filter to show only changed ones OR significant categories.
    // Showing all is safest for "Present this list" request.

    lines.push(`| ${code} | ${original} | **${proposed}** | |`);
});

const outputPath = path.resolve('docs/classification_review_proposal.md');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`Generated review table at ${outputPath}`);
