const fs = require('fs');

const CALC_JS_PATH = 'lab/pediatric-calc/calc.js';

const getCategoryRank = (yjCode) => {
    if (!yjCode || yjCode.startsWith('UNKNOWN')) return 40;

    const prefix3 = yjCode.substring(0, 3);
    const prefix2 = yjCode.substring(0, 2);
    const prefix3Num = parseInt(prefix3, 10);

    // 1. Antibiotics (611-624)
    if (prefix3Num >= 611 && prefix3Num <= 624) return 10;

    // 2. Antivirals (625)
    if (prefix3 === '625') return 20;

    // 3. Respiratory/ENT (22xx OR 44xx)
    // 22: Respiratory organ agents
    // 44: Antiallergic agents (including Antihistamines)
    if (prefix2 === '22' || prefix2 === '44') return 30;

    // 5. Kampo (52xx)
    if (prefix2 === '52') return 50;

    // 4. Others
    return 40;
};

try {
    const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf8');

    // Extract PEDIATRIC_DRUGS array
    const startMarker = 'const PEDIATRIC_DRUGS = [';
    const startIndex = calcJsContent.indexOf(startMarker);
    if (startIndex === -1) throw new Error('Could not find PEDIATRIC_DRUGS start');

    // Find end of array (naive matching for "];\n" assuming formatting)
    // Using a more robust char scan like before
    let nesting = 0;
    let arrayContentEnd = -1;
    let inString = false;
    let stringChar = '';

    for (let i = startIndex; i < calcJsContent.length; i++) {
        const char = calcJsContent[i];
        if (inString) {
            if (char === stringChar && calcJsContent[i - 1] !== '\\') {
                inString = false;
            }
        } else {
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
            } else if (char === '[') {
                nesting++;
            } else if (char === ']') {
                nesting--;
                if (nesting === 0) {
                    arrayContentEnd = i + 1;
                    break;
                }
            }
        }
    }

    if (arrayContentEnd === -1) throw new Error('Could not parse array bounds');

    const fullArrayString = calcJsContent.substring(startIndex, arrayContentEnd);

    // Parse blocks
    const rawBlocks = fullArrayString.match(/^\s{4}\{(?:[\s\S]*?)\n\s{4}\},?/gm);
    if (!rawBlocks) throw new Error('Could not parse drug blocks');

    const processedBlocks = rawBlocks.map(block => {
        const yjMatch = block.match(/yjCode:\s*"([^"]+)"/);
        const idMatch = block.match(/id:\s*"([^"]+)"/);
        const yjCode = yjMatch ? yjMatch[1] : 'UNKNOWN';
        const id = idMatch ? idMatch[1] : '';

        let content = block;

        // Update Snippets for Antivirals (Valaciclovir, Acyclovir)
        if (id === 'yj-6250019D1046') { // Valaciclovir
            if (content.includes('piSnippet:')) {
                content = content.replace(/piSnippet: "[^"]*"/, 'piSnippet: "【水痘】通常、1回25mg/kgを1日2回。1回最大500mg。(他適応は添付文書参照)"');
            }
            // Also update snippet source if needed, but snippet is critical for display.
            // Let's update the source too for consistency if desired, but user just said "specify indication".
            // Updating snippet is enough for display.
        }
        if (id === 'yj-6250002D1024') { // Acyclovir
            if (content.includes('piSnippet:')) {
                content = content.replace(/piSnippet: "[^"]*"/, 'piSnippet: "【水痘】通常、1回20mg/kgを1日4回。(他適応は添付文書参照)"');
            }
        }

        return {
            yjCode,
            content: content.replace(/,\s*$/, '') // Trim trailing comma
        };
    });

    // Sort
    processedBlocks.sort((a, b) => {
        const rankA = getCategoryRank(a.yjCode);
        const rankB = getCategoryRank(b.yjCode);

        if (rankA !== rankB) return rankA - rankB;
        return a.yjCode.localeCompare(b.yjCode);
    });

    // Reconstruct
    const newArrayContent = processedBlocks.map(b => b.content).join(',\n');
    const newFileContent = calcJsContent.slice(0, startIndex + startMarker.length) +
        '\n' + newArrayContent + '\n' +
        calcJsContent.slice(arrayContentEnd - 1);

    fs.writeFileSync(CALC_JS_PATH, newFileContent, 'utf8');
    console.log('Successfully reordered calc.js and updated antiviral snippets.');

} catch (e) {
    console.error(e);
}
