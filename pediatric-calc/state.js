
export const STORAGE_KEY = 'kusuri_compass_calc_v25_state';

const defaultState = {
    selectedDrugIds: [],
    params: { ageYear: '', ageMonth: '', weight: '' },
    drugOptions: {}
};

const listeners = [];
export function subscribe(listener) { listeners.push(listener); }
function notifyListeners() { for (const listener of listeners) listener(state); }

export function saveState() {
    const data = { selected: state.selectedDrugIds, options: state.drugOptions };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { }
}

export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (data.selected && Array.isArray(data.selected)) state.selectedDrugIds = data.selected.filter(id => typeof id === 'string');
            else state.selectedDrugIds = [];
            if (data.options && typeof data.options === 'object' && !Array.isArray(data.options)) state.drugOptions = data.options;
        }
    } catch (e) { console.warn("Load state failed:", e); }
}

const handler = {
    get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver);
        if (typeof value === 'object' && value !== null) return new Proxy(value, handler);
        return value;
    },
    set(target, property, value, receiver) {
        const result = Reflect.set(target, property, value, receiver);
        notifyListeners();
        return result;
    },
    deleteProperty(target, property) {
        const result = Reflect.deleteProperty(target, property);
        notifyListeners();
        return result;
    }
};

export const state = new Proxy(defaultState, handler);
