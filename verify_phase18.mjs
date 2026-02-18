
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find PEDIATRIC_DRUGS"); process.exit(1); }

let PEDIATRIC_DRUGS;
try {
    PEDIATRIC_DRUGS = eval(`[${match[1]}]`);
    console.log(`Successfully parsed calc.js. Found ${PEDIATRIC_DRUGS.length} drugs.`);
} catch (e) {
    console.error("Eval Error (Syntax Check Failed):", e);
    process.exit(1);
}

const errors = [];

// 1. Check PMDA Links Format (All should be rdSearch/02 format)
const badLinks = PEDIATRIC_DRUGS.filter(d => !d.piUrl.includes('rdSearch/02/') || !d.piUrl.includes('?user=1'));
if (badLinks.length > 0) {
    errors.push(`Found ${badLinks.length} drugs with incorrect PMDA URL format (Expected rdSearch/02).`);
    badLinks.slice(0, 3).forEach(d => errors.push(`- ${d.name}: ${d.piUrl}`));
}

// 2. Check if YJ Codes are generally valid (12 digits mostly)
const badYJ = PEDIATRIC_DRUGS.filter(d => !d.yjCode || d.yjCode.length < 9); // YJ is usually 12, but shortened often exist.
if (badYJ.length > 0) {
    errors.push(`Found ${badYJ.length} drugs with potentially invalid YJ Codes.`);
    badYJ.slice(0, 3).forEach(d => errors.push(`- ${d.name}: ${d.yjCode}`));
}

if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: calc.js syntax is valid and links are formatted correctly.");
}
