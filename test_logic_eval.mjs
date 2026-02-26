import fs from 'fs';

const logicJs = fs.readFileSync('pediatric-calc/logic.js', 'utf8');

// Mock state and data
global.STANDARD_WEIGHTS = [];
global.state = { params: { ageYear: '5', ageMonth: '0', weight: '20' }, drugOptions: {} };

const m = logicJs.match(/export function calculateDrug\([\s\S]*?^}/m);
if (m) {
    let fnStr = m[0].replace('export function calculateDrug', 'global.calculateDrug = function');
    // evaluate the function
    try {
        eval(fnStr);
        const drug = { id: 'tomi_dry', yjCode: 'tomi_yj', name: 'トミロン', calcType: 'weight-step', weightSteps: [{ weightMin: 0, weightMax: 999, dose: 9, isPerKg: true }] };
        const res = global.calculateDrug(drug, 5, 0, 20);
        console.log('Result:', res);
    } catch (e) {
        console.error('Logic execute/eval error:', e);
    }
} else {
    console.log('Could not find calculateDrug');
}
