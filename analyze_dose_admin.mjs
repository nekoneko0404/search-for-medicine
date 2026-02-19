
import fs from 'fs';
import path from 'path';

const searchDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const targetYjCode = "6131001C1210";

function findAndReadDoseAdmin(dir) {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return;
    }

    for (const file of files) {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) {
            continue;
        }

        if (stat.isDirectory()) {
            findAndReadDoseAdmin(fullPath);
        } else if (file.includes(targetYjCode) && file.endsWith('.xml')) {
            console.log("Analyzing:", fullPath);
            const content = fs.readFileSync(fullPath, 'utf-8');

            const match = content.match(/<DoseAdmin>([\s\S]*?)<\/DoseAdmin>/);
            if (match) {
                console.log("--- DoseAdmin Content ---");
                console.log(match[1]);
            } else {
                console.log("DoseAdmin tag not found.");
            }
            process.exit(0);
        }
    }
}

findAndReadDoseAdmin(searchDir);
