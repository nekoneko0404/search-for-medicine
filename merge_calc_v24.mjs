
import fs from 'fs';
import path from 'path';

const CALC_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const V24_JS_PATH = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc_v24.js');

const calcContent = fs.readFileSync(CALC_JS_PATH, 'utf-8');
const v24Content = fs.readFileSync(V24_JS_PATH, 'utf-8');

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

const originalDataPart = calcContent.substring(0, endIndex + 1) + ";\n\n";

// Now merged content with v24
const mergedContent = originalDataPart + v24Content;

fs.writeFileSync(CALC_JS_PATH, mergedContent, 'utf-8');
console.log("Merged calc.js with v24 successfully.");
