
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
const baltrex = PEDIATRIC_DRUGS.find(d => d.brandName === "バルトレックス");
if (!baltrex) {
    errors.push("Baltrex not found");
} else {
    // Should have exactly 2 diseases
    if (baltrex.diseases.length !== 2) {
        errors.push(`Baltrex should have 2 diseases, found ${baltrex.diseases.length}`);
    }
    const hsv = baltrex.diseases.find(d => d.id === 'hsv');
    if (!hsv) errors.push("Baltrex 'hsv' disease not found");
    if (hsv && hsv.label !== '単純ヘルペス') errors.push(`Baltrex HSV label should be '単純ヘルペス', found '${hsv.label}'`);
}

// 2. Check Antibiotics / Pivoxil
const pivoxilCheck = PEDIATRIC_DRUGS.filter(d => d.name.includes("ピボキシル"));
if (pivoxilCheck.length > 0) {
    errors.push(`Found 'Pivoxil' in names: ${pivoxilCheck.map(d => d.name).join(", ")}`);
}

// 3. Check Specific Name Changes
const checks = [
    { search: "Ｌ－ケフレックス／セファレキシン", id: "keflex-group" },
    { search: "オゼックス／トスフロキサシン", id: "ozex-group" },
    { search: "トミロン／セフテラム", id: "yj-6132009C2023" },
    { search: "オラペネム／テビペネム", id: "orapenem-group" },
    { search: "ザジテン／ケトチフェン", id: "yj-4490003R1228" }
];

checks.forEach(c => {
    const found = PEDIATRIC_DRUGS.find(d => d.name === c.search);
    if (!found) {
        errors.push(`Expected name '${c.search}' not found.`);
    }
});

if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: Phase 19 formatting verified.");
}
