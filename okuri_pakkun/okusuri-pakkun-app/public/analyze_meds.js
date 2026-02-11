const fs = require('fs');
const path = require('path');

function analyzeMeds(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        data.forEach((med, i) => {
            console.log(`${i}: ${med.brand_name} (YJ: ${med.yj_code})`);
        });
    } catch (error) {
        console.error("Error analyzing meds:", error.message);
    }
}

analyzeMeds(path.join('c:', 'Users', 'kiyoshi', 'Github_repository', 'okuri_pakkun', 'okusuri-pakkun-app', 'public', 'meds_master.json'));
