
import fs from 'fs';
import path from 'path';

const calcPath = path.resolve('lab/pediatric-calc/calc.js');
const calcContent = fs.readFileSync(calcPath, 'utf8');

const match = calcContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\n\];/);

if (!match) {
    console.error('Could not find PEDIATRIC_DRUGS array in calc.js');
    process.exit(1);
}

const arrayString = '[' + match[1] + ']';
const drugs = eval(arrayString);

console.log(`Loaded ${drugs.length} drugs.`);

const errors = [];

// 1. Check specific drugs for absoluteMaxMgPerDay
const checks = {
    'バナン小児用ドライシロップ10%': 200,
    'セフジトレンピボキシル細粒10%小児用「日医工」': 600,
    'ホスミシンドライシロップ400': 4000,
    'ファロムドライシロップ小児用10%': 900,
    'エリスロシンドライシロップW20%': 1200,
    'クラリスロマイシンDS10%「タカタ」': 400,
    'ムコソルバンDS1.5%': 45,
    'アスベリン散10%': 90,
    'テオドールドライシロップ20%': 400,
    'ザジテンドライシロップ0.1%': 2,
    'オキサトミドDS小児用2％「サワイ」': 60,
    'オノンDS10%': 450
};

// Also check existence of new Meptin and absence of old/bad drugs
const meptinDS = drugs.find(d => d.name === 'メプチンDS0.005%');
if (!meptinDS) errors.push('Missing Meptin DS 0.005%');

const meptinGranule = drugs.find(d => d.name.includes('メプチン顆粒'));
if (meptinGranule) errors.push('Found Meptin Granule (should be removed)');

const azithroJG = drugs.find(d => d.name.includes('アジスロマイシン') && d.name.includes('JG'));
if (azithroJG) errors.push('Found Azithromycin JG (should be removed)');

Object.entries(checks).forEach(([name, limit]) => {
    const drug = drugs.find(d => d.name === name);
    if (!drug) {
        errors.push(`Missing drug: ${name}`);
        return;
    }
    if (drug.dosage.absoluteMaxMgPerDay !== limit) {
        errors.push(`${name}: Expected absoluteMaxMgPerDay ${limit}, got ${drug.dosage.absoluteMaxMgPerDay}`);
    }
});

// Check if all drugs with calcType 'weight' or default have some limit or note explaining it?
// Not strictly required by prompt but good practice.

if (errors.length > 0) {
    console.error('Verification FAILED:');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log('Verification PASSED!');
}
