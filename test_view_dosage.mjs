import fs from 'fs';

const uiJs = fs.readFileSync('pediatric-calc/ui.js', 'utf8');

global.PEDIATRIC_DRUGS = [{ id: 'tomi_dry', yjCode: 'tomi_yj', name: 'トミロン', calcType: 'weight-step' }];
global.DOSAGE_DATA = { tomi_yj: { dosage: 'Some dosage text' } };
global.state = { params: { ageYear: '5', ageMonth: '0', weight: '20' }, drugOptions: {} };

global.calculateDrug = (drug, y, m, w) => ({ totalRange: '180', perTimeRange: '60', times: 3, unit: 'mg' });

global.document = {
    getElementById: (id) => {
        return {
            id,
            innerHTML: '',
            textContent: '',
            style: {},
            classList: {
                _set: new Set(),
                add(c) { this._set.add(c); },
                remove(c) { this._set.delete(c); }
            },
            onclick: null
        };
    }
};

global.window = {};

const m = uiJs.match(/window\.viewDosageDetails\s*=\s*\(idOrYjCode\)\s*=>\s*\{([\s\S]*?)};\r?\n\r?\nwindow\.toggleDrug/);
if (m) {
    const fn = new Function('idOrYjCode', m[1]);
    try {
        fn('tomi_dry');
        console.log('Success without error!');
    } catch (e) {
        console.error('Execution Error:', e);
    }
} else {
    console.log('Failed to extract function body');
}
