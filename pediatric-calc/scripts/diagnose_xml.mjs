import fs from 'fs';
import * as cheerio from 'cheerio';

const filePath = String.raw`C:\Users\kiyoshi\OneDrive\ドキュメント\pmda_all_sgml_xml_20260217\SGML_XML\ゾフルーザ顆粒２％分包\340018_6250047F1022_1_20\340018_6250047F1022_1_20.xml`;

try {
    const buffer = fs.readFileSync(filePath);
    // Xofluza is likely UTF-8 or Shift_JIS. Let's try Shift_JIS first or auto-detect if possible.
    // The previous script said "Assuming UTF-8" for Xofluza, so let's try UTF-8.
    const decoder = new TextDecoder('utf-8');
    const xmlContent = decoder.decode(buffer);

    // console.log("--- First 2000 chars ---");
    // console.log(xmlContent.substring(0, 2000));
    // console.log("------------------------");

    const $ = cheerio.load(xmlContent, { xmlMode: true });

    console.log("--- Searching for TblBlock... ---");
    $('*').each((i, el) => {
        if (el.tagName.toLowerCase().includes('tblblock')) {
            console.log(`Found tag: ${el.tagName}`);
            console.log(`Children tags: ${$(el).children().map((i, c) => c.tagName).get().join(', ')}`);
            // console.log(`Text content (first 100 chars): ${$(el).text().substring(0, 100)}`);
            // Print full HTML of tblblock to see structure
            console.log(`HTML: ${$.html(el)}`);
        }
    });

} catch (e) {
    console.error(e);
}
