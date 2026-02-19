
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const V23_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc_v23.js');

const calcContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const v23Content = fs.readFileSync(V23_JS_PATH, 'utf-8');

// 1. Keep "DRUG_CATEGORIES" and "PEDIATRIC_DRUGS" from original file
// Robust extraction using bracket counting (same logic as before)
const startIndex = calcContent.indexOf('const PEDIATRIC_DRUGS = [');
if (startIndex === -1) { console.error("Could not find start"); process.exit(1); }

let openBrackets = 0;
let endIndex = -1;
let foundStart = false;
let inString = false;
let stringChar = '';

const arrayStartCharIndex = calcContent.indexOf('[', startIndex);

for (let i = arrayStartCharIndex; i < calcContent.length; i++) {
    const char = calcContent[i];
    if (inString) {
        if (char === stringChar && calcContent[i - 1] !== '\\') inString = false;
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

// Extract the header part (imports, categories, and drugs array)
// Note: DRUG_CATEGORIES is before PEDIATRIC_DRUGS in original file.
// We should check if we need to keep imports.
// Original calc.js starts with import { PHARMA_CLASSIFICATION_MAP } ...
// But v23 logic doesn't use it (yet). However, to be safe, we keep the top part.

// The content we WANT to keep is everything from start of file UNTIL the end of PEDIATRIC_DRUGS array.
// But we might need to adjust imports if v23 needs something new (it doesn't).

// However, v23 defines its own "DRUG_CATEGORIES" inside? No, I didn't verify v23 source fully.
// Let's check v23 content. 
// v23 content starts with `// Phase 23...`. It does NOT have PEDIATRIC_DRUGS definition.
// It assumes PEDIATRIC_DRUGS and DRUG_CATEGORIES are available?
// Wait, my v23 implementation did NOT include PEDIATRIC_DRUGS. It expected to be merged.
// But it used `DRUG_CATEGORIES` in `renderCategoryTabs`.
// And original file has `export const DRUG_CATEGORIES`.

// So the plan is:
// 1. Take original file content from Start up to the end of `PEDIATRIC_DRUGS` array.
// 2. Append the content of `calc_v23.js`.

// One detail: `calc_v23.js` uses `DRUG_CATEGORIES` which is defined in original file.
// So keeping original top part is correct.

const originalDataPart = calcContent.substring(0, endIndex + 1) + ";\n\n";

// Now merged content
const mergedContent = originalDataPart + v23Content;

fs.writeFileSync(CALC_JS_PATH, mergedContent, 'utf-8');
console.log("Merged calc.js successfully.");
