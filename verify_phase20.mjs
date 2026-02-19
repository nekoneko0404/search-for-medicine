
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

// Check Keflex
const keflex = PEDIATRIC_DRUGS.find(d => d.id === 'keflex-group');
if (!keflex) {
    errors.push("Keflex (keflex-group) not found");
} else {
    // Check main dosage (Standard default)
    if (keflex.dosage.timesPerDay !== 2) errors.push(`Keflex timesPerDay should be 2, found ${keflex.dosage.timesPerDay}`);
    if (keflex.dosage.maxMgKg !== 50) errors.push(`Keflex default maxMgKg should be 50, found ${keflex.dosage.maxMgKg}`);

    // Check diseases
    if (!keflex.diseases || keflex.diseases.length !== 2) {
        errors.push(`Keflex should have 2 diseases, found ${keflex.diseases?.length}`);
    } else {
        const standard = keflex.diseases.find(d => d.id === 'keflex-standard');
        const severe = keflex.diseases.find(d => d.id === 'keflex-severe');

        if (!standard) errors.push("Keflex 'keflex-standard' missing");
        if (!severe) errors.push("Keflex 'keflex-severe' missing");

        if (severe) {
            if (severe.dosage.minMgKg !== 50) errors.push(`Severe minMgKg should be 50, found ${severe.dosage.minMgKg}`);
            if (severe.dosage.maxMgKg !== 100) errors.push(`Severe maxMgKg should be 100, found ${severe.dosage.maxMgKg}`);
            if (severe.dosage.absoluteMaxMgPerDay !== 2000) errors.push(`Severe absoluteMaxMgPerDay should be 2000, found ${severe.dosage.absoluteMaxMgPerDay}`);
        }
    }
}

if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: Keflex phase 20 updates verified.");
}
