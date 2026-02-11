"use client";

import { useState, useRef, useEffect, useCallback } from "react"; // useCallbackを追加
import { useSearchParams } from "next/navigation"; // 追加
import { Search, AlertTriangle, Baby, Info, Pill, Activity, Milk, User, FileText, CheckCircle, Stethoscope, MoreVertical, ExternalLink } from "lucide-react";
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
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugName, context }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch suggestions");
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
  }, [drugName, context]); // drugNameとcontextを依存配列に追加

  // クライアントサイドでのマウント後にクエリパラメータを処理
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitializedFromSearchParams.current) {
      const medicineName = searchParams.get("medicineName");
      if (medicineName) {
        setDrugName(decodeURIComponent(medicineName));
        hasInitializedFromSearchParams.current = true; // 初期化済みフラグを立てる
      }
    }
  }, [searchParams]); // searchParamsのみを監視

  // drugNameがセットされ、かつクエリパラメータからの初期化が完了している場合にのみ検索を実行（初回のみ）
  const initialSearchTriggered = useRef(false); // 追加: 初回検索がトリガーされたかどうかのフラグ
  useEffect(() => {
    if (
      hasInitializedFromSearchParams.current &&
      drugName &&
      !loading &&
      !initialSearchTriggered.current // 初回検索がまだトリガーされていない場合
    ) {
      handleSearch();
      initialSearchTriggered.current = true; // 初回検索をトリガー済みとする
    }
  }, [hasInitializedFromSearchParams.current, drugName, loading, handleSearch]);



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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Uncommented
    }
  };

  // Removed toggleMenu as it's no longer needed for hover functionality

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Pill className="w-6 h-6" /> 代替薬ナビゲーター <span className="text-xs font-normal bg-emerald-800 px-2 py-1 rounded">Beta</span>
          </h1>
        </div>
      </header>

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
              onClick={() => setContext({...context, isChild: !context.isChild})}
              icon={<Baby className="w-5 h-5" />}
              label="小児"
            />
            <ToggleButton 
              active={context.isPregnant} 
              onClick={() => setContext({...context, isPregnant: !context.isPregnant})}
              icon={<User className="w-5 h-5" />}
              label="妊婦"
            />
            <ToggleButton 
              active={context.isLactating} 
              onClick={() => setContext({...context, isLactating: !context.isLactating})}
              icon={<Milk className="w-5 h-5" />}
              label="授乳婦"
            />
            <ToggleButton 
              active={context.isRenal} 
              onClick={() => setContext({...context, isRenal: !context.isRenal})}
              icon={<Activity className="w-5 h-5" />}
              label="腎機能低下"
            />
          </div>

          <button 
            onClick={handleSearch}
            disabled={loading || !drugName}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-lg"
          >
            {loading ? "AIが考え中..." : <><Search className="w-5 h-5" /> 代替薬を探す</>}
          </button>
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
              style={{animationDelay: `${index * 50}ms`, zIndex: hoverMenuIndex === index ? 20 : 1}}
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