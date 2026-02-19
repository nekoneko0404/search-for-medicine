import fs from 'fs';
import * as cheerio from 'cheerio';

const xmlPath = 'C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML\\サワシリン細粒１０％\\171911_6131001C1210_2_09.xml';
const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

console.log('Original XML length:', xmlContent.length);

// Strip all XML namespaces and prefixes (e.g., pmda:, xsl:)
const cleanXml = xmlContent.replace(/<\/?([a-zA-Z0-9]+):/g, (match, prefix) => {
    return match.startsWith('</') ? '</' : '<';
}).replace(/xmlns(:[a-zA-Z0-9]+)?="[^"]*"/g, '');

console.log('Clean XML length:', cleanXml.length);
// fs.writeFileSync('debug_clean.xml', cleanXml); // Optional: check content

const $ = cheerio.load(cleanXml, { xmlMode: true });

console.log('Root element:', $.root().children().first().prop('tagName'));

const doseAdmin = $('DoseAdmin');
console.log('Found DoseAdmin:', doseAdmin.length);

if (doseAdmin.length > 0) {
    console.log('DoseAdmin children count:', doseAdmin.children().length);
    doseAdmin.children().each((i, el) => {
        console.log(`Child ${i}:`, $(el).prop('tagName'), $(el).text().substring(0, 50));
    });
} else {
    // Try finding it deeper
    console.log('Searching * for DoseAdmin...');
    const allDose = $('*').filter((i, el) => $(el).prop('tagName') === 'DoseAdmin');
    console.log('Found via filter:', allDose.length);
}
