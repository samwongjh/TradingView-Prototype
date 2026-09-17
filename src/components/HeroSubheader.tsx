import React, { useState, useEffect } from 'react';
import { MarketCategory } from '../types';

interface HeroSubheaderProps {
  activeCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSubheader: React.FC<HeroSubheaderProps> = ({
  activeCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as HH:MM:SS in US Eastern time
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy'
  ];

  const regions = [
    'Markets, everywhere',
    'United States Markets',
    'European Markets',
    'Asia-Pacific Markets',
    'Emerging Markets'
  ];

  return (
    <section className="border-b border-[#2a2e39] bg-[#131722] pt-6 pb-4">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Title & Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-4">
          <div className="relative">
            <div
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <h1 className="text-2xl sm:text-[32px] font-bold text-white tracking-tight leading-tight">
                {selectedRegion}
              </h1>
              <span className="material-symbols-outlined text-2xl text-[#787b86] group-hover:text-[#d1d4dc] transition-colors mt-1">
                expand_more
              </span>
            </div>

            {showRegionDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-[#1e222d] border border-[#363a45] rounded-lg shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">
                  Select Market Region
                </div>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      onSelectRegion(region);
                      setShowRegionDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      selectedRegion === region
                        ? 'bg-[#2962ff]/15 text-[#2962ff] font-semibold'
                        : 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                    }`}
                  >
                    <span>{region}</span>
                    {selectedRegion === region && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Realtime Market Status Rail */}
          <div className="flex items-center gap-2.5 text-xs text-[#787b86]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]" />
            </span>
            <span className="text-[#d1d4dc] font-medium">U.S. Markets Open</span>
            <span className="text-[#50535e]">•</span>
            <span className="text-[#787b86] tabular-nums">
              NYSE &amp; NASDAQ {currentTime || '14:42:18'} EST
            </span>
          </div>
        </div>

        {/* Segmented Market Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2 pt-1 whitespace-nowrap">
          {categories.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#2a2e39] text-white shadow-sm'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
