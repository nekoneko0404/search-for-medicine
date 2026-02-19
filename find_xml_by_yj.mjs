
import fs from 'fs';
import path from 'path';

const searchDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const targetYjCode = "6131001C1210";

function searchFiles(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                searchFiles(fullPath);
            } else if (file.includes(targetYjCode) && file.endsWith('.xml')) {
                console.log("Found:", fullPath);
            }
        }
    } catch (err) {
        console.error("Error accessing:", dir, err.message);
    }
}

console.log(`Searching for *${targetYjCode}* in ${searchDir}...`);
searchFiles(searchDir);
