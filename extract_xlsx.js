const XLSX = require('xlsx');
const path = require('path');

const filePath = "C:\\Users\\kiyoshi\\Downloads\\医薬品供給データ（厚労省）_スプレッドシート.xlsx";

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_csv(worksheet);
    console.log(data);
} catch (e) {
    console.error("Error reading excel:", e.message);
    process.exit(1);
}
