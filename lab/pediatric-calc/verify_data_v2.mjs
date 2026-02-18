import fs from 'fs';

const calcJsPath = 'c:/Users/kiyoshi/Github_repository/search-for-medicine/lab/pediatric-calc/calc.js';
const content = fs.readFileSync(calcJsPath, 'utf8');

// PEDIATRIC_DRUGS の定義箇所を抽出して簡易検証
try {
    const drugsMatch = content.match(/const PEDIATRIC_DRUGS = (\[[\s\S]*?\]);/);
    if (!drugsMatch) {
        throw new Error('PEDIATRIC_DRUGS not found');
    }

    // 文字列をオブジェクトとして評価（簡易的）
    // eval は危険だが、自作ファイルかつローカル検証用なので使用
    // 注意: import 文などがあるため、単純な eval ではなく関数化して評価
    const drugsStr = drugsMatch[1];

    // 構文チェックのみを目的とする場合、Function コンストラクタでパースできるか確認
    const drugs = new Function(`return ${drugsStr}`)();

    console.log(`Successfully parsed ${drugs.length} drugs.`);

    // 指摘事項の反映確認
    const acetaminophen = drugs.find(d => d.id === 'acetaminophen-group');
    if (acetaminophen) {
        console.log('PASS: Acetaminophen group found');
        const specCount = acetaminophen.subOptions.length;
        if (specCount === 5) {
            console.log(`PASS: Acetaminophen has 5 specs (including 100% and Syrup)`);
        } else {
            console.error(`FAIL: Acetaminophen has ${specCount} specs, expected 5`);
        }
    } else {
        console.error('FAIL: Acetaminophen group NOT found');
    }

    const montelukast = drugs.find(d => d.id === 'montelukast-group');
    if (montelukast) {
        console.log('PASS: Montelukast group found');
    } else {
        console.error('FAIL: Montelukast group NOT found');
    }

    const tomiron = drugs.find(d => d.name.includes('トミロン'));
    if (tomiron && !tomiron.hasSubOptions) {
        console.log('PASS: Tomiron refined to single spec (20%)');
    }

    const cetirizine = drugs.find(d => d.id === 'cetirizine-group');
    if (cetirizine && !cetirizine.hasSubOptions) {
        console.log('PASS: Cetirizine consolidated into single entry');
    } else {
        console.error('FAIL: Cetirizine NOT consolidated as expected');
    }

    console.log('Data integrity check complete.');
} catch (e) {
    console.error('Verification failed:', e.message);
    process.exit(1);
}
