import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calcJsPath = `${__dirname}/calc.js`;
const content = fs.readFileSync(calcJsPath, 'utf8');

// モック環境の構築
const dom = {
    elements: {
        'drug-cards-container': { innerHTML: '' },
        'calc-main-area': { classList: { remove: (c) => console.log(`Remove hidden from calc-main-area`), add: (c) => { } } },
        'empty-state-side': { classList: { remove: (c) => { }, add: (c) => console.log(`Add hidden to empty-state-side`) } },
        'initial-guide': { classList: { remove: (c) => { }, add: (c) => console.log(`Add hidden to initial-guide`) } },
        'sub-option-area': { classList: { remove: (c) => { }, add: (c) => { } } },
        'disease-area': { classList: { remove: (c) => { }, add: (c) => { } } },
        'age': { value: '5', closest: (s) => ({ classList: { add: (c) => { }, remove: (c) => { } } }) },
        'body-weight': { value: '15', closest: (s) => ({ classList: { add: (c) => { }, remove: (c) => { } } }) },
        'pi-container': { innerHTML: '' },
        'result-area': { innerHTML: '' },
        'sub-option-container': { innerHTML: '' },
        'disease-container': { innerHTML: '' }
    },
    getElementById(id) {
        return this.elements[id] || { classList: { add: () => { }, remove: () => { }, contains: () => false }, closest: () => ({ classList: { add: () => { }, remove: () => { } } }), innerHTML: '' };
    },
    querySelectorAll(s) { return []; },
    addEventListener(e, f) { if (e === 'DOMContentLoaded') f(); }
};

// calc.js を実行するために、ブラウザ環境の変数をグローバルに
global.document = dom;
global.window = { addEventListener: () => { } };

try {
    // import/export を取り除いて eval 可能にする
    const code = content
        .replace(/import .* from .*/g, '')
        .replace(/export /g, '');

    // PEDIATRIC_DRUGS, selectDrug などを抽出
    const script = new Function('console', `
        ${code}
        return { PEDIATRIC_DRUGS, selectDrug, updateCalculations };
    `)(console);

    const { PEDIATRIC_DRUGS, selectDrug } = script;
    console.log(`Parsed ${PEDIATRIC_DRUGS.length} drugs.`);

    // テスト: 最初の薬剤を選択
    if (PEDIATRIC_DRUGS.length > 0) {
        const drug = PEDIATRIC_DRUGS[0];
        console.log(`Testing selectDrug index 0: ${drug.name}`);
        selectDrug(drug.id, 0);
        console.log('SUCCESS: selectDrug matched and executed.');
    }

    // テスト: ナウゼリン (Phase 11 修正)
    const domperidone = PEDIATRIC_DRUGS.find(d => d.id === 'yj-2399005R1163');
    if (domperidone) {
        console.log(`Testing selectDrug for Domperidone: ${domperidone.name}`);
        selectDrug(domperidone.id, PEDIATRIC_DRUGS.indexOf(domperidone));
    }

    console.log('Simulation complete - No fatal errors detected.');
} catch (e) {
    console.error('ERROR during simulation:', e.stack);
    process.exit(1);
}
