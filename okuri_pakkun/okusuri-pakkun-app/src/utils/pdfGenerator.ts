import { jsPDF } from 'jspdf';
import { Medication } from '@/types';

export async function generateMedicationGuidePDF(medication: Medication) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Load Japanese Font
  try {
    const fontRes = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP-Regular.ttf');
    if (!fontRes.ok) throw new Error('Font fetch failed');
    const fontBuffer = await fontRes.arrayBuffer();

    // Convert ArrayBuffer to Base64 (browser compatible)
    let binary = '';
    const bytes = new Uint8Array(fontBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64String = window.btoa(binary);

    doc.addFileToVFS('NotoSansJP-Regular.ttf', base64String);
    doc.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal');
    doc.setFont('NotoSansJP');
  } catch (e) {
    console.error('Failed to load font', e);
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Header
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text('Okusuri Pakkun - 医薬品情報', margin, y);
  y += 10;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(0, 128, 128); // Teal color
  doc.text(medication.brand_name, margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`YJコード: ${medication.yj_code}`, margin, y);
  y += 12;

  // Basic Info
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text('■ 基本情報', margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.text(`製薬メーカー: ${medication.manufacturer}`, margin, y);
  y += 7;
  doc.text(`味・におい: ${medication.taste_smell}`, margin, y);
  y += 12;

  // Compatibility (2-Column Layout)
  doc.setFontSize(14);
  doc.text('■ 飲み合わせ情報', margin, y);
  y += 8;

  const colWidth = (contentWidth / 2) - 5;
  const leftColX = margin;
  const rightColX = margin + colWidth + 10;
  const startY = y;

  // Left Column: Good Compatibility
  doc.setFontSize(12);
  doc.setTextColor(0, 100, 0); // Greenish
  doc.text('◎ 相性の良い食品:', leftColX, y);
  y += 6;
  doc.setTextColor(0);
  const goodText = medication.good_compatibility.length > 0 ? medication.good_compatibility.join(', ') : '特になし';
  const splitGood = doc.splitTextToSize(goodText, colWidth);
  doc.text(splitGood, leftColX, y);
  const leftColHeight = splitGood.length * 6;

  // Right Column: Bad Compatibility
  let rightY = startY;
  doc.setTextColor(150, 0, 0); // Reddish
  doc.text('▲ 避けるべき食品:', rightColX, rightY);
  rightY += 6;
  doc.setTextColor(0);
  const badText = medication.bad_compatibility.length > 0 ? medication.bad_compatibility.join(', ') : '特になし';
  const splitBad = doc.splitTextToSize(badText, colWidth);
  doc.text(splitBad, rightColX, rightY);
  const rightColHeight = splitBad.length * 6;

  // Update y to the taller of the two columns
  y = startY + Math.max(leftColHeight, rightColHeight) + 15;

  // Special Notes
  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text('■ その他注意事項', margin, y);
  y += 8;
  doc.setFontSize(12);
  const splitNotes = doc.splitTextToSize(medication.special_notes, contentWidth);
  doc.text(splitNotes, margin, y);
  y += splitNotes.length * 6 + 10;

  // Save
  doc.save(`${medication.brand_name}_医薬品情報.pdf`);
}