
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
let content = fs.readFileSync(CALC_JS_PATH, 'utf-8');

// Robust extraction logic (same as refactor script)
const startIndex = content.indexOf('const PEDIATRIC_DRUGS = [');
if (startIndex === -1) { console.error("Could not find start"); process.exit(1); }

let openBrackets = 0;
let endIndex = -1;
let foundStart = false;
let inString = false;
let stringChar = '';

const arrayStartCharIndex = content.indexOf('[', startIndex);

for (let i = arrayStartCharIndex; i < content.length; i++) {
    const char = content[i];
    if (inString) {
        if (char === stringChar && content[i - 1] !== '\\') inString = false;
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

const arrayContent = content.substring(arrayStartCharIndex, endIndex + 1);
let drugs;
try {
    drugs = eval(arrayContent);
} catch (e) {
    console.error("Eval failed:", e);
    process.exit(1);
}

const errors = [];

// Helper to find index
const getIdx = (id) => drugs.findIndex(d => d.id === id);

// Check Sort Order
const tamifluIdx = getIdx('tamiflu-group');
const zofluzaIdx = getIdx('zofluza-group');
const inavirIdx = getIdx('inavir-group');

if (zofluzaIdx === -1) errors.push("Zofluza not found");
if (tamifluIdx === -1) errors.push("Tamiflu not found");

if (zofluzaIdx !== -1 && tamifluIdx !== -1) {
    // Zofluza should be after Tamiflu (or close to it), definitely not at the end
    // Logic: distance should be small
    if (Math.abs(zofluzaIdx - tamifluIdx) > 10) {
        errors.push(`Zofluza (${zofluzaIdx}) is too far from Tamiflu (${tamifluIdx})`);
    }
}

const flomoxIdx = getIdx('yj-6132016C1027');
const keflexIdx = getIdx('keflex-group');
if (flomoxIdx !== -1 && keflexIdx !== -1) {
    if (Math.abs(keflexIdx - flomoxIdx) > 5) {
        errors.push(`Keflex (${keflexIdx}) is too far from Flomox (${flomoxIdx})`);
    }
}

const bioferminIdx = getIdx('yj-2316004B1036');
const magOxIdx = getIdx('magnesium-oxide-group');
if (bioferminIdx !== -1 && magOxIdx !== -1) {
    if (Math.abs(magOxIdx - bioferminIdx) > 10) {
        errors.push(`Magnesium Oxide (${magOxIdx}) is too far from Biofermin (${bioferminIdx})`);
    }
}

// Check Categories
const checkCat = (id, expected) => {
    const d = drugs.find(x => x.id === id);
    if (!d) errors.push(`${id} not found`);
    else if (d.category !== expected) errors.push(`${id} category is ${d.category}, expected ${expected}`);
};

checkCat('keflex-group', 'antibiotics');
checkCat('zofluza-group', 'antiviral');
checkCat('magnesium-oxide-group', 'gi');
checkCat('medicon-group', 'respiratory');
checkCat('acetaminophen-group', 'antipyretic');

if (errors.length > 0) {
    console.error("Verification FAILED:");
    errors.forEach(e => console.error("- " + e));
    process.exit(1);
} else {
    console.log("Verification PASSED: Sort order and categories checked.");
}
