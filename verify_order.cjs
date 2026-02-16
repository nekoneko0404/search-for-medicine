const fs = require('fs');

const CALC_JS_PATH = 'lab/pediatric-calc/calc.js';

try {
    const content = fs.readFileSync(CALC_JS_PATH, 'utf8');
    const startMarker = 'const PEDIATRIC_DRUGS = [';
    const startIndex = content.indexOf(startMarker);

    // Naive parsing
    const drugBlocks = content.split('    {');
    // Skip the first split part (before the first drug)
    const drugs = [];

    for (let i = 1; i < drugBlocks.length; i++) {
        const block = drugBlocks[i];
        const yjMatch = block.match(/yjCode:\s*"([^"]+)"/);
        const nameMatch = block.match(/name:\s*"([^"]+)"/);
        const idMatch = block.match(/id:\s*"([^"]+)"/);
        const snippetMatch = block.match(/piSnippet:\s*"([^"]+)"/);

        if (yjMatch && nameMatch) {
            drugs.push({
                yjCode: yjMatch[1],
                name: nameMatch[1],
                id: idMatch ? idMatch[1] : '',
                snippet: snippetMatch ? snippetMatch[1] : ''
            });
        }
    }

    console.log(`Total drugs found: ${drugs.length}`);
    console.log('--- Top 5 Drugs ---');
    drugs.slice(0, 5).forEach(d => console.log(`${d.yjCode} ${d.name}`));

    console.log('\n--- Checking Category Transition ---');
    let currentPrefix = '';
    drugs.forEach((d, index) => {
        const prefix = d.yjCode.substring(0, 3);
        if (prefix !== currentPrefix) {
            console.log(`Transition at #${index}: ${d.yjCode} ${d.name}`);
            currentPrefix = prefix;
        }
    });

    console.log('\n--- Checking Antiviral Snippets ---');
    const vala = drugs.find(d => d.id === 'yj-6250019D1046');
    if (vala) console.log(`Valaciclovir Snippet: ${vala.snippet}`);
    else console.log('Valaciclovir NOT FOUND');

    const acy = drugs.find(d => d.id === 'yj-6250002D1024');
    if (acy) console.log(`Acyclovir Snippet: ${acy.snippet}`);
    else console.log('Acyclovir NOT FOUND');

} catch (e) {
    console.error(e);
}
