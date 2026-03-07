import { CodeNormalizer } from "./normalizer.js";

const testCases = [
    // --- YJコード (12桁) 系 ---
    { input: "1179001F1023", expected: "1179001F1023", desc: "12桁英字入り正常" },
    { input: " 1179001f1023 ", expected: "1179001F1023", desc: "12桁英字小文字・スペース前後" },
    { input: "1179-001F-1023", expected: "1179001F1023", desc: "12桁ハイフン入り" },
    { input: "１１７９００１Ｆ１０２３", expected: "1179001F1023", desc: "12桁全角" },
    { input: "1179.001.F10.23", expected: "1179001F1023", desc: "12桁ドット入り" },
    { input: "(1179001F1023)", expected: "1179001F1023", desc: "12桁カッコ入り" },
    { input: "YJ:1179001F1023", expected: "1179001F1023", desc: "コロン+ラベル" },

    // --- 9桁コード (レセ電算/厚労省) 系 ---
    { input: "123456789", expected: "123456789", desc: "9桁正常" },
    { input: " 620000001 ", expected: "620000001", desc: "9桁スペース前後" },
    { input: "６２００００００１", expected: "620000001", desc: "9桁全角" },
    { input: "620-000-001", expected: "620000001", desc: "9桁ハイフン入り" },
    { input: "620.000.001", expected: "620000001", desc: "9桁ドット入り" },

    // --- 複合・異常系 ---
    { input: "620 000 001", expected: "620000001", desc: "9桁スペース混在" },
    { input: "（620000001）", expected: "620000001", desc: "全角カッコ入り" },
    { input: "code:６２０－０００－００１", expected: "620000001", desc: "テキスト+全角記号混在" },
];

// 残り項目を YJ12桁や9桁のバリエーションで合計50にする
const yjBases = ["1179001F1", "2149002F1", "3999001F1", "6111001F1", "1124001F1"];
const digitBases = ["620000001", "620000002", "620000101", "621111111", "641112222"];

for (let i = 0; i < 17; i++) {
    const base = yjBases[i % yjBases.length];
    const suffix = (100 + i).toString();
    const code = base + suffix;
    testCases.push({ input: `【${code}】`, expected: code, desc: `バリエーションYJ-${i}` });
}
for (let i = 0; i < 18; i++) {
    const base = digitBases[i % digitBases.length];
    const offset = i * 10;
    const code = (parseInt(base) + offset).toString();
    testCases.push({ input: ` No.${code} `, expected: code, desc: `バリエーション9桁-${i}` });
}

console.log(`--- CodeNormalizer Accuracy Test (Total: ${testCases.length} items) ---`);
let successCount = 0;
testCases.forEach((tc, index) => {
    const actual = CodeNormalizer.normalize(tc.input);
    const success = actual === tc.expected;
    if (success) {
        successCount++;
    } else {
        console.log(`[FAILED] #${index + 1} ${tc.desc}: Input="${tc.input}", Expected="${tc.expected}", Actual="${actual}"`);
    }
});

console.log(`\nResult: ${successCount}/${testCases.length} passed.`);
if (successCount === testCases.length) {
    console.log("Status: 100% Accuracy Achieved.");
} else {
    console.log("Status: Fix Required.");
}
