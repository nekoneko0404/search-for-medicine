import fs from 'fs';
import path from 'path';

const inputPath = 'C:/Users/kiyoshi/Github_repository/search-for-medicine/docs/drug_classification_reference.md';
const outputPath = 'C:/Users/kiyoshi/Github_repository/search-for-medicine/supply-status/data/drug_classification.json';

try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const lines = content.split('\n');

    const class4 = {};
    const class3 = {};
    let mode = '';

    for (const line of lines) {
        if (line.includes('## 4桁分類')) {
            mode = '4';
        } else if (line.includes('## 3桁分類')) {
            mode = '3';
        } else {
            const match = line.match(/^\| (\d+) \| (.*) \|/);
            if (match) {
                const code = match[1];
                const name = match[2].trim();
                if (mode === '4') {
                    class4[code] = name;
                } else if (mode === '3') {
                    class3[code] = name;
                }
            }
        }
    }

    const class2 = {
        '11': '中枢神経系用薬',
        '12': '末梢神経系用薬',
        '13': '感覚器官用薬',
        '19': 'その他の神経系・感覚器官用薬',
        '21': '循環器官用薬',
        '22': '呼吸器官用薬',
        '23': '消化器官用薬',
        '24': 'ホルモン剤',
        '25': '泌尿生殖器官・肛門用薬',
        '26': '外皮用薬',
        '27': '歯科口腔用薬',
        '29': 'その他の個々の器官系用医薬品',
        '31': 'ビタミン剤',
        '32': '滋養強壮、栄養剤',
        '33': '血液・体液用薬',
        '34': '人工透析用薬',
        '39': 'その他の代謝性医薬品',
        '41': '細胞賦活用薬',
        '42': '腫瘍用薬',
        '43': '放射性医薬品',
        '44': 'アレルギー用薬',
        '49': 'その他の組織細胞機能用医薬品',
        '51': '生薬',
        '52': '漢方製剤',
        '59': 'その他の生薬・漢方処方医薬品',
        '61': '抗生物質製剤',
        '62': '化学療法剤',
        '63': '生物学的製剤',
        '64': '寄生動物用薬',
        '69': 'その他の病原生物に対する医薬品',
        '71': '調剤用薬',
        '72': '診断用薬',
        '73': '公衆衛生用薬',
        '74': '体外診断用医薬品',
        '79': 'その他の治療を主目的としない薬',
        '81': '天然麻薬',
        '82': '合成麻薬',
        '89': 'その他の麻薬'
    };

    const result = {
        '2': class2,
        '3': class3,
        '4': class4
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Successfully generated drug_classification.json at ' + outputPath);
} catch (err) {
    console.error('Error generating classification:', err);
    process.exit(1);
}
