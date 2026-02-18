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

    // Phase 9 checks
    const clarith = drugs.find(d => d.id === 'clarith-group');
    if (clarith && !clarith.dosage.isByTime && clarith.dosage.minMgKg === 10) {
        console.log('PASS: Clarith corrected to daily dose 10-15mg/kg');
    }

    const hosmicin = drugs.find(d => d.id === 'yj-6135001R2110');
    if (hosmicin && hosmicin.hasSubOptions && hosmicin.subOptions.length === 2) {
        console.log('PASS: Hosmicin updated to 20%/40% subOptions');
    }

    const keflex = drugs.find(d => d.id === 'keflex-group');
    if (keflex) console.log('PASS: Keflex added');

    const ozex = drugs.find(d => d.id === 'ozex-group');
    if (ozex) console.log('PASS: Ozex added');

    const orapenem = drugs.find(d => d.id === 'orapenem-group');
    if (orapenem) console.log('PASS: Orapenem added');

    const tomiron = drugs.find(d => d.name.includes('トミロン'));
    if (tomiron && !tomiron.hasSubOptions) {
        console.log('PASS: Tomiron refined to single spec (20%)');
    }

    const cetirizine = drugs.find(d => d.id === 'cetirizine-group');
    if (cetirizine && !cetirizine.hasSubOptions) {
        console.log('PASS: Cetirizine consolidated into single entry');
    }

    // Phase 10 checks
    console.log('--- Phase 10 Checks ---');
    const fexofenadine = drugs.find(d => d.id === 'yj-4490023R2027');
    if (fexofenadine && fexofenadine.name.includes('フェキソフェナジン') && fexofenadine.fixedDoses.length === 3) {
        console.log('PASS: Fexofenadine renamed and 3 age steps added');
    }

    const oxatomide = drugs.find(d => d.id === 'celtect-group');
    if (oxatomide && oxatomide.name.includes('オキサトミド')) {
        console.log('PASS: Oxatomide renamed');
    }

    const zovirax = drugs.find(d => d.id === 'yj-6250002D1024');
    if (zovirax && zovirax.diseases && zovirax.diseases.length === 2) {
        console.log('PASS: Zovirax has disease options');
    }

    const tamiflu = drugs.find(d => d.id === 'tamiflu-group');
    if (tamiflu && tamiflu.subOptions[1].dosage.timeMgKg === 3) {
        console.log('PASS: Tamiflu newborn dosage (3mg/kg) added');
    }

    const alesion = drugs.find(d => d.id === 'yj-4490022R1025');
    if (!alesion) {
        console.log('PASS: Alesion removed');
    }

    const zofluza = drugs.find(d => d.id === 'zofluza-group');
    if (zofluza) console.log('PASS: Zofluza added');

    const relenza = drugs.find(d => d.id === 'relenza-group');
    if (relenza && relenza.dosage.isFixed) console.log('PASS: Relenza added (fixed dose)');

    // Phase 11 checks
    console.log('--- Phase 11 Checks ---');
    const calonal = drugs.find(d => d.id === 'acetaminophen-group');
    if (calonal && calonal.dosage.absoluteMaxMgPerTime === 500) {
        console.log('PASS: Calonal max per time (500mg) set');
    }

    const domperidone = drugs.find(d => d.id === 'yj-2399005R1163');
    if (domperidone && domperidone.calcType === 'age-weight-switch' && domperidone.ageBranches[1].dosage.maxMgKg === 1) {
        console.log('PASS: Domperidone age 6+ limit (1.0mg/kg) set');
    }

    const mgo = drugs.find(d => d.id === 'magnesium-oxide-group');
    if (mgo) console.log('PASS: Magnesium Oxide added');

    const movicol = drugs.find(d => d.id === 'movicol-group');
    if (movicol) console.log('PASS: Movicol added');

    const transamin = drugs.find(d => d.id === 'transamin-group');
    if (transamin) console.log('PASS: Transamin added');

    const melatobel = drugs.find(d => d.id === 'melatobel-group');
    if (melatobel) console.log('PASS: Melatobel added');

    const adsorbin = drugs.find(d => d.id === 'yj-2331004B1046');
    if (!adsorbin) console.log('PASS: Adsorbin removed');

    const brufen = drugs.find(d => d.id === 'yj-1149001D1160');
    if (!brufen) console.log('PASS: Brufen removed');

    const pl = drugs.find(d => d.id === 'yj-1180107D1131');
    if (!pl) console.log('PASS: PL removed');

    console.log('Data integrity check complete.');
} catch (e) {
    console.error('Verification failed:', e.message);
    process.exit(1);
}
