import fs from 'fs';

// Read calc.js content
const calcJsContent = fs.readFileSync('lab/pediatric-calc/calc.js', 'utf8');

// Extract PEDIATRIC_DRUGS array using regex or simple eval approach (safer with regex/parsing here due to deps)
// Since calc.js has imports/exports, we can't just require it easily without module setup.
// Let's rely on the file structure being consistent.
// We'll extract the array part string and eval it in a safe context or just parse it.
// Actually, since we are in node, we can just import it if we handle the dependencies.
// calc.js imports PHARMA_CLASSIFICATION_MAP. Let's mock it or just parse the text.
// Parsing text is safer to avoid execution side effects.

function parseCalcJs(content) {
    const drugsMatch = content.match(/const PEDIATRIC_DRUGS = (\[[\s\S]*?\]);/);
    if (!drugsMatch) throw new Error("Could not find PEDIATRIC_DRUGS array");

    // We need to verify we captured the ending bracket correctly.
    // The regex above might stop early if there are internal brackets.
    // Let's simply import it by temporarily modifying the file to be a standalone module or mocking the dependency.
    return eval(drugsMatch[1]);
}

// Since calc.js has an import statement at the END, let's just strip lines starting with 'import' or 'document' usage if we were to eval.
// Better approach: Create a temporary file that exports PEDIATRIC_DRUGS and mocks the dependency.

const tempJsContent = `
const PHARMA_CLASSIFICATION_MAP = {}; // Mock
${calcJsContent.replace(/import .* from .*/g, '').replace(/document\.addEventListener[\s\S]*$/, '').replace(/export function.*/, '')}
export { PEDIATRIC_DRUGS };
`;

// Write temp file
fs.writeFileSync('temp_audit_loader.mjs', tempJsContent);

// Import and analyze
import('./temp_audit_loader.mjs').then((module) => {
    const drugs = module.PEDIATRIC_DRUGS;
    generateReport(drugs);
    fs.unlinkSync('temp_audit_loader.mjs');
}).catch(err => {
    console.error("Error loading drugs:", err);
});

function generateReport(drugs) {
    let md = "# Comprehensive Pediatric Drug Data Audit\n\n";
    md += "This report compares current logic against PI snippets and checks for potential issues (e.g., missing max caps).\n\n";

    md += "| Check | Drug Name | Dosage Rule (Active Ingredient) | Freq | Max Limits | PI Snippet Quote |\n";
    md += "| :--- | :--- | :--- | :--- | :--- | :--- |\n";

    let potentialIssuesCount = 0;

    drugs.forEach(d => {
        const issues = [];
        const dosage = d.dosage || {};

        // 1. Check for missing Max Caps (Absolute Limits)
        // Antibiotics usually need this.
        const rule = [];
        if (dosage.minMgKg) rule.push(`${dosage.minMgKg}${dosage.maxMgKg !== dosage.minMgKg ? '-' + dosage.maxMgKg : ''} mg/kg`);
        if (dosage.timeMgKg) rule.push(`Time: ${dosage.timeMgKg} mg/kg`);
        if (d.calcType === 'fixed-age') rule.push('Fixed Age');
        if (d.calcType === 'weight-step') rule.push('Weight Step');
        if (d.calcType === 'age-weight-switch') rule.push('Age/Weight Switch');

        let limits = [];
        if (dosage.absoluteMaxMgPerDay) limits.push(`Day: ${dosage.absoluteMaxMgPerDay}mg`);
        if (dosage.absoluteMaxMgPerTime) limits.push(`Time: ${dosage.absoluteMaxMgPerTime}mg`);
        if (dosage.absoluteMaxMgKg) limits.push(`Kg: ${dosage.absoluteMaxMgKg}mg/kg`);

        // Heuristic Checks
        if (!dosage.absoluteMaxMgPerDay && !dosage.absoluteMaxMgPerTime && !d.isAdultOnly) {
            // Check if it looks like an antibiotic or potent drug
            const isAntibiotic = d.name.includes("シリン") || d.name.includes("セフ") || d.name.includes("マイシン") || d.name.includes("キノロン") || d.name.includes("クラバモックス");
            if (isAntibiotic) {
                issues.push("🔴 No Adult Max");
            } else {
                // Warning for checking
                issues.push("⚠️ No Max");
            }
        }

        // Check for Potency confusion (High numbers in minMgKg might indicate preparation amount if potency is not 1)
        // If minMgKg > 100, it's very high for an active ingredient usually, unless it's like Fosfomycin (40-120).
        // If minMgKg is like 0.04, it might be correct (Hokunalin), but good to verify.

        const status = issues.length > 0 ? issues.join("<br>") : "✅";
        if (issues.length > 0) potentialIssuesCount++;

        md += `| ${status} | **${d.name}**<br><span style="font-size:0.8em; color:gray">${d.yjCode}</span> | ${rule.join('<br>')} | ${dosage.timesPerDay || '?'}x | ${limits.join('<br>') || '-'} | <span style="font-size:0.8em">${d.piSnippet || ''}</span> |\n`;
    });

    md += `\n\n**Total Drugs with Potential Issues: ${potentialIssuesCount}**\n`;

    fs.writeFileSync('docs/audit_drug_data_report.md', md);
    console.log("Audit report generated at docs/audit_drug_data_report.md");
}
