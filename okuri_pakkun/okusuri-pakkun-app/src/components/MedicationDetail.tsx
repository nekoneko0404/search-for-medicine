'use client';

import { useState, useEffect } from 'react';
import { Medication } from '@/types';
import { Pill, CheckCircle, AlertTriangle, Info, FileText, Database, ExternalLink } from 'lucide-react';
import PdfDownloadButton from './PdfDownloadButton';
import { XMLParser } from 'fast-xml-parser';

interface MedicationDetailProps {
  medication: Medication;
}

interface PmdaInfo {
  description: string;
  precautions: {
    important_warning?: string;
    interaction?: string;
  };
}

export default function MedicationDetail({ medication }: MedicationDetailProps) {
  const [pmdaInfo, setPmdaInfo] = useState<PmdaInfo | null>(null);
  const [loadingPmda, setLoadingPmda] = useState(false);

  useEffect(() => {
    async function fetchPmdaInfo() {
      setLoadingPmda(true);
      setPmdaInfo(null);
      try {
        // Direct fetch from public folder for static export compatibility
        const res = await fetch(`/pmda_mocks/${medication.yj_code}.xml`);
        
        if (res.ok) {
          const xmlData = await res.text();
          const parser = new XMLParser();
          const jsonObj = parser.parse(xmlData);
          
          if (jsonObj.drug_product) {
            const product = jsonObj.drug_product;
            const description = product.description ? product.description.trim() : '情報なし';
            const precautions = product.precautions ? product.precautions : {};

            setPmdaInfo({
              description,
              precautions
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch PMDA info", error);
      } finally {
        setLoadingPmda(false);
      }
    }

    if (medication.yj_code) {
      fetchPmdaInfo();
    }
  }, [medication.yj_code]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-xl text-emerald-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-600" />
            {medication.brand_name}
          </h2>
          <a 
            href={`https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${medication.yj_code}?user=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 shadow-sm hover:text-emerald-600 hover:border-emerald-300 transition-colors cursor-pointer flex items-center gap-1 group"
            title="PMDAサイトで詳細を見る"
          >
            PMDA
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
          </a>
        </div>
        <PdfDownloadButton medication={medication} />
      </div>
      
      <div className="p-5 space-y-6">
        
        {/* Manufacturer & Flavor */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">製薬メーカー</p>
            <p className="text-base font-medium text-slate-800">{medication.manufacturer}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">味・におい</p>
            <span className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium border border-blue-100">
              {medication.taste_smell}
            </span>
          </div>
        </div>

        {/* Compatibility Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Good Compatibility */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base mb-3">
              <CheckCircle className="w-5 h-5" /> 相性の良い食品
            </div>
            {medication.good_compatibility.length > 0 ? (
              <ul className="space-y-2">
                {medication.good_compatibility.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-lg border border-emerald-100 shadow-sm text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">特になし</p>
            )}
          </div>

          {/* Bad Compatibility */}
          <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-700 font-bold text-base mb-3">
              <AlertTriangle className="w-5 h-5" /> 相性の悪い食品
            </div>
            {medication.bad_compatibility.length > 0 ? (
              <ul className="space-y-2">
                {medication.bad_compatibility.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-lg border border-red-100 shadow-sm text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">特になし</p>
            )}
          </div>
        </div>

        {/* Special Notes (Original) */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base mb-2">
            <Info className="w-5 h-5" /> その他注意事項
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {medication.special_notes}
          </p>
        </div>

        {/* PMDA Info Section */}
        {loadingPmda ? (
           <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 animate-pulse">
             <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
             <div className="h-4 bg-slate-200 rounded w-3/4"></div>
           </div>
        ) : pmdaInfo ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-base mb-3">
              <Database className="w-5 h-5 text-purple-600" /> PMDA 最新添付文書情報
              <span className="text-xs font-normal text-slate-400 bg-white px-2 py-0.5 border rounded-full">Beta</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">性状・形</p>
                <p className="text-sm text-slate-700 leading-relaxed">{pmdaInfo.description}</p>
              </div>
              
              {pmdaInfo.precautions.important_warning && (
                <div>
                   <p className="text-xs font-bold text-red-500 mb-1">重要な基本的注意</p>
                   <p className="text-sm text-slate-700 leading-relaxed bg-red-50 p-2 rounded border border-red-100">
                     {pmdaInfo.precautions.important_warning}
                   </p>
                </div>
              )}

               {pmdaInfo.precautions.interaction && (
                <div>
                   <p className="text-xs font-bold text-slate-500 mb-1">相互作用（併用注意など）</p>
                   <p className="text-sm text-slate-700 leading-relaxed">
                     {pmdaInfo.precautions.interaction}
                   </p>
                </div>
              )}
            </div>
          </div>
        ) : null}


        {/* Source */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-2">
          <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">情報源</p>
            <p className="text-xs text-slate-500">{medication.source}</p>
          </div>
        </div>

      </div>
    </div>
  );
}