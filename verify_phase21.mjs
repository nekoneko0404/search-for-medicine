
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

// 1. Ozex
const ozex = PEDIATRIC_DRUGS.find(d => d.id === 'ozex-group');
if (!ozex) {
    errors.push("Ozex not found");
} else {
    if (ozex.dosage.absoluteMaxMgPerDay !== 360) errors.push(`Ozex max/day should be 360, found ${ozex.dosage.absoluteMaxMgPerDay}`);
    if (ozex.dosage.absoluteMaxMgPerTime !== 180) errors.push(`Ozex max/time should be 180, found ${ozex.dosage.absoluteMaxMgPerTime}`);
    if (!ozex.piSnippet.includes("1回180mg")) errors.push("Ozex PI snippet missing 180mg ref");
}

// 2. Name Checks
const nameChecks = [
    { id: "yj-1139010R1020", expected: "イーケプラ／レベチラセタム" },
    { id: "yj-4413004C2022", expected: "ゼスラン／ニポラジン" },
    { id: "yj-2251001D1061", expected: "テオドール／テオフィリン" }
];

nameChecks.forEach(nc => {
    const drug = PEDIATRIC_DRUGS.find(d => d.id === nc.id);
    if (!drug) {
        errors.push(`Drug ${nc.id} not found`);
    } else if (drug.name !== nc.expected) {
        errors.push(`Drug ${nc.id} name mismatch. Expected '${nc.expected}', found '${drug.name}'`);
    }
});

if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: Phase 21 updates verified.");
}
