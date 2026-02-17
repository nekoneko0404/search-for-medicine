'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pill, BookOpen, Database, Home as HomeIcon } from "lucide-react";
import { Medication } from '@/types';
import { fetchMedications } from '@/services/medicationService';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import MedicationDetail from '@/components/MedicationDetail';

export default function Home() {
  const [medicationsData, setMedicationsData] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMedications();
        setMedicationsData(data);
      } catch (err) {
        console.error("Failed to load medications:", err);
        setError("データの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectMedication = (med: Medication) => {
    setSelectedMedication(med);
  };

  const handleClearSelection = () => {
    setSelectedMedication(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Header */}


      <div className="max-w-4xl mx-auto p-4 space-y-8 mt-6">

        {/* Intro / Search Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">お子様のお薬、飲みやすく。</h2>
            <p className="text-slate-500 text-sm md:text-base">
              お薬と食品の飲み合わせをチェックして、<br className="md:hidden" />
              スムーズな服薬をサポートします。
            </p>

            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <a href="https://search-for-medicine.pages.dev/" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200 hover:bg-indigo-100 transition">
                <HomeIcon className="w-4 h-4" />
                Kusuri Compass メニュー
              </a>
              <Link href="/guide" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 hover:bg-orange-100 transition">
                <BookOpen className="w-4 h-4" />
                お薬が飲めない？ 服薬支援ガイドを見る
              </Link>
              <Link href="/medications" className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full border border-teal-200 hover:bg-teal-100 transition">
                <Database className="w-4 h-4" />
                登録医薬品一覧
              </Link>
              <a href="https://search-for-medicine.pages.dev/pakkun-stamp/usage_guide.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-pink-600 bg-pink-50 px-4 py-2 rounded-full border border-pink-200 hover:bg-pink-100 transition">
                <span className="text-lg">💊</span>
                ぱっくんスタンプ
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-2xl mx-auto">
            <label className="block text-sm font-bold text-slate-600 mb-2">お薬を検索</label>
            {loading ? (
              <div className="w-full h-14 bg-slate-100 animate-pulse rounded-lg"></div>
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
            ) : (
              <SearchAutocomplete
                medications={medicationsData}
                onSelect={handleSelectMedication}
                onClear={handleClearSelection}
              />
            )}
            <p className="text-xs text-slate-400 mt-2 text-right">
              ※ 商品名の一部やYJコードで検索できます
            </p>
            <p className="text-xs text-slate-400 mt-1 text-right">
              ※ 好みや味覚には個人差があり、吸収などの問題がなければ相性が悪いとされる食品を用いてもよい。
            </p>
          </div>
        </section>

        {/* Results Section */}
        {selectedMedication && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <MedicationDetail medication={selectedMedication} />
          </section>
        )}

        {/* Feature Highlights (Show only when no medication is selected) */}
        {!selectedMedication && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 opacity-70">
            <div className="text-center p-4">
              <div className="bg-emerald-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-emerald-600 mb-3">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-700 mb-1">味・におい情報</h3>
              <p className="text-xs text-slate-500">添付文書やインタビューフォームに基づく正確な情報</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-blue-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-3">
                <span className="text-xl font-bold">🍦</span>
              </div>
              <h3 className="font-bold text-slate-700 mb-1">相性の良い食品</h3>
              <p className="text-xs text-slate-500">苦味を隠して飲みやすくする食品を提案</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-red-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-red-600 mb-3">
                <span className="text-xl font-bold">⚠️</span>
              </div>
              <h3 className="font-bold text-slate-700 mb-1">避けるべき食品</h3>
              <p className="text-xs text-slate-500">苦味が増したり、効果が落ちる食品を警告</p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
