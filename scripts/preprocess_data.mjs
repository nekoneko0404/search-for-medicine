
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import iconv from 'iconv-lite';

const RECEPT_CSV = "C:\\Users\\kiyoshi\\Downloads\\y_20260219.csv";
const DIR_2026 = "C:\\Users\\kiyoshi\\Downloads\\2026";
const DIR_2025 = "C:\\Users\\kiyoshi\\Downloads\\2025";
const OUTPUT_FILE = "price-comparison/data/drug_prices.json";

// Indices (1-based for ExcelJS cell access)
const EXCEL_YJ_COL = 2; // B
const EXCEL_NAME_COL = 8; // H
const EXCEL_PRICE_COL = 13; // M

// CSV headers/indices
const CSV_RECEPT_IDX = 2; // C
const CSV_YJ_IDX = 31; // AF

async function getReceptToYJMap() {
    const map = new Map();
    const yjToRecept = new Map();
    return new Promise((resolve, reject) => {
        fs.createReadStream(RECEPT_CSV)
            .pipe(iconv.decodeStream('Shift_JIS'))
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                const recept = row[CSV_RECEPT_IDX];
                const yj = row[CSV_YJ_IDX];
                if (recept && yj) {
                    map.set(recept.trim(), yj.trim());
                    yjToRecept.set(yj.trim(), recept.trim());
                }
            })
            .on('end', () => resolve({ receptToYj: map, yjToRecept }))
            .on('error', reject);
    });
}

async function getPricesFromDir(dirPath) {
    const prices = new Map();
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) continue;
        const file = item.name;
        if (!file.endsWith('.xlsx')) continue;

        console.log(`Processing ${file}...`);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(dirPath, file));
        const worksheet = workbook.worksheets[0];

        worksheet.eachRow((row, rowNumber) => {
            // Data usually starts after row 1 (headers)
            if (rowNumber < 2) return;

            const yj = row.getCell(EXCEL_YJ_COL).value?.toString()?.trim();
            const name = row.getCell(EXCEL_NAME_COL).value?.toString()?.trim();
            const priceVal = row.getCell(EXCEL_PRICE_COL).value;

            let price = NaN;
            if (typeof priceVal === 'number') {
                price = priceVal;
            } else if (typeof priceVal === 'object' && priceVal !== null) {
                // Handle calculated cells or rich text if any
                price = priceVal.result !== undefined ? parseFloat(priceVal.result) : NaN;
            } else if (typeof priceVal === 'string') {
                price = parseFloat(priceVal);
            }

            if (yj && !isNaN(price) && yj.length >= 12) {
                // Update map. If name exists, keep it.
                if (!prices.has(yj) || name) {
                    prices.set(yj, { name: name || prices.get(yj)?.name, price });
                }
            }
        });
    }
    return prices;
}

async function main() {
    console.log("Starting preprocessing...");

    if (!fs.existsSync("price-comparison/data")) {
        fs.mkdirSync("price-comparison/data", { recursive: true });
    }

    const { receptToYj, yjToRecept } = await getReceptToYJMap();
    console.log(`Loaded ${receptToYj.size} mappings from CSV.`);

    const prices2025 = await getPricesFromDir(DIR_2025);
    console.log(`Loaded ${prices2025.size} drug prices from 2025 data.`);

    const prices2026 = await getPricesFromDir(DIR_2026);
    console.log(`Loaded ${prices2026.size} drug prices from 2026 data.`);

    const combined = [];

    // Use all YJ codes found in both 2025 and 2026
    const allYJs = new Set([...prices2025.keys(), ...prices2026.keys()]);
    console.log(`Total unique YJ codes across both years: ${allYJs.size}`);

    for (const yj of allYJs) {
        const data2025 = prices2025.get(yj);
        const data2026 = prices2026.get(yj);
        const recept = yjToRecept.get(yj);

        const name = data2026?.name || data2025?.name || "Unknown";
        const oldPrice = data2025 ? data2025.price : null;
        const newPrice = data2026 ? data2026.price : null;

        let diff = null;
        let ratio = null;

        if (oldPrice !== null && newPrice !== null) {
            diff = Number((newPrice - oldPrice).toFixed(2));
            ratio = oldPrice !== 0 ? Number(((newPrice / oldPrice - 1) * 100).toFixed(2)) : null;
        }

        combined.push({
            yj,
            recept: recept || null,
            name,
            oldPrice,
            newPrice,
            diff,
            ratio
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combined, null, 2));
    console.log(`Finished! Saved ${combined.length} items to ${OUTPUT_FILE}`);
}

main().catch(console.error);
