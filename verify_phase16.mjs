
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find PEDIATRIC_DRUGS"); process.exit(1); }

let PEDIATRIC_DRUGS = (() => {
    try {
        return eval(`[${match[1]}]`);
    } catch (e) {
        console.error("Eval Error:", e);
        process.exit(1);
    }
})();

const errors = [];

// 1. Check PMDA Links (Global)
const badLinks = PEDIATRIC_DRUGS.filter(d => !d.piUrl.includes('/rdDetail/iyaku/') || !d.piUrl.includes('_1?user=1'));
if (badLinks.length > 0) {
    errors.push(`Found ${badLinks.length} drugs with incorrect PMDA URL format (e.g. ${badLinks[0].name}: ${badLinks[0].piUrl})`);
}

// 2. Check Baltrex
const baltrex = PEDIATRIC_DRUGS.find(d => d.brandName === "バルトレックス" || d.name.includes("バルトレックス"));
if (!baltrex) {
    errors.push("Baltrex not found");
} else {
    // Check hsv-init option
    const hsvInit = baltrex.diseases.find(d => d.id === 'val-hsv-init');
    if (!hsvInit) errors.push("Baltrex HSV Init option not found");
    else {
        if (!hsvInit.dosage.isFixed) errors.push("Baltrex HSV Init should be isFixed: true");
        if (hsvInit.dosage.dosePerTime !== 500) errors.push("Baltrex HSV Init dose should be 500");
        if (hsvInit.dosage.minWeight !== 40) errors.push("Baltrex HSV Init minWeight should be 40");
    }
}

// 3. Check Depakene
const depakene = PEDIATRIC_DRUGS.find(d => d.name.includes("デパケン"));
if (!depakene) {
    errors.push("Depakene not found");
} else {
    if (depakene.dosage.minMgKg !== 0) errors.push("Depakene dosage should be disabled (minMgKg: 0)");
    if (!depakene.dosage.note.includes("小児用量の記載なし")) errors.push("Depakene note should mention no pediatric usage");
}

if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: All Phase 16 updates (Links, Baltrex, Depakene) verified.");
}
