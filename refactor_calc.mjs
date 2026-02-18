
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
let content = fs.readFileSync(CALC_JS_PATH, 'utf-8');

// robust extraction using bracket counting
const startIndex = content.indexOf('const PEDIATRIC_DRUGS = [');
if (startIndex === -1) {
    console.error("Could not find start of PEDIATRIC_DRUGS");
    process.exit(1);
}

let openBrackets = 0;
let endIndex = -1;
let foundStart = false;
let inString = false;
let stringChar = '';
let inComment = false; // simple line comment check might be needed

// Find the opening '['
const arrayStartCharIndex = content.indexOf('[', startIndex);

for (let i = arrayStartCharIndex; i < content.length; i++) {
    const char = content[i];

    if (inString) {
        if (char === stringChar && content[i - 1] !== '\\') {
            inString = false;
        }
        continue;
    }

    if (char === '"' || char === "'" || char === "`") {
        inString = true;
        stringChar = char;
        continue;
    }

    if (char === '[') {
        openBrackets++;
        foundStart = true;
    } else if (char === ']') {
        openBrackets--;
        if (foundStart && openBrackets === 0) {
            endIndex = i;
            break;
        }
    }
}

if (endIndex === -1) {
    console.error("Could not find end of PEDIATRIC_DRUGS array (unbalanced brackets).");
    process.exit(1);
}

// Extraction
const beforeArray = content.substring(0, startIndex);
// Include the variable declaration part
const arrayDecl = content.substring(startIndex, arrayStartCharIndex);
const arrayContent = content.substring(arrayStartCharIndex, endIndex + 1);
const afterArray = content.substring(endIndex + 1); // everything after ];

let drugs;
try {
    drugs = eval(arrayContent);
} catch (e) {
    console.error("Failed to eval extracted array:", e);
    fs.writeFileSync('debug_array_dump.js', arrayContent);
    console.error("Dumped extracted content to debug_array_dump.js");
    process.exit(1);
}

// --- Reorganization Logic (Same as before) ---

const CATEGORIES = {
    ANTIBIOTICS: 'antibiotics',
    ANTIVIRAL: 'antiviral',
    RESPIRATORY: 'respiratory',
    ALLERGY: 'allergy',
    CNS: 'cns',
    ANTIPYRETIC: 'antipyretic',
    GI: 'gi',
    OTHERS: 'others'
};

const CATEGORY_LABELS = {
    [CATEGORIES.ANTIBIOTICS]: '抗生剤',
    [CATEGORIES.ANTIVIRAL]: '抗ウイルス',
    [CATEGORIES.RESPIRATORY]: '呼吸器・鎮咳',
    [CATEGORIES.ALLERGY]: '抗アレルギー',
    [CATEGORIES.CNS]: '神経・てんかん',
    [CATEGORIES.ANTIPYRETIC]: '解熱鎮痛',
    [CATEGORIES.GI]: '消化器・整腸',
    [CATEGORIES.OTHERS]: 'その他・漢方'
};

const SORT_ORDER = [
    // --- 1. Antibiotics ---
    "amoxicillin-group", "yj-6131008C1033", "yj-6139100R1036",
    "yj-6132005C1053", "yj-6132009C2023", "yj-6132011R1078",
    "yj-6132013C1031", "yj-6132015C1103", "yj-6132016C1027",
    "keflex-group",
    "yj-6135001R2110", "yj-6139001R1032", "orapenem-group",
    "yj-6141001R2053", "clarith-group", "azithromycin-group",
    "yj-6152005D1094",
    "ozex-group",

    // --- 2. Anti-virals ---
    "yj-6250002D1024", "yj-6250019D1020",
    "tamiflu-group", "zofluza-group", "inavir-group", "relenza-group",

    // --- 3. Respiratory ---
    "medicon-group", "carbocisteine-group", "yj-2239001Q1166", "asverin-group",
    "yj-2251001D1061", "meptin-group", "yj-2259002R1061",

    // --- 4. Allergy ---
    "yj-4413004C2022", "yj-4419002B1033", "yj-4419005B1045",
    "yj-4490003R1228", "oxatomide-group", "yj-4490017R1033",
    "cetirizine-group", "yj-4490023R2027", "yj-4490025D1022",
    "montelukast-group", "yj-4490027R1029", "yj-4490028Q1028",

    // --- 5. CNS ---
    "yj-1139010R1020", "melatobel-group",

    // --- 6. Antipyretic ---
    "acetaminophen-group",

    // --- 7. GI ---
    "yj-2316004B1036", "yj-2316009C1026", "yj-2316014B1030",
    "yj-2399005R1163", "magnesium-oxide-group", "movicol-group",

    // --- 8. Others ---
    "yj-3222012Q1030", "transamin-group",
    "yj-5200013D1123", "yj-5200072D1058", "yj-5200139D1037"
];

const ID_TO_CATEGORY = {};
const sections = [
    { cat: CATEGORIES.ANTIBIOTICS, ids: ["amoxicillin-group", "yj-6131008C1033", "yj-6139100R1036", "yj-6132005C1053", "yj-6132009C2023", "yj-6132011R1078", "yj-6132013C1031", "yj-6132015C1103", "yj-6132016C1027", "keflex-group", "yj-6135001R2110", "yj-6139001R1032", "orapenem-group", "yj-6141001R2053", "clarith-group", "azithromycin-group", "yj-6152005D1094", "ozex-group"] },
    { cat: CATEGORIES.ANTIVIRAL, ids: ["yj-6250002D1024", "yj-6250019D1020", "tamiflu-group", "zofluza-group", "inavir-group", "relenza-group"] },
    { cat: CATEGORIES.RESPIRATORY, ids: ["medicon-group", "carbocisteine-group", "yj-2239001Q1166", "asverin-group", "yj-2251001D1061", "meptin-group", "yj-2259002R1061"] },
    { cat: CATEGORIES.ALLERGY, ids: ["yj-4413004C2022", "yj-4419002B1033", "yj-4419005B1045", "yj-4490003R1228", "oxatomide-group", "yj-4490017R1033", "cetirizine-group", "yj-4490023R2027", "yj-4490025D1022", "montelukast-group", "yj-4490027R1029", "yj-4490028Q1028"] },
    { cat: CATEGORIES.CNS, ids: ["yj-1139010R1020", "melatobel-group"] },
    { cat: CATEGORIES.ANTIPYRETIC, ids: ["acetaminophen-group"] },
    { cat: CATEGORIES.GI, ids: ["yj-2316004B1036", "yj-2316009C1026", "yj-2316014B1030", "yj-2399005R1163", "magnesium-oxide-group", "movicol-group"] },
    { cat: CATEGORIES.OTHERS, ids: ["yj-3222012Q1030", "transamin-group", "yj-5200013D1123", "yj-5200072D1058", "yj-5200139D1037"] }
];

sections.forEach(sec => {
    sec.ids.forEach(id => ID_TO_CATEGORY[id] = sec.cat);
});

const drugMap = new Map(drugs.map(d => [d.id, d]));
const newDrugs = [];

// Add sorted drugs
SORT_ORDER.forEach(id => {
    const drug = drugMap.get(id);
    if (drug) {
        drug.category = ID_TO_CATEGORY[id] || CATEGORIES.OTHERS;
        newDrugs.push(drug);
        drugMap.delete(id);
    } else {
        console.warn(`Drug ID ${id} defined in SORT_ORDER but not found in calc.js`);
    }
});

// Add remaining drugs
if (drugMap.size > 0) {
    console.warn("Found drugs not in SORT_ORDER, appending to OTHERS:", Array.from(drugMap.keys()));
    drugMap.forEach(drug => {
        drug.category = CATEGORIES.OTHERS;
        newDrugs.push(drug);
    });
}

// Format Output
let newArrayStr = JSON.stringify(newDrugs, null, 4);
newArrayStr = newArrayStr.replace(/"(\w+)":/g, '$1:');

const categoryDefStr = `\nexport const DRUG_CATEGORIES = ${JSON.stringify(CATEGORY_LABELS, null, 4).replace(/"(\w+)":/g, '$1:')};\n\n`;

// Reconstruct file
// Note: 'beforeArray' ends right before "const PEDIATRIC_DRUGS = ["
// 'arrayDecl' is "const PEDIATRIC_DRUGS = "
// 'endIndex' is the index of ']'
// 'afterArray' starts after ']' (which includes the semicolon usually)

// Wait, loop stops at closing ']', so afterArray starts at `]` + 1. 
// If there is a semicolon, it's in afterArray.
// We should check if next char is semicolon.
let finalAfter = afterArray;
if (finalAfter.trim().startsWith(';')) {
    // If we replace the array, we must ensure we have a semicolon if needed, or rely on existing one.
    // The original code was `const PEDIATRIC_DRUGS = [ ... ];`
    // My script outputs `const PEDIATRIC_DRUGS = [ ... ]` (from JSON.stringify).
    // So I need to add `;` if I construct it manually.
    // But `afterArray` might contain the semicolon.
    // Let's safe-check.
}

const newContent =
    beforeArray +
    categoryDefStr +
    "const PEDIATRIC_DRUGS = " +
    newArrayStr +
    finalAfter; // finalAfter starts after ']'

fs.writeFileSync(CALC_JS_PATH, newContent, 'utf-8');
console.log("calc.js refactored successfully.");
