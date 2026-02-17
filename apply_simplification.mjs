import { PHARMA_CLASSIFICATION_MAP } from './lab/pediatric-calc/pharma_classification.js';
import fs from 'fs';
import path from 'path';

function simplifyName(name) {
    if (!name) return '';
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

const newMap = {};
Object.keys(PHARMA_CLASSIFICATION_MAP).sort().forEach(code => {
    newMap[code] = simplifyName(PHARMA_CLASSIFICATION_MAP[code]);
});

// Generate file content
const fileContent = `export const PHARMA_CLASSIFICATION_MAP = {
${Object.keys(newMap).map(key => `    "${key}": "${newMap[key]}"`).join(',\n')}
};
`;

const destPath = path.resolve('lab/pediatric-calc/pharma_classification.js');
fs.writeFileSync(destPath, fileContent, 'utf8');

console.log(`Updated pharma_classification.js with simplified names.`);
