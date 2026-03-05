
import fs from 'fs';
import iconv from 'iconv-lite';

const text = fs.readFileSync('C:\\Users\\kiyoshi\\Downloads\\y_20260219.csv');
const decoded = iconv.decode(text, 'Shift_JIS');
const lines = decoded.split('\n');
if (lines.length > 1) {
    const line = lines[1]; // Use second line as first might have headers or be empty
    const cols = line.split(',').map(c => c.replace(/\"/g, '').trim());
    cols.forEach((c, i) => console.log(i + ': ' + c));
}
