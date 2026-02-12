'use client';

import { useState } from 'react';
import { Medication } from '@/types';
import { generateMedicationGuidePDF } from '@/utils/pdfGenerator';
import { Download, Loader2 } from 'lucide-react';

interface PdfDownloadButtonProps {
  medication: Medication;
}

export default function PdfDownloadButton({ medication }: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateMedicationGuidePDF(medication);
    } catch (error) {
      console.error('PDF generation failed', error);
      alert('PDFの生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm font-bold"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          生成中...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          PDFガイドを保存
        </>
      )}
    </button>
  );
}
