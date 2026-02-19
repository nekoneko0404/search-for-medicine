
import fs from 'fs';
import path from 'path';

const searchDir = "C:\\Users\\kiyoshi\\OneDrive\\ドキュメント\\pmda_all_sgml_xml_20260217\\SGML_XML";
const targetYjCode = "6131001C1210";

function findAndAnalyzeXml(dir) {
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
            findAndAnalyzeXml(fullPath);
        } else if (file.includes(targetYjCode) && file.endsWith('.xml')) {
            console.log("Analyzing:", fullPath);
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Extract all tag names
            const tags = new Set();
            const regex = /<([a-zA-Z0-9_:-]+)[^>]*>/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                tags.add(match[1]);
            }

            console.log("Tags found:", Array.from(tags).sort().join(", "));

            // Try to find "用法" in the content to see where it is
            const usageIndex = content.indexOf("用法");
            if (usageIndex !== -1) {
                console.log("--- Context around '用法' ---");
                console.log(content.substring(usageIndex - 100, usageIndex + 200));
            }

            process.exit(0);
        }
    }
}

findAndAnalyzeXml(searchDir);
