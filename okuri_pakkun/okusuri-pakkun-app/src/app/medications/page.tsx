'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Database, ExternalLink, Printer, Home as HomeIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Medication } from '@/types';
import { fetchMedications } from '@/services/medicationService';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchMedications();
      setMedications(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredMeds = medications.filter(med =>
    med.brand_name.toLowerCase().includes(filter.toLowerCase()) ||
    med.manufacturer.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans">
      <header className="bg-white text-slate-800 p-4 shadow-sm border-b border-slate-100 sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2 text-teal-700">
            <Database className="w-6 h-6 text-teal-600" />
            登録医薬品一覧
            {!loading && (
              <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                全{medications.length}件
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            <a href="https://search-for-medicine.pages.dev/" className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
              <HomeIcon className="w-4 h-4" />
              メニュー
            </a>
            <button
              onClick={() => {
                // Just print - CSS handles the header
                window.print();
              }}
              className="flex items-center gap-1 text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-full transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              印刷する
            </button>
            <Link href="/" className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Link>
          </div>
        </div>
      </header>

      {/* Print Only Header */}
      <div className="hidden print-header" style={{ display: 'none' }}>
        <div className="flex justify-between items-center w-full px-2 py-0.5">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-teal-700 flex items-center gap-1">
              <Database className="w-3 h-3" />
              登録医薬品一覧
            </h1>
            <span className="text-xs text-slate-500">
              search-for-medicine.pages.dev
            </span>
          </div>
          <div className="flex items-center">
            <QRCode
              value="https://search-for-medicine.pages.dev/"
              size={40}
              style={{ height: "auto", maxWidth: "100%", width: "40px" }}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
         @media print {
          @page {
            size: A4 portrait;
            margin: 19mm 10mm 10mm 10mm; /* 19mm top margin for pages 2+ (matches header height) */
          }
          
          @page :first {
            margin-top: 5mm; /* Minimal top margin for page 1 with header */
          }
          body {
            background: white !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          
          /* Print header - shows once at top */
          .print-header {
            display: flex !important;
            align-items: center;
            margin-bottom: 1mm;
            padding: 0.5mm 1mm;
            border-bottom: 1px solid #0d9488;
            page-break-after: avoid;
            break-after: avoid;
          }
          
          /* Scale Content 85% */
          main {
            padding: 0 !important;
            max-width: none !important;
            width: 118% !important;
            transform: scale(0.85) !important;
            transform-origin: top left !important;
            margin-top: 0 !important;
          }

          .meds-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1.5mm !important;
            page-break-inside: auto;
          }
          
          .med-card {
            break-inside: avoid !important;
            border: 1px solid #eee !important;
            padding: 2mm !important;
            border-radius: 3mm !important;
            background-color: #fff !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            margin: 0 !important;
            font-size: 8pt !important;
          }
          .med-card h3 {
            font-size: 13px !important;
            margin-bottom: 2mm !important;
          }
          .med-card a {
            display: none !important;
          }
          /* Adjust font sizes for print readability at scale */
          .med-card .text-xs {
            font-size: 10px !important;
          }
          .med-card .space-y-3 {
            gap: 2mm !important;
          }
          .med-card h3 {
            font-size: 9pt !important;
            margin-bottom: 1mm !important;
          }
          
          .med-card p,
          .med-card span,
          .med-card div {
            font-size: 7pt !important;
            line-height: 1.2 !important;
            margin: 0.5mm 0 !important;
          }
          
          /* Force colors for visibility */
          .bg-teal-50 { background-color: #f0fdfa !important; -webkit-print-color-adjust: exact; }
          .bg-blue-50 { background-color: #eff6ff !important; -webkit-print-color-adjust: exact; }
          .bg-red-50 { background-color: #fef2f2 !important; -webkit-print-color-adjust: exact; }
          .text-teal-600 { color: #0d9488 !important; }
          .text-blue-500 { color: #3b82f6 !important; }
          .text-red-500 { color: #ef4444 !important; }
        }
      ` }} />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 no-print">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="薬剤名や製薬会社で絞り込み..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500">データを読み込み中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 meds-grid">
            {filteredMeds.map((med) => (
              <div key={med.yj_code} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-teal-200 transition med-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{med.brand_name}</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{med.manufacturer}</span>
                </div>

                <a
                  href={`https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${med.yj_code}?user=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition mb-3"
                  title="PMDAサイトで詳細を見る"
                >
                  PMDAで見る <ExternalLink className="w-4 h-4" />
                </a>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-bold text-teal-600 block mb-1">味・におい</span>
                    <p className="bg-teal-50 p-2 rounded text-slate-700">{med.taste_smell}</p>
                  </div>

                  {(med.good_compatibility.length > 0) && (
                    <div>
                      <span className="font-bold text-blue-500 block mb-1">相性の良いもの</span>
                      <div className="flex flex-wrap gap-1">
                        {med.good_compatibility.map(item => (
                          <span key={item} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(med.bad_compatibility.length > 0) && (
                    <div>
                      <span className="font-bold text-red-500 block mb-1">避けるべきもの</span>
                      <div className="flex flex-wrap gap-1">
                        {med.bad_compatibility.map(item => (
                          <span key={item} className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {med.special_notes && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span className="font-bold mr-1">⚠️ 注意:</span>
                      {med.special_notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredMeds.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            該当する医薬品が見つかりませんでした。
          </div>
        )}
      </main>
    </div>
  );
}
