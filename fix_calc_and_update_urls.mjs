
import fs from 'fs';
import path from 'path';

const calcPath = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
let content = fs.readFileSync(calcPath, 'utf-8');

// 1. Fix Syntax Error
// Look for the broken block where we inserted valid weight check but left dangling code
// Pattern:
// resultArea.innerHTML = `<p class="text-center text-rose-500 py-10 font-bold bg-rose-50 rounded-xl">体重${reqMinWeight}kg以上が対象です</p>`;
//         return;
//     }
//         resultArea.innerHTML = '<p class="text-center text-indigo-500 py-10 font-bold bg-indigo-50 rounded-xl">年齢を入力してください</p>';
//         return;
//     }

const brokenPattern = `        return;
    }
        resultArea.innerHTML = '<p class="text-center text-indigo-500 py-10 font-bold bg-indigo-50 rounded-xl">年齢を入力してください</p>';
        return;
    }`;

const fixedPattern = `        return;
    }

    if (isNaN(age) && (drug.calcType === 'age' || drug.calcType === 'fixed-age')) {
        resultArea.innerHTML = '<p class="text-center text-indigo-500 py-10 font-bold bg-indigo-50 rounded-xl">年齢を入力してください</p>';
        return;
    }`;

if (content.includes(brokenPattern)) {
    console.log("Found broken syntax pattern. Fixing...");
    content = content.replace(brokenPattern, fixedPattern);
} else {
    // Try looser match if whitespace differs
    const looserBroken = /return;\s*}\s*resultArea\.innerHTML = '<p class="text-center text-indigo-500 py-10 font-bold bg-indigo-50 rounded-xl">年齢を入力してください<\/p>';\s*return;\s*}/;
    if (looserBroken.test(content)) {
        console.log("Found broken syntax pattern (regex). Fixing...");
        content = content.replace(looserBroken, (match) => {
            return `return;
    }

    if (isNaN(age) && (drug.calcType === 'age' || drug.calcType === 'fixed-age')) {
        resultArea.innerHTML = '<p class="text-center text-indigo-500 py-10 font-bold bg-indigo-50 rounded-xl">年齢を入力してください</p>';
        return;
    }`;
        });
    } else {
        console.warn("Could not find broken syntax pattern. Manual check needed?");
    }
}

// 2. Update PMDA URLs
// Target: https://www.pmda.go.jp/PmdaSearch/rdSearch/0[12]/([A-Z0-9]+)\?user=1
// Replace: https://www.pmda.go.jp/PmdaSearch/rdDetail/iyaku/$1_1?user=1

const urlRegex = /https:\/\/www\.pmda\.go\.jp\/PmdaSearch\/rdSearch\/0[12]\/([A-Z0-9]+)\?user=1/g;
let count = 0;
content = content.replace(urlRegex, (match, yj) => {
    count++;
    return `https://www.pmda.go.jp/PmdaSearch/rdDetail/iyaku/${yj}_1?user=1`;
});

console.log(`Updated ${count} URLs.`);

fs.writeFileSync(calcPath, content, 'utf-8');
console.log("calc.js updated successfully.");
