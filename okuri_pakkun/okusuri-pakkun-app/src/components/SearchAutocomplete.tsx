import { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Medication } from '@/types';
import { normalizeString } from '../utils/textUtils';

interface SearchAutocompleteProps {
  medications: Medication[];
  onSelect: (medication: Medication) => void;
  onClear: () => void;
}

export default function SearchAutocomplete({ medications, onSelect, onClear }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Medication[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside to close suggestions
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onClear(); // Clear previous selection

    if (value.length > 0) {
      const normalizedQuery = normalizeString(value);
      const filtered = medications.filter(med =>
        normalizeString(med.brand_name).includes(normalizedQuery) ||
        normalizeString(med.yj_code).includes(normalizedQuery) ||
        normalizeString(med.manufacturer).includes(normalizedQuery)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (med: Medication) => {
    setQuery(med.brand_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(med);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length === 1) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="薬の名前、YJコードで検索..."
          className="w-full text-lg p-4 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-2 max-h-80 overflow-y-auto">
          {suggestions.map((med) => (
            <li
              key={med.yj_code}
              onClick={() => handleSelect(med)}
              className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors group"
            >
              <div className="font-bold text-slate-800">{med.brand_name}</div>
              <div className="text-xs text-slate-500 flex justify-between mt-1 items-center">
                <span>{med.manufacturer}</span>
                <a
                  href={`https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${med.yj_code}?user=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono bg-slate-100 px-1 rounded flex items-center gap-1 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="PMDAで詳細を見る"
                >
                  PMDA
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {showSuggestions && query.length > 0 && suggestions.length === 0 && (
         <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-2 p-4 text-center text-slate-500">
           該当する薬が見つかりません
         </div>
      )}
    </div>
  );
}
