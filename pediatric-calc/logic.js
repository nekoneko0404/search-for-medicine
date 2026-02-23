
import { STANDARD_WEIGHTS } from './data.js';
import { state } from './state.js';

export function calculateDrug(drug, years, months, weight) {
    drug.tempPiSnippet = null; // Reset to avoid stale overrides
    // 1. Resolve Sub-options (if any)
    if (!weight || weight <= 0) return { error: '体重を入力してください' };

    // Effective Age
    const age = (parseInt(years) || 0) + (parseInt(months) || 0) / 12.0;

    if (!state.drugOptions[drug.id]) state.drugOptions[drug.id] = {};
    const opts = state.drugOptions[drug.id];

    let potency = drug.potency;
    let unit = drug.unit || 'g';
    let subOptionLabel = '';
    let dosageConfig = drug.dosage;
    let diseaseLabel = '';

    // --- Step 1: Resolve subOption (potency + optional dosage override) ---
    if (drug.hasSubOptions && drug.subOptions && drug.subOptions.length > 0) {
        // Auto-select by age every time (so changing age updates the selection)
        if (drug.autoSelectByAge) {
            const autoSub = drug.subOptions.find(o => age >= (o.ageMin || 0) && age < (o.ageMax || 100));
            opts.subOptionId = autoSub ? autoSub.id : drug.subOptions[0].id;
        } else if (!opts.subOptionId) {
            opts.subOptionId = drug.subOptions[0].id;
        }
        const sub = drug.subOptions.find(o => o.id === opts.subOptionId);
        potency = sub.potency || potency;
        unit = sub.unit || unit;
        subOptionLabel = sub.label;
        if (sub.dosage) {
            const parentNote = dosageConfig ? dosageConfig.note : undefined;
            dosageConfig = { ...dosageConfig, ...JSON.parse(JSON.stringify(sub.dosage)) }; // Merge to preserve existing params
            if (!dosageConfig.note) dosageConfig.note = parentNote;
        }
        if (sub.piSnippet) drug.tempPiSnippet = sub.piSnippet; // Override snippet
    }

    // --- Step 2: Resolve disease (dosage override, takes priority over subOption dosage) ---
    if (drug.diseases && drug.diseases.length > 0) {
        if (!opts.diseaseId) opts.diseaseId = drug.diseases[0].id;
        const dis = drug.diseases.find(d => d.id === opts.diseaseId);
        if (dis) {
            // Check for age restriction in disease
            if (dis.ageMin !== undefined && age < dis.ageMin) {
                return { error: `${dis.ageMin}歳未満は適応外です(${dis.label})` };
            }
            if (dis.dosage) {
                const parentNote = dosageConfig ? dosageConfig.note : undefined;
                dosageConfig = { ...dosageConfig, ...JSON.parse(JSON.stringify(dis.dosage)) }; // Merge to preserve existing params
                if (!dosageConfig.note) dosageConfig.note = parentNote;

                // Handle weight-based overrides within disease dosage
                if (dosageConfig.weightBasedOverrides) {
                    const override = dosageConfig.weightBasedOverrides.find(o => weight >= (o.weightMin || 0) && weight < (o.weightMax || 999));
                    if (override) {
                        if (override.timesPerDay !== undefined) dosageConfig.timesPerDay = override.timesPerDay;
                        if (override.absoluteMaxMgPerTime !== undefined) dosageConfig.absoluteMaxMgPerTime = override.absoluteMaxMgPerTime;
                        if (override.note !== undefined) dosageConfig.note = override.note;
                    }
                }
                diseaseLabel = dis.label;
                if (dis.piSnippet) drug.tempPiSnippet = dis.piSnippet; // Override snippet
            }
        }
    }

    // Fixed Age / Weight Step
    if (drug.calcType === 'fixed-age' && drug.fixedDoses) {
        const fixed = drug.fixedDoses.find(f => age >= f.ageMin && age < f.ageMax);
        if (fixed) {
            // If fixed dose has doseMg, divide by potency
            if (fixed.doseMg && potency) {
                fixed.dose = fixed.doseMg / potency;
            }

            let display = fixed.display || `${fixed.dose}${fixed.unit}`;
            // If isPerKg
            if (fixed.isPerKg && !fixed.display) display += "/kg";

            // If fixed dose has times, calculate total daily dose for display
            let totalStr = '', timeStr = '';
            let times = fixed.times || (dosageConfig ? dosageConfig.timesPerDay : 0);
            if (times > 0 && fixed.dose) {
                const total = fixed.dose * times;
                totalStr = `${total}`;
                timeStr = `${fixed.dose}`;
            }

            const isSingleDose = dosageConfig ? !!dosageConfig.isSingleDose : false;
            const totalRange = totalStr || (isSingleDose ? '―' : display);
            const perTimeRange = timeStr || display;

            return {
                result: fixed.label,
                detail: display,
                isFixed: true,
                isSingleDose: isSingleDose,
                note: dosageConfig ? dosageConfig.note : '',
                totalRange: totalRange,
                perTimeRange: perTimeRange,
                times: times,
                unit: fixed.unit || unit,
                piUrl: drug.piUrl,
                piSnippet: drug.tempPiSnippet || drug.piSnippet
            };
        }
        return { error: '該当年齢の用量設定なし', piUrl: drug.piUrl, piSnippet: drug.piSnippet };
    }
    else if (drug.calcType === 'age') {
        const adultDose = drug.adultDose || 0;
        let resultDose = 0;
        let method = '';
        const times = dosageConfig.timesPerDay || 3;

        if (drug.isKampo) {
            // Standard Kampo age ratios
            if (age < 1) resultDose = adultDose * 0.25;
            else if (age < 4) resultDose = adultDose * 0.33;
            else if (age < 7) resultDose = adultDose * 0.5;
            else if (age < 15) resultDose = adultDose * 0.66;
            else resultDose = adultDose;
            method = ' (年齢区分による段階計算)';
        } else {
            // Augsberger formula: adult * (4*age + 20) / 100
            resultDose = adultDose * (4 * age + 20) / 100;
            if (resultDose > adultDose) resultDose = adultDose;
            method = ' (Augsberger式による算出)';
        }

        const round = (n) => Math.round(n * 100) / 100;
        const total = round(resultDose / (potency || 1));
        const perTime = round(total / times);

        return {
            totalRange: `${total}`,
            perTimeRange: `${perTime}`,
            times: times,
            unit: unit,
            disease: diseaseLabel,
            subOption: subOptionLabel,
            note: (dosageConfig.note || '') + method,
            piUrl: drug.piUrl,
            piSnippet: drug.tempPiSnippet || drug.piSnippet
        };
    }
    else if (drug.calcType === 'age-weight-switch' && drug.ageBranches) {
        const branch = drug.ageBranches.find(b => age >= b.ageMin && age < b.ageMax)
            || drug.ageBranches[drug.ageBranches.length - 1];

        const virtualDrug = {
            ...drug,
            ...branch.dosage,
            dosage: branch.dosage,
            ageBranches: null,
            calcType: branch.dosage.calcType || 'weight-step'
        };
        // Ensure weightSteps is specifically moved to top level if it's in dosage
        if (branch.dosage.weightSteps) virtualDrug.weightSteps = branch.dosage.weightSteps;

        return calculateDrug(virtualDrug, years, months, weight);
    }
    else if (drug.calcType === 'weight-step' && drug.weightSteps) {
        let step = drug.weightSteps.find(s => weight >= s.weightMin && weight < s.weightMax);
        if (!step) {
            const last = drug.weightSteps[drug.weightSteps.length - 1];
            if (weight >= last.weightMax) step = last;
        }
        if (step) {
            let display = step.display || `${step.dose}${step.unit}`;
            // If isPerKg
            if (step.isPerKg && !step.display) display += "/kg";

            // Support Daily/PerTime split if timesPerDay is set (e.g. Clavamox)
            let totalStr = '', timeStr = '';
            const times = (dosageConfig && dosageConfig.timesPerDay) || 1;
            const isSingleDose = dosageConfig && dosageConfig.isSingleDose;

            // NEW Check: Is it Per Kg (Zithromac < 15kg) OR (Fixed Dose with times > 1)
            let total = 0;
            let shouldCalculate = false;

            if (step.isPerKg) {
                total = step.dose * weight;
                shouldCalculate = true;
            } else if (times > 1 && step.dose && !isSingleDose) {
                total = step.dose;
                shouldCalculate = true;
            }

            if (shouldCalculate) {
                const roundProduct = (n) => Math.round(n * 100) / 100;
                total = roundProduct(total);

                const perTime = roundProduct(total / times);
                totalStr = `${total}`;
                timeStr = `${perTime}`;

                return {
                    result: step.label,
                    detail: display,
                    totalRange: totalStr,
                    perTimeRange: timeStr,
                    times: times,
                    unit: step.unit || unit,
                    isFixed: !step.isPerKg, // If calculated per kg, treat as standard calc result
                    isSingleDose: isSingleDose,
                    hidePerTime: dosageConfig ? dosageConfig.hidePerTime : false,
                    note: dosageConfig ? dosageConfig.note : '',
                    piUrl: drug.piUrl,
                    piSnippet: drug.tempPiSnippet || drug.piSnippet
                };
            }

            const totalRange = totalStr || (isSingleDose ? "―" : display);
            const perTimeRange = timeStr || display;

            return {
                result: step.label,
                detail: display,
                isFixed: true,
                isSingleDose: isSingleDose,
                hidePerTime: dosageConfig ? dosageConfig.hidePerTime : false,
                note: dosageConfig ? dosageConfig.note : '',
                totalRange: totalRange,
                perTimeRange: perTimeRange,
                times: times,
                unit: step.unit || unit,
                piUrl: drug.piUrl,
                piSnippet: drug.tempPiSnippet || drug.piSnippet
            };
        }
        return { error: '該当体重の用量設定なし', piUrl: drug.piUrl, piSnippet: drug.piSnippet };
    }

    // Standard Calc
    let minMg = 0, maxMg = 0, mgPerDayMin = 0, mgPerDayMax = 0;
    const times = dosageConfig.timesPerDay || 3;

    if (dosageConfig.isByTime) {
        // Support Range for Time dose (e.g. Calonal 10-15mg/kg)
        let tMin = dosageConfig.timeMgKg;
        let tMax = dosageConfig.timeMgKg;

        // Explicit range overrides single value
        if (dosageConfig.minTimeMgKg) tMin = dosageConfig.minTimeMgKg;
        if (dosageConfig.maxTimeMgKg) tMax = dosageConfig.maxTimeMgKg;

        if ((tMin === undefined || tMin === null) && (tMax === undefined || tMax === null)) {
            // Fallback if data is missing (should not happen if audited)
            tMin = tMax = 0;
        } else {
            if (tMin === undefined) tMin = tMax;
            if (tMax === undefined) tMax = tMin;
        }

        mgPerDayMin = tMin * times * weight;
        mgPerDayMax = tMax * times * weight;

        // Apply Time Max (per-dose cap)
        if (dosageConfig.absoluteMaxMgPerTime) {
            const absMaxPerDay = dosageConfig.absoluteMaxMgPerTime * times;
            if (mgPerDayMin > absMaxPerDay) mgPerDayMin = absMaxPerDay;
            if (mgPerDayMax > absMaxPerDay) mgPerDayMax = absMaxPerDay;
        }

        // Fixed dose per time (e.g. Relenza: dosePerTime in mg)
        if (dosageConfig.dosePerTime && !dosageConfig.timeMgKg) {
            mgPerDayMin = dosageConfig.dosePerTime * times;
            mgPerDayMax = dosageConfig.dosePerTime * times;
        }
    } else {
        // Daily dose base
        minMg = (dosageConfig.minMgKg || 0) * weight;
        maxMg = (dosageConfig.maxMgKg || 0) * weight;

        mgPerDayMin = minMg;
        mgPerDayMax = maxMg;
    }

    // Apply Day Max
    if (dosageConfig.absoluteMaxMgPerDay) {
        if (mgPerDayMin > dosageConfig.absoluteMaxMgPerDay) mgPerDayMin = dosageConfig.absoluteMaxMgPerDay;
        if (mgPerDayMax > dosageConfig.absoluteMaxMgPerDay) mgPerDayMax = dosageConfig.absoluteMaxMgPerDay;
    }

    // Apply Day Min Cap (Lower limit Max)
    if (dosageConfig.absoluteMaxMinMgPerDay) {
        if (mgPerDayMin > dosageConfig.absoluteMaxMinMgPerDay) mgPerDayMin = dosageConfig.absoluteMaxMinMgPerDay;
    }

    // Convert to Product Amount
    const roundProduct = (n) => Math.round(n * 10000) / 10000; // Using high precision for intermediate calculation
    const roundDisplay = (n) => Math.round(n * 100) / 100; // 2 places for display

    let totalMin = roundProduct(mgPerDayMin / potency);
    let totalMax = roundProduct(mgPerDayMax / potency);

    let timeMin = roundDisplay(totalMin / times);
    let timeMax = roundDisplay(totalMax / times);

    totalMin = roundDisplay(totalMin);
    totalMax = roundDisplay(totalMax);

    // If max < min due to caps, clamp
    if (totalMax < totalMin) totalMax = totalMin;
    if (timeMax < timeMin) timeMax = timeMin;

    let totalStr = (totalMin === totalMax) ? `${totalMin}` : `${totalMin}〜${totalMax}`;
    let timeStr = (timeMin === timeMax) ? `${timeMin}` : `${timeMin}〜${timeMax}`;

    return {
        totalRange: totalStr,
        perTimeRange: timeStr,
        times: times,
        unit: unit,
        disease: diseaseLabel,
        subOption: subOptionLabel,
        note: dosageConfig.note,
        piUrl: drug.piUrl,
        piSnippet: drug.tempPiSnippet || drug.piSnippet
    };
}
export function getStandardWeight(years, months) {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const exact = STANDARD_WEIGHTS.find(d => d.age === y && d.month === m);
    if (exact) return exact.w;
    const sorted = [...STANDARD_WEIGHTS].sort((a, b) => (a.age * 12 + a.month) - (b.age * 12 + b.month));
    const targetMonths = y * 12 + m;
    let closest = sorted[0];
    for (let d of sorted) {
        if (d.age * 12 + d.month <= targetMonths) closest = d; else break;
    }
    return closest.w;
}
