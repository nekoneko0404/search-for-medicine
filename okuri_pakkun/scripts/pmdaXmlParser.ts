import { readFileSync } from 'fs';
import { parseStringPromise } from 'xml2js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DrugProduct {
  product_name_japanese: string[];
  generic_name_japanese: string[];
  manufacturer_japanese: string[];
  indications_japanese: { indication: string[] }[];
  side_effects_summary_japanese: string[];
  // Add other fields as needed
}

interface MedicalDevice {
  device_name_japanese: string[];
  manufacturer_japanese: string[];
  // Add other fields as needed
}

interface PmdaOpenData {
  drug_product?: DrugProduct[];
  medical_device?: MedicalDevice[];
}

async function parsePmdaXml(xmlFilePath: string): Promise<PmdaOpenData | null> {
  try {
    const xml = readFileSync(xmlFilePath, 'utf8');
    const result = await parseStringPromise(xml);
    return result.pmda_open_data;
  } catch (error) {
    console.error('Error parsing PMDA XML:', error);
    return null;
  }
}

async function main() {
  const xmlFilePath = path.join(__dirname, '../../pmda_example.xml'); // Adjust path to point to the root
  const parsedData = await parsePmdaXml(xmlFilePath);

  if (parsedData) {
    console.log('--- Parsed PMDA Data ---');

    if (parsedData.drug_product) {
      parsedData.drug_product.forEach((drug) => {
        console.log('Drug Product:');
        console.log(`  Product Name (JP): ${drug.product_name_japanese ? drug.product_name_japanese[0] : 'N/A'}`);
        console.log(`  Generic Name (JP): ${drug.generic_name_japanese ? drug.generic_name_japanese[0] : 'N/A'}`);
        console.log(`  Manufacturer (JP): ${drug.manufacturer_japanese ? drug.manufacturer_japanese[0] : 'N/A'}`);
        if (drug.indications_japanese && drug.indications_japanese.length > 0) {
          console.log('  Indications (JP):');
          drug.indications_japanese[0].indication.forEach((ind) => console.log(`    - ${ind}`));
        }
        console.log(`  Side Effects (JP): ${drug.side_effects_summary_japanese ? drug.side_effects_summary_japanese[0] : 'N/A'}`);
        console.log('-------------------------');
      });
    }

    if (parsedData.medical_device) {
      parsedData.medical_device.forEach((device) => {
        console.log('Medical Device:');
        console.log(`  Device Name (JP): ${device.device_name_japanese ? device.device_name_japanese[0] : 'N/A'}`);
        console.log(`  Manufacturer (JP): ${device.manufacturer_japanese ? device.manufacturer_japanese[0] : 'N/A'}`);
        console.log('-------------------------');
      });
    }
  }
}

main();