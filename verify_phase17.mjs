
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find PEDIATRIC_DRUGS"); process.exit(1); }

let PEDIATRIC_DRUGS;
try {
    PEDIATRIC_DRUGS = eval(`[${match[1]}]`);
} catch (e) {
    console.error("Eval Error:", e);
    process.exit(1);
}

const errors = [];

// 1. Check Baltrex
const baltrex = PEDIATRIC_DRUGS.find(d => d.brandName === "バルトレックス" || d.name.includes("バルトレックス"));
if (!baltrex) {
    errors.push("Baltrex not found");
} else {
    // Check hsv-init
    const hsvInit = baltrex.diseases.find(d => d.id === 'val-hsv-init');
    if (hsvInit.dosage.isFixed) errors.push("Baltrex HSV Init should NOT be isFixed: true");
    if (hsvInit.dosage.timeMgKg !== 25) errors.push("Baltrex HSV Init timeMgKg should be 25");
    if (hsvInit.dosage.absoluteMaxMgPerTime !== 500) errors.push("Baltrex HSV Init absoluteMaxMgPerTime should be 500");
}

// 2. Check Depakene (Should be gone)
const depakene = PEDIATRIC_DRUGS.find(d => d.name.includes("デパケン"));
if (depakene) {
    errors.push("Depakene should be removed but was found.");
}

// 3. Check Movicol (Label and Link)
const movicol = PEDIATRIC_DRUGS.find(d => d.brandName === "モビコール");
if (!movicol) {
    errors.push("Movicol not found");
} else {
    if (!movicol.piUrl.includes('rdSearch/02')) errors.push("Movicol PI URL incorrect: " + movicol.piUrl);
    const ldLabel = movicol.fixedDoses[0].label;
    if (!ldLabel.includes("(LD)") || !ldLabel.includes("(HD)")) errors.push("Movicol label should mention LD/HD: " + ldLabel);
}

// 4. Check Nauzerin Logic (Static check of code)
// We cannot run calculateDosage easily here, but we can check if the code modification exists.
if (!calcJsContent.includes("const doseMgKg = info.timeMgKg || (info.minMgKg / (info.timesPerDay || 3));")) {
    errors.push("Nauzerin logic fix (fallback for doseMgKg) not found in calc.js");
}

if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: Phase 17 updates verified.");
}
