import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */let l,h,f,d,g,y,_,b,c,m,v,p;const $="https://recipe-worker.neko-neko-0404.workers.dev",w=[{label:"血圧が高め",value:"血圧"},{label:"血糖値が気になる",value:"血糖値"},{label:"腎臓をいたわりたい",value:"腎臓"},{label:"肝臓をいたわりたい",value:"肝臓"},{label:"体重が気になる",value:"減量"},{label:"尿酸値が高め",value:"尿酸値"},{label:"骨密度が気になる",value:"骨強化"},{label:"筋力をつけたい",value:"筋力アップ"},{label:"認知機能を維持したい",value:"脳活性化"},{label:"中性脂肪が気になる",value:"中性脂肪"},{label:"コレステロールが高め",value:"コレステロール"},{label:"風邪気味",value:"免疫力"},{label:"肩こりがひどい",value:"肩こり解消"},{label:"冷え性",value:"血行促進"},{label:"疲れが取れない",value:"疲労回復"},{label:"便秘気味",value:"腸内環境"},{label:"貧血気味",value:"鉄分補給"},{label:"肌荒れ",value:"美肌"}];function L(){l=document.getElementById("recipe-form"),h=document.getElementById("symptoms-container"),f=document.getElementById("api-key-input-container"),d=document.getElementById("api-key"),g=document.getElementById("advanced-settings-toggle"),y=document.getElementById("advanced-settings"),_=document.getElementById("result-section"),b=document.getElementById("loading"),c=document.getElementById("recipe-cards"),m=document.getElementById("save-api-key"),v=document.getElementById("save-key-warning"),p=document.getElementById("save-form-state"),h?A():console.error("Symptoms container not found!"),l&&(T(),q(),D(),H()),console.log("Recipe App Init Completed")}window.debugInit=L;function A(){h.innerHTML=w.map(t=>`<label class="cursor-pointer group">
            <input type="checkbox" name="symptoms" value="${t.value}" class="peer hidden">
            <span class="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-all select-none text-sm peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-orange-500 peer-checked:shadow-md peer-checked:scale-105 peer-checked:hover:bg-orange-600 transform">
                ${t.label}
            </span>
        </label>`).join("")}function T(){g&&y&&g.addEventListener("click",()=>{y.classList.toggle("hidden");const r=g.querySelector("i");y.classList.contains("hidden")?r.classList.remove("rotate-180"):r.classList.add("rotate-180")}),m&&m.addEventListener("change",r=>{r.target.checked?(v.classList.remove("hidden"),d.value&&localStorage.setItem("recipe_app_user_key",d.value)):(v.classList.add("hidden"),localStorage.removeItem("recipe_app_user_key"))}),d&&d.addEventListener("input",r=>{m.checked&&localStorage.setItem("recipe_app_user_key",r.target.value)});const t=document.getElementsByName("api_option");Array.from(t).forEach(r=>{r.addEventListener("change",a=>{const n=a.target.value;localStorage.setItem("recipe_app_provider",n),n==="system"?f.classList.add("hidden"):f.classList.remove("hidden")})}),l.addEventListener("submit",C);const s=document.getElementById("print-btn");s&&s.addEventListener("click",()=>{document.querySelectorAll("#recipe-cards details").forEach(o=>o.setAttribute("open","true"));const a=document.getElementById("print-header"),n=document.querySelectorAll(".recipe-card");if(document.querySelectorAll(".cloned-header").forEach(o=>o.remove()),a&&n.length>0)for(let o=1;o<n.length;o++){const i=a.cloneNode(!0);i.classList.add("cloned-header"),i.id="",i.querySelectorAll("img").forEach(x=>{x.setAttribute("loading","eager")}),n[o].parentNode.insertBefore(i,n[o])}window.print(),setTimeout(()=>{clonedHeaders.forEach(o=>o.remove())},100)});const e=document.getElementById("copy-prompt-btn");e&&e.addEventListener("click",B)}function S(){const t=new FormData(l),s=Array.from(t.getAll("symptoms")),e=t.get("other_symptom");e&&e.trim()!==""&&s.push(e.trim());const r=Array.from(t.getAll("ingredient")).filter(i=>i.trim()!==""),a=Array.from(t.getAll("excluded_ingredient")).filter(i=>i.trim()!==""),n=t.get("cuisine"),o=t.get("time");return{symptoms:s,ingredients:r,excludedIngredients:a,cuisine:n,time:o}}async function B(){const t=S(),s=t.symptoms.length>0?t.symptoms.join("、"):"特になし",e=t.ingredients.length>0?t.ingredients.join("、"):"おまかせ",r=t.excludedIngredients.length>0?t.excludedIngredients.join("、"):"なし",n=`あなたは管理栄養士かつ一流のシェフです。
ユーザーの体調や症状、手持ちの食材、希望する料理ジャンル、調理時間に合わせて、最適なレシピを3つ提案してください。

# ユーザー情報
【体調・気になること】${s}
【使いたい食材】${e}
【除外したい食材】${r}
【ジャンル】${t.cuisine}
【希望調理時間】${t.time}

# 制約事項
- 治療や治癒などの医学的表現は避け、健康をサポートするという表現にとどめてください。
- 具体的な材料と分量、手順を提示してください。
- 糖質、脂質、タンパク質、塩分（概算値）も併記してください。
- 材料費の概算（調味料除く）を「estimated_cost」として記載してください。
- 明るく励ますようなトーンで回答してください。
- 現地の本格的な食材を積極的に使用してください。ただし、日本で入手困難な食材には、必ず日本で購入可能な代替食材を提案してください（ingredientsにsubstituteを含める）。

# データ形式の定義
- **cuisine_region**: 料理のルーツとなる地域や国を記載してください。
  - 日本に馴染みのある国（日本、イタリア、アメリカなど）は、国名だけでなく地域名まで詳しく（例: 「日本・長野」「イタリア・シチリア」）。
  - 馴染みのない国は広域地域名で（例: 「東南アジア」「中東」）。
- **ingredients**: 各食材の情報をオブジェクトの配列で記載してください。
  - name: 食材名
  - amount: 分量
  - estimated_price: その食材の概算価格（日本円）。
  - substitute: 代替食材（日本で入手困難な本格食材を使用する場合のみ記載）。例: "レモン汁(大さじ1) + ショウガ薄切り"`;try{await navigator.clipboard.writeText(n);const o=document.getElementById("copy-prompt-btn"),i=o.innerHTML;o.innerHTML='<i class="fas fa-check"></i> コピーしました！',o.classList.remove("bg-blue-50","text-blue-700","border-blue-200"),o.classList.add("bg-green-50","text-green-700","border-green-200"),setTimeout(()=>{o.innerHTML=i,o.classList.add("bg-blue-50","text-blue-700","border-blue-200"),o.classList.remove("bg-green-50","text-green-700","border-green-200")},3e3)}catch(o){console.error("Failed to copy keys: ",o),alert("クリップボードへのコピーに失敗しました。")}}document.addEventListener("DOMContentLoaded",L);async function C(t){t.preventDefault(),console.log("Form submitted!"),_.classList.remove("hidden"),c.innerHTML="",b.classList.remove("hidden"),_.scrollIntoView({behavior:"smooth"});const e=new FormData(l).get("api_option");let r=null;if((e==="openai"||e==="gemini")&&(r=d.value.trim()),(e==="openai"||e==="gemini")&&!r){I("APIキーが入力されていません。設定を確認するか、「おまかせ」を選択してください。"),b.classList.add("hidden");return}const{symptoms:a,ingredients:n,excludedIngredients:o,cuisine:i,time:k}=S(),x={symptoms:a,ingredients:n,excludedIngredients:o,cuisine:i,time:k,provider:e==="openai"?"openai":"gemini"};try{const u=await M(x,r);P(u)}catch(u){console.error("Error:",u),I(u.message,u.status,e)}finally{b.classList.add("hidden")}}function q(){const t=localStorage.getItem("recipe_app_user_key"),s=localStorage.getItem("recipe_app_provider");if(s){const e=document.querySelector(`input[name="api_option"][value="${s}"]`);e&&(e.checked=!0,s!=="system"&&f.classList.remove("hidden"))}t&&(d.value=t,m&&(m.checked=!0,v.classList.remove("hidden")))}function E(){if(p&&!p.checked)return;S();const t=new FormData(l),s={symptoms:t.getAll("symptoms"),other_symptom:t.get("other_symptom"),ingredients:t.getAll("ingredient"),excluded_ingredients:t.getAll("excluded_ingredient"),excluded_ingredients:t.getAll("excluded_ingredient"),cuisine:t.get("cuisine"),time:t.get("time")};localStorage.setItem("recipe_app_form_state",JSON.stringify(s))}function D(){if(!(localStorage.getItem("recipe_app_enable_history")!=="false"))return;const s=localStorage.getItem("recipe_app_form_state");if(s)try{const e=JSON.parse(s);if(e.symptoms&&document.querySelectorAll('input[name="symptoms"]').forEach(a=>{a.checked=e.symptoms.includes(a.value)}),e.other_symptom){const r=document.querySelector('input[name="other_symptom"]');r&&(r.value=e.other_symptom)}if(e.ingredients){const r=document.querySelectorAll('input[name="ingredient"]');e.ingredients.forEach((a,n)=>{r[n]&&(r[n].value=a)})}if(e.excluded_ingredients){const r=document.querySelectorAll('input[name="excluded_ingredient"]');e.excluded_ingredients.forEach((a,n)=>{r[n]&&(r[n].value=a)})}if(e.cuisine){const r=document.querySelector(`input[name="cuisine"][value="${e.cuisine}"]`);r&&(r.checked=!0)}if(e.time){const r=document.querySelector(`input[name="time"][value="${e.time}"]`);r&&(r.checked=!0)}}catch(e){console.error("Failed to restore form state:",e)}}function H(){if(p){const e=localStorage.getItem("recipe_app_enable_history")!=="false";p.checked=e,p.addEventListener("change",r=>{const a=r.target.checked;localStorage.setItem("recipe_app_enable_history",a),a?E():localStorage.removeItem("recipe_app_form_state")})}let t;const s=()=>{clearTimeout(t),t=setTimeout(E,500)};l.addEventListener("change",s),l.addEventListener("input",s)}async function M(t,s){const e={"Content-Type":"application/json"};s&&(e["X-User-Key"]=s);try{const r=await fetch($,{method:"POST",headers:e,body:JSON.stringify(t)}),a=await r.text();let n;try{n=JSON.parse(a)}catch{throw new Error(a||`Server Error: ${r.status}`)}if(!r.ok){const o=n.error||`Server Error: ${r.status} ${r.statusText}`;console.error("Fetch Error Details:",r.status,o,n),location.hostname==="localhost"||location.hostname.includes("pages.dev");const i=new Error(o);throw i.status=r.status,i}return n}catch(r){throw r}}function P(t){if(!t.recipes||t.recipes.length===0){c.innerHTML='<p class="text-center text-gray-500">レシピが見つかりませんでした。</p>';return}const s=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");if(t.message){const e=document.createElement("div");e.className="col-span-1 md:col-span-2 lg:col-span-3 bg-orange-50 p-4 rounded-xl border border-orange-200 text-orange-800 mb-4 fade-in",e.innerHTML=`<i class="fas fa-comment-medical mr-2"></i><strong>AIからのアドバイス:</strong> ${s(t.message)}`,c.appendChild(e)}t.recipes.forEach((e,r)=>{const a=document.createElement("div");a.className="recipe-card fade-in-up w-full",a.style.animationDelay=`${r*.2}s`,a.innerHTML=`
            <details class="group">
                <summary class="bg-orange-100 p-4 border-b border-orange-200 flex justify-between items-center cursor-pointer list-none hover:bg-orange-200 transition-colors">
                    <div class="flex-1">
                        <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                             <div class="flex items-center gap-2">
                                <span class="text-2xl group-open:rotate-90 transition-transform duration-200">🥘</span>
                                <h3 class="text-xl font-bold text-gray-800">${s(e.name)}</h3>
                             </div>
                             ${e.cuisine_region?`<span class="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 self-start md:self-auto"><i class="fas fa-globe-asia mr-1 text-gray-400"></i>${s(e.cuisine_region)}</span>`:""}
                        </div>
                        <div class="flex flex-wrap gap-2 text-sm text-gray-600 pl-0 md:pl-8">
                            <span class="bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100"><i class="fas fa-clock text-orange-400 mr-1"></i>${s(e.time)}</span>
                            <span class="bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100"><i class="fas fa-fire text-red-500 mr-1"></i>${s(e.calories)} <span class="text-xs text-gray-400">(1人分)</span></span>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2 text-xs text-gray-500 pl-0 md:pl-8">
                            <span class="bg-gray-50 px-2 py-1 rounded border border-gray-200">糖質:${s(e.carbs)}</span>
                            <span class="bg-gray-50 px-2 py-1 rounded border border-gray-200">脂質:${s(e.fat)}</span>
                            <span class="bg-gray-50 px-2 py-1 rounded border border-gray-200">タンパク:${s(e.protein)}</span>
                            <span class="bg-gray-50 px-2 py-1 rounded border border-gray-200">塩分:${s(e.salt)}</span>
                        </div>
                        <div class="mt-2 pl-0 md:pl-8 text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-200 mx-0 md:mx-0">
                             <i class="fas fa-heart text-green-500 mr-1"></i>${s(e.health_point)}
                        </div>
                    </div>
                    <div class="text-orange-500">
                        <i class="fas fa-chevron-down group-open:rotate-180 transition-transform duration-200"></i>
                    </div>
                </summary>
                
                <div class="p-5 bg-white">
                    <div class="mb-4">
                        <h4 class="font-bold text-gray-700 mb-2 border-l-4 border-orange-500 pl-2">材料 (2人分)
                            ${e.estimated_cost?`<span class="text-xs font-normal text-gray-400 ml-2">※費用目安: ${s(e.estimated_cost)} (調味料除く)</span>`:""}
                        </h4>
                        <ul class="list-none text-sm text-gray-600 bg-gray-50 p-3 rounded-lg space-y-2">
                            ${e.ingredients.map(n=>typeof n=="object"&&n!==null?`<li class="flex justify-between items-center border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                                        <div>
                                            <span class="font-bold text-gray-700">${s(n.name)}</span>
                                            <span class="text-gray-500 ml-2 text-xs">${s(n.amount)}</span>
                                            ${n.substitute?`<div class="text-xs text-orange-600 mt-0.5"><i class="fas fa-exchange-alt mr-1"></i>代用: ${s(n.substitute)}</div>`:""}
                                        </div>
                                        <span class="text-xs font-mono text-gray-500 bg-white px-1 rounded border border-gray-200">${s(n.estimated_price)}</span>
                                    </li>`:`<li>${s(n)}</li>`).join("")}
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-bold text-gray-700 mb-2 border-l-4 border-blue-500 pl-2">作り方</h4>
                        <ol class="list-decimal list-inside text-sm text-gray-600 space-y-1">
                            ${e.steps.map(n=>`<li>${s(n)}</li>`).join("")}
                        </ol>
                    </div>
                    
                    <div class="mt-4 text-center">
                         <button type="button" class="text-sm text-orange-500 hover:text-orange-700 underline" onclick="this.closest('details').removeAttribute('open')">閉じる</button>
                    </div>
                </div>
            </details>
        `,c.appendChild(a)})}function I(t,s,e){let r="エラーが発生しました",a="時間をおいて再度お試しいただくか、APIキーの設定を確認してください。";(s===429||t.includes("429")||t.includes("Quota exceeded")||t.includes("exceeded your current quota")||t.includes("Too Many Requests")||t.includes("Resource has been exhausted"))&&(e==="system"?(r="本日の利用上限に達しました",t="システム無料枠（おまかせモデル）は、1日の利用回数に制限があります。",a=`
                <div class="mt-4 bg-orange-100 p-4 rounded-lg text-left">
                    <p class="font-bold text-orange-800 mb-2">解決策:</p>
                    <ul class="list-disc list-inside text-orange-700 text-sm space-y-1">
                        <li>ご自身のGemini APIキーまたはOpenAI APIキーをお持ちの場合は、詳細設定から入力してご利用ください。</li>
                        <li>または、明日以降に再度お試しください。</li>
                    </ul>
                </div>
            `):(r="APIキーの利用枠を超過しました",t="設定されたAPIキーで利用枠（Quota）を超過したか、課金制限に達しました。",a=`
                <div class="mt-4 bg-red-100 p-4 rounded-lg text-left">
                    <p class="font-bold text-red-800 mb-2">解決策:</p>
                    <ul class="list-disc list-inside text-red-700 text-sm space-y-1">
                        <li>OpenAI (またはGoogle) の管理画面で、Billing設定やCredit残高をご確認ください。</li>
                        <li>GPT-5 Nanoなどの新しいモデルは、一部のアカウントでまだ利用できない場合や、高いクレジット残高が必要な場合があります。</li>
                        <li>解決しない場合は、モデルを「おまかせ (無料)」に切り替えてお試しください。</li>
                    </ul>
                </div>
            `)),c.innerHTML=`
        <div class="col-span-1 md:col-span-3 bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center fade-in">
            <i class="fas fa-exclamation-circle text-4xl mb-3 text-red-400"></i>
            <h3 class="font-bold text-xl mb-2">${r}</h3>
            <p class="text-lg mb-2">${t}</p>
            <div class="text-sm mt-2">${a}</div>
        </div>
    `}
