
import fs from 'fs';
import path from 'path';

const calcJsPath = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const calcJsContent = fs.readFileSync(calcJsPath, 'utf-8');

// Mock PEDIATRIC_DRUGS
const PHARMA_CLASSIFICATION_MAP = {};
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) { console.error("Could not find drugs information"); process.exit(1); }

const PEDIATRIC_DRUGS = (() => {
    try {
        return eval(`[${match[1]}]`);
    } catch (e) {
        console.error("Eval Error:", e);
        console.error("Partial Content:", match[1].substring(0, 500) + "...");
        process.exit(1);
    }
})();
const errors = [];

// 1. Meptin (DS 0.005%)
const meptin = PEDIATRIC_DRUGS.find(d => d.id === 'meptin-group');
if (!meptin) errors.push("Meptin group not found");
else {
    if (meptin.yjCode !== '2259004R2024') errors.push(`Meptin YJ Code Incorrect: ${meptin.yjCode}`);
    if (meptin.potency !== 0.05) errors.push(`Meptin Potency Incorrect: ${meptin.potency}`);
    if (!meptin.piUrl.includes('rdSearch/01/')) errors.push(`Meptin PI URL Format Incorrect: ${meptin.piUrl}`);
}

// 2. Oxatomide (DS 2%)
const oxatomide = PEDIATRIC_DRUGS.find(d => d.id === 'oxatomide-group');
if (!oxatomide) errors.push("Oxatomide group not found (check ID update)");
else {
    if (oxatomide.yjCode !== '4490005R1430') errors.push(`Oxatomide YJ Code Incorrect: ${oxatomide.yjCode}`);
    if (!oxatomide.piUrl.includes('rdSearch/01/')) errors.push(`Oxatomide PI URL Format Incorrect: ${oxatomide.piUrl}`);
}

// 3. Keflex (Child Granule)
const keflex = PEDIATRIC_DRUGS.find(d => d.id === 'keflex-group');
if (keflex.yjCode !== '6132002E1034') errors.push(`Keflex YJ Code Incorrect: ${keflex.yjCode}`);
if (!keflex.piUrl.includes('rdSearch/01/')) errors.push(`Keflex PI URL Format Incorrect: ${keflex.piUrl}`);

// 4. Ozex (Fine Granule 15%)
const ozex = PEDIATRIC_DRUGS.find(d => d.id === 'ozex-group');
if (ozex.yjCode !== '6241010C1024') errors.push(`Ozex YJ Code Incorrect: ${ozex.yjCode}`);
if (!ozex.piUrl.includes('rdSearch/01/')) errors.push(`Ozex PI URL Format Incorrect: ${ozex.piUrl}`);

// 5. Yokukansan (Typo Fix)
const yokukansan = PEDIATRIC_DRUGS.find(d => (d.brandName && d.brandName.includes('抑肝散')) || d.name.includes('抑肝散'));
if (yokukansan.yjCode !== '5200139D1037') errors.push(`Yokukansan YJ Code Incorrect: ${yokukansan.yjCode}`);
if (!yokukansan.piUrl.includes('rdSearch/01/')) errors.push(`Yokukansan PI URL Format Incorrect: ${yokukansan.piUrl}`);

// 6. Magnesium Oxide (Fine Granule 83%)
const mag = PEDIATRIC_DRUGS.find(d => d.id === 'magnesium-oxide-group');
if (mag.yjCode !== '2344009C1039') errors.push(`Magnesium Oxide YJ Code Incorrect: ${mag.yjCode}`);
if (mag.potency !== 830) errors.push(`Magnesium Oxide Potency Incorrect: ${mag.potency}`);
if (!mag.piUrl.includes('rdSearch/01/')) errors.push(`Magnesium Oxide PI URL Format Incorrect: ${mag.piUrl}`);


if (errors.length > 0) {
    console.error("Verification FAILED with errors:");
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
} else {
    console.log("Verification PASSED: All Phase 15 updates verified successfully.");
}
