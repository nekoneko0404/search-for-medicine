export function toHalfWidth(str: string): string {
  return str.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/　/g, ' ');
}

export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 0x60);
  });
}

export function normalizeString(str: string): string {
  if (!str) return '';
  let normalized = str;
  // Convert to half-width first (for numbers, english, symbols)
  normalized = toHalfWidth(normalized);
  // Convert Hiragana to Katakana
  normalized = hiraganaToKatakana(normalized);
  // Lowercase (though for Japanese it might not matter much, but for English it does)
  return normalized.toLowerCase();
}
