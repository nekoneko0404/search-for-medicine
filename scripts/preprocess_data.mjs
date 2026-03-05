
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import iconv from 'iconv-lite';

const HOT_CSV = "C:\\Users\\kiyoshi\\Downloads\\医薬品HOT コードマスター (1).TXT";
const DIR_2026 = "C:\\Users\\kiyoshi\\Downloads\\2026";
const DIR_2025 = "C:\\Users\\kiyoshi\\Downloads\\2025";
const OUTPUT_FILE = "price-comparison/data/drug_prices.json";

// Shipment Search App Data Source (Google Sheet)
const SHIPMENT_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU/gviz/tq?tqx=out:csv&tq=SELECT%20C%2CE%2CF%2CG%2CH%2CI%2CL%2CN%2CO%2CP%2CQ%2CT%2CW%2CX";
// Columns: C (0: Ingredient), E (1: YJ), F (2: Product), ...

// Indices (1-based for ExcelJS cell access)
const EXCEL_YJ_COL = 2; // B
const EXCEL_NAME_COL = 8; // H
const EXCEL_PRICE_COL = 13; // M
const EXCEL_KEIKA_COL = 14; // N

// CSV headers/indices for HOT master
// H column (0-indexed 7) is YJ, I column (0-indexed 8) is Recept
const CSV_YJ_IDX = 7;
const CSV_RECEPT_IDX = 8;
const CSV_NAME_IDX = 11; // L column (医薬品名)

const OLD_PRICE_CSV = "C:\\Users\\kiyoshi\\Downloads\\y_20260219.csv";
const CSV_OLD_PRICE_RECEPT_IDX = 2; // C
const CSV_OLD_PRICE_VAL_IDX = 11; // L

async function getIngredientMapFromShipmentApp() {
    console.log("Fetching ingredient names from shipment search data source...");
    try {
        const response = await fetch(SHIPMENT_SHEET_CSV_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();

        const map = new Map();
        const lines = csvText.split('\n');

        // Skip header if any
        for (const line of lines) {
            // Rough CSV parse (handle quotes)
            const parts = line.split('","').map(p => p.replace(/"/g, '').trim());
            if (parts.length >= 2) {
                const ingredient = parts[0];
                const yj = parts[1];
                if (yj && ingredient && yj !== 'YJコード') {
                    map.set(yj, ingredient);
                }
            }
        }
        console.log(`Loaded ${map.size} ingredient mappings from shipment data.`);
        return map;
    } catch (e) {
        console.error("Failed to fetch shipment data:", e);
        return new Map();
    }
}

async function getOldPricesFromCSV() {
    const prices = new Map();
    return new Promise((resolve, reject) => {
        fs.createReadStream(OLD_PRICE_CSV)
            .pipe(iconv.decodeStream('Shift_JIS'))
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                const recept = row[CSV_OLD_PRICE_RECEPT_IDX];
                const priceStr = row[CSV_OLD_PRICE_VAL_IDX];
                if (recept && priceStr) {
                    const price = parseFloat(priceStr.replace(/,/g, ''));
                    if (!isNaN(price)) {
                        prices.set(recept.trim(), price);
                    }
                }
            })
            .on('end', () => resolve(prices))
            .on('error', reject);
    });
}

async function getHOTMaster() {
    const master = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(HOT_CSV)
            .pipe(iconv.decodeStream('Shift_JIS'))
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                const yj = row[CSV_YJ_IDX]?.trim();
                const recept = row[CSV_RECEPT_IDX]?.trim();
                const name = row[CSV_NAME_IDX]?.trim();
                if (yj || recept) {
                    master.push({
                        yj: yj || null,
                        recept: recept || null,
                        name: name || "Unknown Name"
                    });
                }
            })
            .on('end', () => resolve(master))
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
            if (rowNumber < 2) return;

            const yj = row.getCell(EXCEL_YJ_COL).value?.toString()?.trim();
            const name = row.getCell(EXCEL_NAME_COL).value?.toString()?.trim();
            const priceVal = row.getCell(EXCEL_PRICE_COL).value;
            const keikaVal = row.getCell(EXCEL_KEIKA_COL).value;

            let price = NaN;
            if (typeof priceVal === 'number') {
                price = priceVal;
            } else if (typeof priceVal === 'object' && priceVal !== null) {
                price = priceVal.result !== undefined ? parseFloat(priceVal.result) : NaN;
            } else if (typeof priceVal === 'string') {
                price = parseFloat(priceVal.replace(/,/g, ''));
            }

            let hasKeika = false;
            if (keikaVal) {
                const kStr = keikaVal.toString().trim();
                if (kStr.length > 0) hasKeika = true;
            }

            if (yj && !isNaN(price)) {
                // We use YJ as primary key from Excel
                if (!prices.has(yj) || name) {
                    prices.set(yj, { price, hasKeika });
                }
            }
        });
    }
    return prices;
}

async function main() {
    console.log("Starting TOTAL refactor based on HOT Master (Synced Ingredients)...");

    if (!fs.existsSync("price-comparison/data")) {
        fs.mkdirSync("price-comparison/data", { recursive: true });
    }

    // 0. Load Ingredient Mapping from Shipment Search App
    const ingredientMap = await getIngredientMapFromShipmentApp();

    // 1. Load Master (Baseline)
    const hotMaster = await getHOTMaster();
    console.log(`Loaded ${hotMaster.length} items from HOT Master.`);

    // 2. Load Price Data
    const prices2025 = await getPricesFromDir(DIR_2025);
    console.log(`Loaded ${prices2025.size} drug prices from 2025 data (Excel).`);

    const oldPricesFallback = await getOldPricesFromCSV();
    console.log(`Loaded ${oldPricesFallback.size} old prices from Fallback CSV.`);

    const prices2026 = await getPricesFromDir(DIR_2026);
    console.log(`Loaded ${prices2026.size} drug prices from 2026 data (Excel).`);

    const combined = [];
    const processedKeys = new Set();

    // 3. Iterate over HOT Master as Truth
    for (const drug of hotMaster) {
        const { yj, recept, name } = drug;

        // Skip if we've already processed this exact pair to avoid extreme duplicates if any in master
        const key = `${yj || ''}-${recept || ''}`;
        if (processedKeys.has(key)) continue;
        processedKeys.add(key);

        const data2025 = yj ? prices2025.get(yj) : null;
        const data2026 = yj ? prices2026.get(yj) : null;

        let oldPrice = data2025 ? data2025.price : null;
        // Fallback for old price
        if ((oldPrice === null || isNaN(oldPrice)) && recept) {
            if (oldPricesFallback.has(recept)) {
                oldPrice = oldPricesFallback.get(recept);
            }
        }

        const newPrice = data2026 ? data2026.price : null;
        const hasKeika = data2026?.hasKeika || data2025?.hasKeika || false;

        let diff = null;
        let ratio = null;

        if (oldPrice !== null && newPrice !== null) {
            diff = Number((newPrice - oldPrice).toFixed(2));
            ratio = oldPrice !== 0 ? Number(((newPrice / oldPrice - 1) * 100).toFixed(2)) : null;
        }

        let finalName = name;
        if (hasKeika) {
            finalName += "【経過措置】";
        }

        // Use synced ingredient name if available
        const ingredient = (yj && ingredientMap.has(yj)) ? ingredientMap.get(yj) : "";

        // Only include if we have at least one price or if it's explicitly sought
        // To keep file size manageable, we check if it has any price info
        if (oldPrice !== null || newPrice !== null) {
            combined.push({
                yj,
                recept,
                name: finalName,
                ingredient: ingredient,
                oldPrice,
                newPrice,
                diff,
                ratio
            });
        }
    }

    // Optional: Add YJs from Excel that WEREN'T in HOT master just in case (though highly unlikely)
    // But since user requested HOT as base, we might strictly stick to HOT master.

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combined, null, 2));
    console.log(`Finished! Saved ${combined.length} items to ${OUTPUT_FILE}`);
}

main().catch(console.error);
