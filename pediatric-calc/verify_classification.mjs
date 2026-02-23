import { PHARMA_CLASSIFICATION_MAP } from './pharma_classification.js';

function getPharmaClass(yjCode) {
    if (!yjCode) return '';
    const code = yjCode.replace('yj-', '');
    const p3 = code.substring(0, 3);
    const p4 = code.substring(0, 4);

    const name3 = PHARMA_CLASSIFICATION_MAP[p3] || '';
    const name4 = PHARMA_CLASSIFICATION_MAP[p4] || '';

    if (!name3 && !name4) return 'その他';
    if (!name4) return name3;
    if (!name3) return name4;

    if (name4.includes(name3) || name3.includes(name4)) {
        return name4;
    }

    return `${name3}ー${name4}`;
}

const testCases = [
    { yj: 'yj-2239', expected: 'その他の去痰薬' }, // 3: 去痰薬(223), 4: その他の去痰薬(2239) -> 重複
    { yj: 'yj-6131', expected: 'グラム陽性・陰性菌用薬ーペニシリン系' }, // 3: グラム陽性・陰性菌用薬(613), 4: ペニシリン系(6131) -> 連結
    { yj: 'yj-1149', expected: 'その他の解熱鎮痛薬' }, // 114: 解熱鎮痛薬
    { yj: 'yj-6250', expected: '抗ウイルス剤' } // 625: 抗ウイルス剤, 6250: 抗ウイルス剤 -> 同条件
];

let success = true;
testCases.forEach(tc => {
    const result = getPharmaClass(tc.yj);
    if (result === tc.expected) {
        console.log(`PASS: ${tc.yj} -> ${result}`);
    } else {
        console.error(`FAIL: ${tc.yj} -> Expected: ${tc.expected}, Got: ${result}`);
        success = false;
    }
});

if (!success) process.exit(1);
console.log('Verification successful.');
