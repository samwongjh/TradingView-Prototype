import React, { useState } from 'react';
import { SectorPerformance } from '../types';

interface SectorsPerformanceProps {
  sectors: SectorPerformance[];
  onSelectSector?: (sectorName: string) => void;
}

export const SectorsPerformance: React.FC<SectorsPerformanceProps> = ({
  sectors,
  onSelectSector
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false);

  // Timeframe multipliers to simulate different period performances
  const getAdjustedSector = (sector: SectorPerformance) => {
    let multiplier = 1;
    if (timeframe === '1W') multiplier = 1.6;
    if (timeframe === '1M') multiplier = 2.4;
    if (timeframe === 'YTD') multiplier = 4.8;

    const adjustedChange = +(sector.changePercent * multiplier).toFixed(2);
    const isBull = adjustedChange >= 0;
    const advancing = Math.min(95, Math.max(15, Math.round(sector.advancingPercent * (isBull ? 1.05 : 0.9))));
    const declining = 100 - advancing;

    return {
      ...sector,
      changePercent: adjustedChange,
      isPositive: isBull,
      advancingPercent: advancing,
      decliningPercent: declining
    };
  };

  return (
    <section className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg text-white font-bold">U.S. Sectors Performance</h2>
          <p className="text-xs text-[#787b86]">Intraday gainers vs decliners weight</p>
        </div>

        {/* Timeframe Selector */}
        <div className="relative">
          <button
            onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
            className="flex items-center gap-1 text-[11px] text-[#787b86] hover:text-white bg-[#131722] px-2.5 py-1 rounded border border-[#2a2e39] hover:border-[#363a45] transition-colors"
          >
            <span>{timeframe} View</span>
            <span className="material-symbols-outlined text-xs">expand_more</span>
          </button>

          {showTimeframeMenu && (
            <div className="absolute right-0 mt-1 w-28 bg-[#1e222d] border border-[#363a45] rounded-md shadow-xl py-1 z-20 text-xs">
              {(['1D', '1W', '1M', 'YTD'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setShowTimeframeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 transition-colors ${
                    timeframe === tf ? 'bg-[#2962ff] text-white font-semibold' : 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                  }`}
                >
                  {tf} View
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectors.map((baseSector) => {
          const s = getAdjustedSector(baseSector);
          return (
            <div
              key={s.name}
              onClick={() => onSelectSector && onSelectSector(s.name)}
              className="bg-[#131722] border border-[#2a2e39] p-3 rounded hover:border-[#363a45] hover:bg-[#171b26] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-[#d1d4dc] group-hover:text-[#2962ff] font-semibold transition-colors">
                  {s.name}
                </span>
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    s.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {s.isPositive ? '+' : ''}
                  {s.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Advancing vs Declining Progress Bar */}
              <div className="w-full bg-[#313441] h-1.5 rounded-full overflow-hidden flex my-2">
                <div
                  className="bg-[#089981] h-full transition-all duration-300"
                  style={{ width: `${s.advancingPercent}%` }}
                />
                <div
                  className="bg-[#f23645] h-full transition-all duration-300"
                  style={{ width: `${s.decliningPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#787b86]">
                <span>{s.advancingPercent}% Advancing</span>
                <span>{s.decliningPercent}% Declining</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
