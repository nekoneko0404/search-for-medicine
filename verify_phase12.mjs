
import fs from 'fs';
import path from 'path';

const calcPath = path.resolve('lab/pediatric-calc/calc.js');
const calcContent = fs.readFileSync(calcPath, 'utf8');

const match = calcContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\n\];/);
if (!match) {
    console.error('Could not find PEDIATRIC_DRUGS array in calc.js');
    process.exit(1);
}

const drugs = eval('[' + match[1] + ']');
console.log(`Loaded ${drugs.length} drugs.`);

const errors = [];

// 1. Orapenem Check
const orapenem = drugs.find(d => d.id === 'orapenem-group');
if (!orapenem) {
    errors.push('Missing Orapenem');
} else {
    if (!orapenem.name.includes('テビペネム')) errors.push('Orapenem name should include テビペネム');
    if (orapenem.dosage.timeMgKg !== 4) errors.push(`Orapenem timeMgKg expected 4, got ${orapenem.dosage.timeMgKg}`);
    if (orapenem.dosage.timesPerDay !== 2) errors.push(`Orapenem timesPerDay expected 2, got ${orapenem.dosage.timesPerDay}`);
    if (!orapenem.piUrl.includes('rdSearch/01/6139002C1026')) errors.push('Orapenem PMDA URL is wrong');
}

// 2. L-Keflex Check
const keflex = drugs.find(d => d.id === 'keflex-group');
if (!keflex) {
    errors.push('Missing Keflex');
} else {
    if (!keflex.name.includes('Ｌ－ケフレックス')) errors.push('Keflex should be named Ｌ－ケフレックス');
    if (keflex.dosage.absoluteMaxMgPerTime !== 250) errors.push(`L-Keflex absoluteMaxMgPerTime expected 250, got ${keflex.dosage.absoluteMaxMgPerTime}`);
}

// 3. Kipres Check
const kipres = drugs.find(d => d.id === 'montelukast-group');
if (!kipres) {
    errors.push('Missing Kipres');
} else {
    if (kipres.name.includes('（シングレア中止）')) errors.push('Kipres name should not include （シングレア中止）');
}

// 4. UI Header Check
if (!calcContent.includes('drugInfoHeader')) errors.push('calc.js missing drugInfoHeader implementation');
if (!calcContent.includes('1日合計量')) errors.push('calc.js missing 1日合計量 display update');
if (!calcContent.includes('bg-emerald-600')) errors.push('calc.js missing bg-emerald-600 (CSS bug)');

// 5. Anti-allergics timesPerDay Check
const cetirizine = drugs.find(d => d.id === 'cetirizine-group');
if (cetirizine && cetirizine.dosage.timesPerDay !== 2) errors.push('Cetirizine missing timesPerDay: 2');

// 6. PMDA Link Stability Check (Drugs after Kampo)
const drugsAfterKampo = ['zofluza-group', 'orapenem-group', 'magnesium-oxide-group', 'movicol-group', 'transamin-group', 'melatobel-group'];
drugsAfterKampo.forEach(id => {
    const d = drugs.find(drug => drug.id === id);
    if (d && !d.piUrl.includes('rdSearch/01/')) {
        errors.push(`${d.name} should use rdSearch/01/ for stability.`);
    }
});

if (errors.length > 0) {
    console.error('Phase 12 Verification FAILED:');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log('Phase 12 Verification PASSED!');
}
