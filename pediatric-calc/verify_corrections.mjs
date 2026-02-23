
import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\lab\\pediatric-calc\\calc.js', 'utf8');

// Check L-Keflex (Group)
// Should have "1000mg" and "2000mg" instead of "1g" and "2g"
if (content.includes('"note": "1日25〜50mg/kgを2回(朝夕)。成人最大1000mg/日。"')) {
    console.log("L-Keflex Note 1: OK (1000mg)");
} else {
    console.log("L-Keflex Note 1: FAIL");
}

if (content.includes('"note": "1日50〜100mg/kgを2回(朝夕)。成人最大2000mg/日。"')) {
    console.log("L-Keflex Note 2: OK (2000mg)");
} else {
    console.log("L-Keflex Note 2: FAIL");
}

// Check Fosmicin (Group)
// Should have 3 times/day and 3000mg max
const fosGroupMatch = content.match(/"id": "yj-6135001R2110"[\s\S]*?"timesPerDay": (\d)[\s\S]*?"absoluteMaxMgPerDay": (\d+)/);
if (fosGroupMatch) {
    if (fosGroupMatch[1] === '3' && fosGroupMatch[2] === '3000') {
        console.log("Fosmicin Group: OK (3 times, 3000mg)");
    } else {
        console.log(`Fosmicin Group: FAIL (Times: ${fosGroupMatch[1]}, Max: ${fosGroupMatch[2]})`);
    }
} else {
    console.log("Fosmicin Group: NOT FOUND");
}

// Check for Duplicate Fosmicin (yj-6132003C1041)
// It should be GONE (except maybe in comments or unrelated parts? No, should be gone from PEDIATRIC_DRUGS)
// I removed it.
if (content.includes('"id": "yj-6132003C1041"')) {
    console.log("Duplicate Fosmicin: FOUND (Should be GONE)");
} else {
    console.log("Duplicate Fosmicin: GONE (OK)");
}
