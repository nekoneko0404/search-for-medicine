
import fs from 'fs';
import path from 'path';

console.log("Starting Phase 14 Verification...");

const calcJsPath = path.join(process.cwd(), 'lab', 'pediatric-calc', 'calc.js');
const calcJsContent = fs.readFileSync(calcJsPath, 'utf-8');

// Extract PEDIATRIC_DRUGS
const match = calcJsContent.match(/const PEDIATRIC_DRUGS = \[\s*([\s\S]*?)\];/);
if (!match) {
    console.error("Could not find PEDIATRIC_DRUGS in calc.js");
    process.exit(1);
}

// Eval to get the array (simplified)
// To verify without executing, we can just regex scan or use a safer eval if possible.
// For now, let's use a temporary file approach to require it if needed, or just regex check.
// Since we have the file content, let's just use string checks for high confidence.
// Or better, let's use the same approach as previous verify scripts: import it.
// But calc.js is ES module with dom deps? No, it imports PHARMA_CLASSIFICATION_MAP relative.
// Let's try to parse the array part or mock the DOM/Import.

// Simplest way: regex check for the specific lines we changed.

const errors = [];

// 1. Check Valtrex ID and YJ
const valtrexCheck = /id:\s*"yj-6250019D1020",[\s\S]*?name:\s*"バルトレックス／バラシクロビル",[\s\S]*?yjCode:\s*"6250019D1020"/;
if (!valtrexCheck.test(calcJsContent)) errors.push("Valtrex ID or YJ Code update failed.");

// 2. Check Zofluza YJ
const zofluzaCheck = /name:\s*"ゾフルーザ顆粒2%",[\s\S]*?yjCode:\s*"6250047D1021"/;
if (!zofluzaCheck.test(calcJsContent)) errors.push("Zofluza YJ Code update failed.");

// 3. Check Movicol YJ
const movicolCheck = /name:\s*"モビコールHD／LD",[\s\S]*?yjCode:\s*"2359110B1037"/;
if (!movicolCheck.test(calcJsContent)) errors.push("Movicol YJ Code update failed.");

// 4. Check Transamin YJ
const transaminCheck = /name:\s*"トランサミン散50%",[\s\S]*?yjCode:\s*"3327002B1027"/;
if (!transaminCheck.test(calcJsContent)) errors.push("Transamin YJ Code update failed.");

// 5. Check Melatobel YJ
const melatobelCheck = /name:\s*"メラトベル顆粒0.2%小児用",[\s\S]*?yjCode:\s*"1190028D1026"/;
if (!melatobelCheck.test(calcJsContent)) errors.push("Melatobel YJ Code update failed.");


// 6. Check PMDA Link Format for these (rdSearch/01)
const linkChecks = [
    "6250019D1020", "6250047D1021", "2359110B1037", "3327002B1027", "1190028D1026"
];

linkChecks.forEach(code => {
    const regex = new RegExp(`piUrl:\\s*"https://www.pmda.go.jp/PmdaSearch/rdSearch/01/${code}\\?user=1"`);
    if (!regex.test(calcJsContent)) errors.push(`PMDA Link for ${code} is incorrect.`);
});


if (errors.length > 0) {
    console.error("Phase 14 Verification FAILED:");
    errors.forEach(e => console.error("- " + e));
    process.exit(1);
} else {
    console.log("Phase 14 Verification PASSED!");
    console.log("All target YJ codes and Valtrex ID updated correctly.");
}
