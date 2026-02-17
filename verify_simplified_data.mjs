import { PHARMA_CLASSIFICATION_MAP } from './lab/pediatric-calc/pharma_classification.js';

console.log('Testing Simplified PHARMA_CLASSIFICATION_MAP...');

const testCases = [
    { code: '1111', expected: '炭化水素' },
    { code: '6131', expected: 'ペニシリン系' }, // "ペニシリン系抗生物質製剤；合成ペニシリン" -> "ペニシリン系"
    { code: '613', expected: 'グラム陽性・陰性菌用薬' }, // "主としてグラム陽性・陰性菌に作用するもの" -> "グラム陽性・陰性菌用薬"
    { code: '222', expected: '鎮咳薬' }, // "鎮咳剤" -> "鎮咳薬"
    { code: '2646', expected: 'ステロイド' }, // "副腎皮質ホルモン製剤" -> "ステロイド"
    { code: '9999', expected: undefined }
];

let passed = true;
testCases.forEach(tc => {
    const actual = PHARMA_CLASSIFICATION_MAP[tc.code];
    if (actual !== tc.expected) {
        console.error(`FAILED: Code ${tc.code}. Expected "${tc.expected}", got "${actual}"`);
        passed = false;
    } else {
        console.log(`PASSED: Code ${tc.code} -> ${actual}`);
    }
});

if (passed) {
    console.log('All simplified test cases passed.');
} else {
    console.error('Some test cases failed.');
    process.exit(1);
}
