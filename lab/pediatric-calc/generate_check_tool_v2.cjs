
const fs = require('fs');
const path = require('path');

const calcPath = 'c:/Users/kiyoshi/Github_repository/search-for-medicine/lab/pediatric-calc/calc.js';

let calcContent = fs.readFileSync(calcPath, 'utf8');

// Extract variable block accurately
function extractVar(content, name) {
    const searchStr = `const ${name} = `;
    const startIdx = content.indexOf(searchStr);
    if (startIdx === -1) return "[]";

    let depth = 0;
    let result = "";
    let foundStart = false;

    for (let i = startIdx + searchStr.length; i < content.length; i++) {
        const char = content[i];
        if (char === '[' || char === '{') {
            depth++;
            foundStart = true;
        } else if (char === ']' || char === '}') {
            depth--;
        }

        if (foundStart) result += char;

        if (foundStart && depth === 0) break;
    }
    return result;
}

const drugsStr = extractVar(calcContent, 'PEDIATRIC_DRUGS');
const catStart = calcContent.indexOf('const YJ_CATEGORY_MAP = {');
const catEnd = calcContent.indexOf('};', catStart) + 1;
const catsStr = calcContent.substring(catStart + 'const YJ_CATEGORY_MAP = '.length, catEnd);
const mainCatStart = calcContent.indexOf('const DRUG_CATEGORIES = {');
const mainCatEnd = calcContent.indexOf('};', mainCatStart) + 1;
const mainCatsStr = calcContent.substring(mainCatStart + 'const DRUG_CATEGORIES = '.length, mainCatEnd);

// Extract calculateDrug function
const funcStart = calcContent.indexOf('function calculateDrug');
const nextFunc = calcContent.indexOf('function updatePrescriptionSheet', funcStart);
const funcStr = calcContent.substring(funcStart, nextFunc);

const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>小児用量計算機 全薬剤一括チェック</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-light: #eff6ff;
            --bg: #f8fafc;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --success: #059669;
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); margin: 0; padding: 0; color: var(--text-main); }
        
        .header { 
            background: white; 
            padding: 20px 24px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            position: sticky; 
            top: 0; 
            z-index: 1000; 
            border-bottom: 1px solid var(--border);
        }
        
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        h1 { margin: 0; font-size: 1.2rem; color: var(--primary); font-weight: 700; }
        .meta { font-size: 0.75rem; color: var(--text-muted); }
        
        .controls { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
        .input-group { display: flex; flex-direction: column; gap: 4px; }
        label { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
        input, select { 
            padding: 8px 12px; 
            border: 1px solid var(--border); 
            border-radius: 6px; 
            font-size: 0.9rem; 
            background: #fff;
        }
        
        .presets { margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap; border-top: 1px solid var(--border); padding-top: 12px; }
        .btn { 
            padding: 4px 10px; 
            background: var(--primary-light); 
            color: var(--primary); 
            border: 1px solid rgba(37, 99, 235, 0.1); 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 0.8rem; 
        }
        .btn:hover, .btn-active { background: var(--primary); color: white; }
        
        .main-content { padding: 0; margin-top: 0; }
        
        table { width: 100%; border-collapse: collapse; background: white; }
        
        /* THEAD STICKY POSITIONING */
        thead th { 
            background: #f1f5f9; 
            padding: 12px 16px; 
            text-align: left; 
            font-size: 0.75rem; 
            font-weight: 700; 
            color: var(--text-muted); 
            position: sticky; 
            top: 0; /* JS will update this to match header height */
            z-index: 900;
            border-bottom: 2px solid var(--border);
            white-space: nowrap;
        }
        
        td { padding: 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
        
        .drug-name { font-weight: 700; color: #0f172a; font-size: 0.95rem; margin-bottom: 4px; }
        .category-tag { font-size: 0.65rem; background: var(--bg); padding: 2px 8px; border-radius: 10px; color: var(--text-muted); display: inline-block; }
        
        .result-main { font-weight: 700; color: var(--success); font-size: 1.1rem; }
        .result-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
        .logic-cell { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; max-width: 250px; }
        
        .pi-snippet { font-size: 0.7rem; color: #94a3b8; line-height: 1.4; max-width: 350px; height: 2.8em; overflow: hidden; }
        .pi-snippet:hover { height: auto; overflow: visible; background: #fffbeb; z-index: 10; position: relative; padding: 4px; outline: 1px solid #fed7aa; }

        tr:hover td { background-color: #fbfcfe; }
        
        .error { color: #ef4444; font-size: 0.8rem; font-weight: bold; }
        select { font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="header" id="mainHeader">
        <div class="header-top">
            <h1>小児用量計算機 一括チェックツール</h1>
            <div id="dateStr" class="meta"></div>
        </div>
        <div class="controls">
            <div class="input-group">
                <label>年齢（歳）</label>
                <input type="number" id="y" value="1" style="width: 50px">
            </div>
            <div class="input-group">
                <label>年齢（月）</label>
                <input type="number" id="m" value="0" style="width: 50px">
            </div>
            <div class="input-group">
                <label>体重 (kg)</label>
                <input type="number" id="w" value="10" step="0.1" style="width: 70px">
            </div>
            <div class="input-group" style="flex-grow: 1">
                <label>薬剤検索</label>
                <input type="text" id="q" placeholder="薬剤名・カテゴリ..." style="width: 100%">
            </div>
        </div>
        <div class="presets" id="presets"></div>
    </div>

    <div class="main-content">
        <table id="table">
            <thead>
                <tr id="tableHeaderRow">
                    <th style="width: 250px">薬剤名 / カテゴリ</th>
                    <th style="width: 180px">設定 (疾患 / 規格)</th>
                    <th>計算設定・注釈</th>
                    <th style="width: 200px">計算結果 (アプリ表示)</th>
                    <th>添付文書抜粋</th>
                </tr>
            </thead>
            <tbody id="tbody"></tbody>
        </table>
    </div>

    <script>
        const PEDIATRIC_DRUGS = ` + drugsStr + `;
        const YJ_CATEGORY_MAP = ` + catsStr + `;
        const DRUG_CATEGORIES = ` + mainCatsStr + `;

        const state = {
            drugOptions: {},
            params: { ageYear: 1, ageMonth: 0, weight: 10 }
        };

        ` + funcStr + `

        const presetList = [
            { l: "0歳5か月 11kg", y: 0, m: 5, w: 11 },
            { l: "0歳7か月 9kg", y: 0, m: 7, w: 9 },
            { l: "1歳 10kg", y: 1, m: 0, w: 10 },
            { l: "5歳 18kg", y: 5, m: 0, w: 18 },
            { l: "6歳 18kg", y: 6, m: 0, w: 18 },
            { l: "7歳 18kg", y: 7, m: 0, w: 18 },
            { l: "12歳 18kg", y: 12, m: 0, w: 18 },
            { l: "12歳 80kg", y: 12, m: 0, w: 80 }
        ];

        function render() {
            const y = parseInt(document.getElementById('y').value) || 0;
            const m = parseInt(document.getElementById('m').value) || 0;
            const w = parseFloat(document.getElementById('w').value) || 0;
            const q = document.getElementById('q').value.toLowerCase();

            state.params.ageYear = y;
            state.params.ageMonth = m;
            state.params.weight = w;

            const tbody = document.getElementById('tbody');
            tbody.innerHTML = '';

            PEDIATRIC_DRUGS.forEach((drug) => {
                const searchStr = (drug.name + (drug.yjCode || '') + (drug.category || '')).toLowerCase();
                if (q && !searchStr.includes(q)) return;

                const res = calculateDrug(drug, y, m, w, state.drugOptions[drug.id] || {});
                
                const tr = document.createElement('tr');
                
                let optHtml = '';
                if (drug.hasSubOptions) {
                    optHtml += '<select onchange="window.setOpt(\\''+drug.id+'\\', \\'subOptionId\\', this.value)">';
                    if (!state.drugOptions[drug.id]?.subOptionId) {
                        if (!state.drugOptions[drug.id]) state.drugOptions[drug.id] = {};
                        state.drugOptions[drug.id].subOptionId = drug.subOptions[0].id;
                    }
                    drug.subOptions.forEach(o => {
                        const sel = (state.drugOptions[drug.id]?.subOptionId === o.id) ? 'selected' : '';
                        optHtml += '<option value="'+o.id+'" '+sel+'>'+o.label+'</option>';
                    });
                    optHtml += '</select>';
                }
                if (drug.diseases) {
                    if (optHtml) optHtml += '<div style="margin-top: 5px;"></div>';
                    optHtml += '<select onchange="window.setOpt(\\''+drug.id+'\\', \\'diseaseId\\', this.value)">';
                    if (!state.drugOptions[drug.id]) state.drugOptions[drug.id] = {};
                    if (!state.drugOptions[drug.id]?.diseaseId) {
                        state.drugOptions[drug.id].diseaseId = drug.diseases[0].id;
                    }
                    drug.diseases.forEach(d => {
                        const sel = (state.drugOptions[drug.id]?.diseaseId === d.id) ? 'selected' : '';
                        optHtml += '<option value="'+d.id+'" '+sel+'>'+d.label+'</option>';
                    });
                    optHtml += '</select>';
                }

                const yjPrefix = drug.yjCode ? drug.yjCode.substring(0, 4) : '';
                const cat = YJ_CATEGORY_MAP[yjPrefix] || DRUG_CATEGORIES[drug.category] || drug.category;

                let resText = '';
                if (res.error) {
                    resText = '<span class="error">'+res.error+'</span>';
                } else if (res.isFixed && !res.totalRange) {
                    resText = '<div class="result-main">' + res.detail + '</div>';
                } else {
                    resText = '<div class="result-main">' + (res.totalRange || '-') + ' <span style="font-size: 0.7rem; color: #666;">' + (res.unit || '') + '/日</span></div>';
                    resText += '<div class="result-sub">' + (res.perTimeRange || '-') + ' ' + (res.unit || '') + ' × ' + (res.times || '-') + '回</div>';
                }

                tr.innerHTML = "<td><div class='drug-name'>" + drug.name + "</div><div class='category-tag'>" + cat + "</div></td>" +
                               "<td>" + optHtml + "</td>" +
                               "<td><div class='logic-cell'>" + (res.note || '') + "</div></td>" +
                               "<td>" + resText + "</td>" +
                               "<td><div class='pi-snippet'>" + (res.piSnippet || drug.piSnippet || '-') + "</div></td>";
                tbody.appendChild(tr);
            });

            updateHeaderPosition();
        }

        function updateHeaderPosition() {
            const h = document.getElementById('mainHeader').offsetHeight;
            document.querySelectorAll('thead th').forEach(th => th.style.top = (h - 1) + 'px');
        }

        window.setOpt = (id, k, v) => {
            if (!state.drugOptions[id]) state.drugOptions[id] = {};
            state.drugOptions[id][k] = v;
            render();
        };

        window.onload = () => {
            document.getElementById('dateStr').textContent = '生成日時: ' + new Date().toLocaleString('ja-JP');

            const pDiv = document.getElementById('presets');
            presetList.forEach(p => {
                const b = document.createElement('button');
                b.className = 'btn';
                b.textContent = p.l;
                b.onclick = () => {
                    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btn-active'));
                    b.classList.add('btn-active');
                    document.getElementById('y').value = p.y;
                    document.getElementById('m').value = p.m;
                    document.getElementById('w').value = p.w;
                    render();
                };
                pDiv.appendChild(b);
            });

            document.querySelectorAll('input').forEach(i => i.oninput = render);
            new ResizeObserver(updateHeaderPosition).observe(document.getElementById('mainHeader'));
            render();
        };
    </script>
</body>
</html>
`;

fs.writeFileSync('c:/Users/kiyoshi/Github_repository/search-for-medicine/lab/pediatric-calc/all_drugs_calc_check.html', html);
console.log('Success: all_drugs_calc_check.html generated.');
