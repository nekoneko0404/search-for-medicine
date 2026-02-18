import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calcJsPath = `${__dirname}/calc.js`;
const content = fs.readFileSync(calcJsPath, 'utf8');

// PEDIATRIC_DRUGSの内容を文字列から単純にカウント（{ id: " などの出現回数）
const matches = content.match(/id: "/g);
console.log(`Number of 'id: "' matches: ${matches ? matches.length : 0}`);

// 実際の配列を解析
try {
    const code = content
        .replace(/import .* from .*/g, '')
        .replace(/export /g, '');
    const script = new Function(`
        ${code}
        return PEDIATRIC_DRUGS;
    `)();
    console.log(`Actual PEDIATRIC_DRUGS.length: ${script.length}`);
} catch (e) {
    console.error('Failed to parse PEDIATRIC_DRUGS:', e.message);
}
