"use client";

import { useState, useRef, useEffect, useCallback } from "react"; // useCallbackを追加
import { useSearchParams } from "next/navigation"; // 追加
import { Search, AlertTriangle, Baby, Info, Pill, Activity, Milk, User, FileText, CheckCircle, Stethoscope, MoreVertical, ExternalLink, Settings, Key, Copy, Check } from "lucide-react";
import clsx from "clsx";

interface Alternative {
  drug_name: string;
  general_name?: string;
  mechanism: string;
  safety_assessment: string;
  doctor_explanation: string;
  patient_explanation: string;
  shipment_status?: string;
  yj_code?: string;
}

export default function Home() {
  const [drugName, setDrugName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [error, setError] = useState("");
  const [hoverMenuIndex, setHoverMenuIndex] = useState<number | null>(null); // Changed to hoverMenuIndex

  const [context, setContext] = useState({
    isChild: false,
    isPregnant: false,
    isLactating: false,
    isRenal: false,
  });

  const [apiOption, setApiOption] = useState("system"); // system | openai | gemini
  const [apiKey, setApiKey] = useState("");
  const [saveKey, setSaveKey] = useState(false); // New state for saving key
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shouldAutoSearch, setShouldAutoSearch] = useState(false); // 追加: 自動検索を実行すべきかどうかのフラグ

  // Load saved key on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("drug_navigator_user_key");
      const savedProvider = localStorage.getItem("drug_navigator_provider");

      if (savedKey) {
        setApiKey(savedKey);
        setSaveKey(true);
      }
      if (savedProvider) {
        setApiOption(savedProvider);
      }
    } catch (e) {
      console.warn("localStorage access failed:", e);
    }
  }, []);

  // Save/Remove key effect
  useEffect(() => {
    try {
      if (saveKey && apiKey) {
        localStorage.setItem("drug_navigator_user_key", apiKey);
      } else {
        localStorage.removeItem("drug_navigator_user_key");
      }
    } catch (e) {
      console.warn("localStorage direct manipulation failed:", e);
    }
  }, [apiKey, saveKey]);

  // Save provider preference
  useEffect(() => {
    try {
      if (apiOption) {
        localStorage.setItem("drug_navigator_provider", apiOption);
      }
    } catch (e) {
      console.warn("localStorage provider save failed:", e);
    }
  }, [apiOption]);

  const searchParams = useSearchParams(); // 追加
  const hasInitializedFromSearchParams = useRef(false); // クエリパラメータからの初期化が完了したかを示すフラグ

  // handleSearchをuseCallbackでメモ化
  const handleSearch = useCallback(async () => {
    if (!drugName.trim()) return;
    setLoading(true);
    setError("");
    setAlternatives([]);
    setHoverMenuIndex(null);

    try {
      const res = await fetch("https://recipe-worker.neko-neko-0404.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "X-User-Key": apiKey } : {})
        },
        body: JSON.stringify({ drugName, context, provider: apiOption }),
      });

      if (!res.ok) {
        let errorMessage = "AIの呼び出しに失敗しました。";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `サーバーエラー (${res.status}): 通信に失敗しました。`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setAlternatives(data.alternatives || []);
      if (data.alternatives && data.alternatives.length === 0) {
        setError("条件に合う代替薬が見つかりませんでした（供給停止または該当なし）");
      }
    } catch (err: any) {
      setError(err.message || "AIの呼び出しに失敗しました。しばらく待ってから再試行してください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [drugName, context, apiKey, apiOption]); // APIKey, Option も追加

  // クライアントサイドでのマウント後にクエリパラメータを処理
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitializedFromSearchParams.current) {
      const medicineName = searchParams.get("medicineName");
      if (medicineName) {
        setDrugName(medicineName);
        setShouldAutoSearch(true); // パラメータがある場合のみ自動検索フラグを立てる
      }
      hasInitializedFromSearchParams.current = true;
    }
  }, [searchParams]);

  // shouldAutoSearchがtrueの場合にのみ自動検索を実行
  useEffect(() => {
    if (shouldAutoSearch && drugName && !loading) {
      handleSearch();
      setShouldAutoSearch(false); // 一度実行したらフラグを落とす
    }
  }, [shouldAutoSearch, drugName, loading, handleSearch]);



  const menuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null); // To manage the hide delay

  const handleMouseEnter = (index: number) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHoverMenuIndex(index);
  };

  const handleMouseLeave = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    hideTimeout.current = setTimeout(() => {
      setHoverMenuIndex(null);
    }, 300); // 0.3 seconds delay
  };

  const handleCopyPrompt = async () => {
    if (!drugName) return;

    const contextStrings = [];
    if (context.isChild) contextStrings.push("小児 (安全性・用量に注意)");
    if (context.isPregnant) contextStrings.push("妊婦 (催奇形性・胎児毒性に注意)");
    if (context.isLactating) contextStrings.push("授乳婦 (母乳移行に注意)");
    if (context.isRenal) contextStrings.push("腎機能低下 (排泄経路・減量に注意)");
    const contextDesc = contextStrings.length > 0 ? contextStrings.join(", ") : "成人 (特になし)";

    const prompt = `あなたは日本の薬剤師です。
以下の薬剤と患者背景に基づき、日本国内で利用可能な医療用医薬品の中から、適切な代替薬を提案してください。

# 対象薬剤
${drugName}

# 患者背景
${contextDesc}

# 制約事項
- 添付文書、インタビューフォーム、各学会ガイドライン（腎機能、妊婦・授乳婦関連）を遵守すること。
- 提案理由（作用機序、安全性評価）を明確に記載すること。
- 医師への疑義照会文、患者への説明文を含めること。
`;

    try {
      await navigator.clipboard.writeText(prompt);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    } catch (err) {
      console.error("Failed to copy", err);
      alert("コピーに失敗しました");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Uncommented
    }
  };

  // Removed toggleMenu as it's no longer needed for hover functionality

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}


      <div className="max-w-4xl mx-auto p-4 space-y-6">

        {/* Input Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">欠品・不足している薬剤名</label>
            <input
              type="text"
              maxLength={30}
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例: アストミン錠10mg"
              className="w-full text-lg p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ToggleButton
              active={context.isChild}
              onClick={() => setContext({ ...context, isChild: !context.isChild })}
              icon={<Baby className="w-5 h-5" />}
              label="小児"
            />
            <ToggleButton
              active={context.isPregnant}
              onClick={() => setContext({ ...context, isPregnant: !context.isPregnant })}
              icon={<User className="w-5 h-5" />}
              label="妊婦"
            />
            <ToggleButton
              active={context.isLactating}
              onClick={() => setContext({ ...context, isLactating: !context.isLactating })}
              icon={<Milk className="w-5 h-5" />}
              label="授乳婦"
            />
            <ToggleButton
              active={context.isRenal}
              onClick={() => setContext({ ...context, isRenal: !context.isRenal })}
              icon={<Activity className="w-5 h-5" />}
              label="腎機能低下"
            />
          </div>

          {/* Advanced Settings */}
          <div className="border-t border-slate-100 pt-4">
            <details className="group">
              <summary className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 cursor-pointer list-none transition-colors">
                <Settings className="w-4 h-4" /> 詳細設定 (AIモデル・APIキー)
                <span className="text-xs ml-auto group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    使用するAIモデルとキー設定
                  </label>

                  <div className="grid gap-3">
                    {/* Option 1: System (Gemini Free) */}
                    <label className={clsx(
                      "flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:border-emerald-300",
                      apiOption === "system" ? "border-emerald-500 ring-2 ring-emerald-50 ring-offset-1" : "border-slate-200"
                    )}>
                      <input type="radio" name="apiOption" value="system" checked={apiOption === "system"} onChange={(e) => setApiOption(e.target.value)} className="mt-1 text-emerald-600 focus:ring-emerald-500" />
                      <div>
                        <span className="block text-sm font-bold text-slate-800">おまかせ (無料)</span>
                        <span className="block text-xs text-slate-500 leading-relaxed">Google Geminiを使用します。1日の利用回数に制限があります。</span>
                      </div>
                    </label>

                    {/* Option 2: OpenAI (Own Key) */}
                    <label className={clsx(
                      "flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:border-emerald-300",
                      apiOption === "openai" ? "border-emerald-500 ring-2 ring-emerald-50 ring-offset-1" : "border-slate-200"
                    )}>
                      <input type="radio" name="apiOption" value="openai" checked={apiOption === "openai"} onChange={(e) => setApiOption(e.target.value)} className="mt-1 text-emerald-600 focus:ring-emerald-500" />
                      <div>
                        <span className="block text-sm font-bold text-slate-800">OpenAI (自分のキーを使用)</span>
                        <span className="block text-xs text-slate-500 leading-relaxed">最新の gpt-4o-mini を使用します。ご自身のAPIキーが必要です。</span>
                      </div>
                    </label>

                    {/* Option 3: Gemini (Own Key) */}
                    <label className={clsx(
                      "flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all hover:border-emerald-300",
                      apiOption === "gemini" ? "border-emerald-500 ring-2 ring-emerald-50 ring-offset-1" : "border-slate-200"
                    )}>
                      <input type="radio" name="apiOption" value="gemini" checked={apiOption === "gemini"} onChange={(e) => setApiOption(e.target.value)} className="mt-1 text-emerald-600 focus:ring-emerald-500" />
                      <div>
                        <span className="block text-sm font-bold text-slate-800">Google Gemini (自分のキーを使用)</span>
                        <span className="block text-xs text-slate-500 leading-relaxed">最新の Gemini 3 を使用します。ご自身のAPIキーが必要です。</span>
                      </div>
                    </label>
                  </div>
                </div>

                {(apiOption === "openai" || apiOption === "gemini") && (
                  <div className="mt-4 pl-8 space-y-3">
                    <form onSubmit={(e) => e.preventDefault()} className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        name="ai_api_key"
                        autoComplete="off"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={apiOption === "openai" ? "sk-..." : "APIキーを入力"}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </form>

                    <p className="text-[10px] text-slate-400 leading-tight">
                      ※ キーはサーバー経由でAI呼び出しのみに使用され、保存されません。
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={saveKey}
                        onChange={(e) => setSaveKey(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-emerald-700 transition-colors">このブラウザにAPIキーを保存する</span>
                    </label>

                    {saveKey && (
                      <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100 text-[11px] text-amber-800 animate-in fade-in zoom-in-95">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                        <div className="space-y-1">
                          <p className="font-bold">重要</p>
                          <p className="leading-relaxed">共用PC（ネットカフェや職場など）では絶対に保存しないでください。他者がキーを利用できてしまうリスクがあります。</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}


              </div>
            </details>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSearch}
              disabled={loading || !drugName}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-lg"
            >
              {loading ? "AIが考え中..." : <><Search className="w-5 h-5" /> 代替薬を探す</>}
            </button>
            <button
              onClick={handleCopyPrompt}
              disabled={!drugName}
              className={clsx(
                "px-6 py-4 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap",
                copyFeedback
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:shadow-md disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
              )}
            >
              {copyFeedback ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copyFeedback ? "コピー済" : "外部AI用"}
            </button>
          </div>
        </section>

        {/* References Note & Disclaimer */}
        <div className="space-y-1">
          <div className="text-xs text-slate-500 px-2 leading-relaxed">
            ※ 以下の基準等を考慮して提案します: 添付文書, FDA基準, オーストラリア基準, 虎ノ門病院基準, 国立成育医療研究センター「授乳中に安全に使用できると思われる薬」, 母乳とくすりハンドブック等
          </div>
          <div className="text-xs text-red-500 font-bold px-2 leading-relaxed flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> AIによるアドバイスには間違いが生じる可能性があります。必ず添付文書他の文献で確認してください。
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {error}
          </div>
        )}

        <div className="space-y-4">
          {alternatives.map((drug, index) => (
            <div key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible relative animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms`, zIndex: hoverMenuIndex === index ? 20 : 1 }}
            // Removed onMouseEnter and onMouseLeave from here
            >
              <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center relative">
                <div className="flex items-center gap-2 flex-grow">
                  <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{index + 1}</span>

                  {/* Menu Wrapper (Trigger + Context Menu) */}
                  <div
                    className="relative group cursor-pointer inline-block" // Adjusted class for wrapping
                    onMouseEnter={() => handleMouseEnter(index)} // 親要素でonMouseEnterを処理
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Name & Menu Trigger */}
                    <div className="flex items-center gap-2">
                      <h2
                        className="font-bold text-lg text-emerald-900 flex items-center gap-2 hover:text-emerald-700 transition-colors"
                      >
                        {drug.drug_name}
                        <MoreVertical className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h2>

                      {drug.shipment_status && (
                        <span className={clsx(
                          "text-xs px-2 py-0.5 rounded-full border inline-block",
                          drug.shipment_status.includes("通常") ? "bg-blue-100 text-blue-800 border-blue-200" :
                            drug.shipment_status.includes("限定") ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                              drug.shipment_status.includes("停止") ? "bg-gray-100 text-gray-800 border-gray-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {drug.shipment_status}
                        </span>
                      )}
                    </div>

                    {/* Context Menu (Same structure as Kusuri Compass) */}
                    {hoverMenuIndex === index && (
                      <div
                        ref={el => { menuRefs.current[index] = el; }}
                        className="absolute left-8 top-10 bg-white border border-slate-200 shadow-xl rounded-lg w-56 z-50 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <ul className="py-1 text-sm text-slate-700">
                          <li>
                            <a
                              href={`https://search-for-medicine.pages.dev/search?drugName=${encodeURIComponent(drug.drug_name)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="block px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ExternalLink className="w-3 h-3" /> 医薬品出荷状況検索
                            </a>
                          </li>
                          <li>
                            <a
                              href={drug.yj_code ? `https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${drug.yj_code}?user=1` : `https://www.google.com/search?q=${encodeURIComponent(drug.drug_name + " 添付文書")}`}
                              target="_blank" rel="noopener noreferrer"
                              className="block px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ExternalLink className="w-3 h-3" /> 医薬品情報 (PMDA)
                            </a>
                          </li>
                          <li>
                            <a
                              href={`https://search-for-medicine.pages.dev/hiyari_app/index.html?drugName=${encodeURIComponent(drug.drug_name)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="block px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ExternalLink className="w-3 h-3" /> ヒヤリハット検索
                            </a>
                          </li>
                          <li>
                            <a
                              href={`https://search-for-medicine.pages.dev/update/index.html?productName=${encodeURIComponent(drug.drug_name)}&shippingStatus=all&updateDate=all`}
                              target="_blank" rel="noopener noreferrer"
                              className="block px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ExternalLink className="w-3 h-3" /> 情報更新日
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600 ml-2 whitespace-nowrap hidden md:block">AI提案</div>
              </div>

              <div className="p-4 space-y-4">
                {/* Mechanism & Safety */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">特徴・機序 {drug.general_name && <span className="font-normal text-slate-500">({drug.general_name})</span>}</p>
                    <p className="text-sm text-slate-700">{drug.mechanism}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">安全性評価 (コンテキスト)</p>
                    <p className="text-sm font-semibold text-slate-800 bg-orange-50 p-2 rounded border border-orange-100 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      {drug.safety_assessment}
                    </p>
                  </div>
                </div>

                {/* Explanations */}
                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
                      <Stethoscope className="w-4 h-4" /> 医師への提案ロジック
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{drug.doctor_explanation}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 text-green-800 font-bold text-sm mb-2">
                      <User className="w-4 h-4" /> 患者さんへの説明
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{drug.patient_explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ToggleButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200",
        active
          ? "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-inner font-bold"
          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}