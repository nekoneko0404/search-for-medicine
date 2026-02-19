
import fs from 'fs';
import path from 'path';

const searchDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const targetYjCode = "6131001C1210";

function findAndReadXml(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findAndReadXml(fullPath);
        } else if (file.includes(targetYjCode) && file.endsWith('.xml')) {
            console.log("Reading:", fullPath);
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Simple regex extraction for demonstration
            const match = content.match(/<DosageAndAdministration>([\s\S]*?)<\/DosageAndAdministration>/);
            if (match) {
                console.log("--- DosageAndAdministration Content ---");
                console.log(match[1].substring(0, 2000)); // Print first 2000 chars
            } else {
                console.log("DosageAndAdministration tag not found.");
            }
            process.exit(0);
        }
    }
}

findAndReadXml(searchDir);
