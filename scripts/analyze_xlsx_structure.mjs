
import ExcelJS from 'exceljs';

async function listSheets(filePath) {
    console.log(`Workbook: ${filePath}`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    console.log("Sheets:", workbook.worksheets.map(ws => ws.name));

    const worksheet = workbook.worksheets[0];
    if (worksheet) {
        console.log(`Analyzing first sheet: ${worksheet.name}`);
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber <= 10) {
                const values = row.values;
                console.log(`Row ${rowNumber}:`, JSON.stringify(values.slice(0, 15)));
            }
        });
    }
}

const files = [
    "C:\\Users\\kiyoshi\\Downloads\\2026\\tp20260401-01_01.xlsx",
    "C:\\Users\\kiyoshi\\Downloads\\2025\\tp20260220-01_01.xlsx"
];

(async () => {
    for (const f of files) {
        try {
            await listSheets(f);
        } catch (e) {
            console.error(`Error analyzing ${f}:`, e.message);
        }
    }
})();
