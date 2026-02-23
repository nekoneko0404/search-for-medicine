import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const baseDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const targetSubDir = "バルトレックス顆粒５０％";

function findXmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (let file of list) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findXmlFiles(file));
        } else {
            if (file.endsWith('.xml')) results.push(file);
        }
    }
    return results;
}

const targetDir = path.join(baseDir, targetSubDir);
if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
}

const xmlFiles = findXmlFiles(targetDir);
if (xmlFiles.length === 0) {
    console.error(`No XML files found in ${targetDir}`);
    process.exit(1);
}

console.log(`Found XML: ${xmlFiles[0]}`);
const content = fs.readFileSync(xmlFiles[0], 'utf-8');
const $ = cheerio.load(content, { xmlMode: true });

// Search for DoseAdmin (case insensitive match is hard with cheerio, using find)
let doseAdmin = $('DoseAdmin');
if (doseAdmin.length === 0) {
    console.log("Searching for DoseAdmin with any prefix...");
    $('*').each((i, el) => {
        if ($(el).prop('tagName').toLowerCase().includes('doseadmin')) {
            doseAdmin = $(el);
            console.log(`Found tag: ${$(el).prop('tagName')}`);
            return false;
        }
    });
}

if (doseAdmin.length > 0) {
    console.log("--- DoseAdmin XML ---");
    console.log($.html(doseAdmin));
} else {
    console.log("DoseAdmin tag not found.");
}
