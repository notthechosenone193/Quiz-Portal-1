import React, { useState } from 'react';
import { Check, Palette, RefreshCw } from 'lucide-react';
import { getSampleThemes, getThemeById, OccasionTheme } from '../../data/themes';

interface ThemePickerProps {
  onSelect: (themeId: string) => void;
  selectedThemeId?: string;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ onSelect, selectedThemeId }) => {
  const [keyword, setKeyword] = useState('');
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState<OccasionTheme[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePreview = () => {
    setResults(getSampleThemes(keyword, 0));
    setOffset(0);
    setHasSearched(true);
  };

  const handleMore = () => {
    const next = offset + 5;
    setResults(getSampleThemes(keyword, next));
    setOffset(next);
  };

  const selectedTheme = selectedThemeId ? getThemeById(selectedThemeId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette size={16} style={{ color: '#4B286D' }} />
        <label className="text-sm font-semibold" style={{ color: '#2A2C2E' }}>
          Leaderboard Theme <span className="font-normal text-xs" style={{ color: '#71757B' }}>(Optional)</span>
        </label>
      </div>
      {/* Search row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePreview()}
          placeholder="e.g. Diwali, Holi, Birthday, Christmas…"
          className="flex-1 px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
          style={{ borderColor: '#D8D8D8', color: '#2A2C2E' }}
        />
        <button
          type="button"
          onClick={handlePreview}
          className="px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: '#4B286D' }}
        >
          Find Themes
        </button>
      </div>

      {/* Selected badge */}
      {selectedTheme && (
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#2B8000', backgroundColor: '#F4F9F2' }}>
          <div
            className="w-14 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: selectedTheme.previewGradient }}
          >
            <span style={{ fontSize: 24 }}>{selectedTheme.emoji}</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: '#2B8000' }}>Selected Theme</p>
            <p className="text-sm font-bold" style={{ color: '#2A2C2E' }}>{selectedTheme.name} — {selectedTheme.variantLabel}</p>
            <p className="text-xs" style={{ color: '#71757B' }}>Animated background on leaderboard</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="text-xs px-2 py-1 rounded-lg border transition-all hover:bg-white"
            style={{ borderColor: '#D8D8D8', color: '#71757B' }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Theme cards */}
      {hasSearched && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-3">
            {results.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onSelect(isSelected ? '' : theme.id)}
                  className="group relative flex flex-col rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    borderColor: isSelected ? '#2B8000' : 'transparent',
                    boxShadow: isSelected ? '0 0 0 3px rgba(43,128,0,0.3)' : '0 2px 10px rgba(0,0,0,0.18)',
                    minHeight: 120,
                    background: theme.previewGradient,
                  }}
                >
                  {/* Large emoji */}
                  <div className="flex-1 flex items-center justify-center py-4">
                    <span style={{ fontSize: 44, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
                      {theme.emoji}
                    </span>
                  </div>

                  {/* Name + variant label */}
                  <div className="px-2 py-2 text-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <p className="text-xs font-bold text-white leading-tight truncate">{theme.name}</p>
                    <p className="text-white/80 font-medium leading-tight truncate" style={{ fontSize: 10 }}>{theme.variantLabel}</p>
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2B8000', boxShadow: '0 0 0 2px white' }}>
                      <Check size={12} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleMore}
            className="flex items-center gap-2 text-sm font-medium transition-all hover:opacity-70"
            style={{ color: '#4B286D' }}
          >
            <RefreshCw size={14} /> Show more themes
          </button>
        </div>
      )}
    </div>
  );
};
