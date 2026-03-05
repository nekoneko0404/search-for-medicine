
import ExcelJS from 'exceljs';

async function analyzeFile(filePath) {
    console.log(`Workbook: ${filePath}`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber <= 10) {
            console.log(`Row ${rowNumber}:`);
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                console.log(`  Col ${colNumber} (${cell.address}): ${cell.value}`);
            });
        }
    });
}

const files = [
    "C:\\Users\\kiyoshi\\Downloads\\2026\\tp20260401-01_01.xlsx"
];

(async () => {
    for (const f of files) {
        await analyzeFile(f);
    }
})();
