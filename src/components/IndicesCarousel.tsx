import React, { useState } from 'react';
import { MarketIndex } from '../types';

interface IndicesCarouselProps {
  indices: MarketIndex[];
  onSelectIndex: (index: MarketIndex) => void;
}

export const IndicesCarousel: React.FC<IndicesCarouselProps> = ({
  indices,
  onSelectIndex
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % indices.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + indices.length) % indices.length);
  };

  // Visible indices array wrapped around
  const visibleIndices: MarketIndex[] = [];
  for (let i = 0; i < Math.min(itemsPerPage, indices.length); i++) {
    const idx = (startIndex + i) % indices.length;
    visibleIndices.push(indices[idx]);
  }

  return (
    <section className="bg-[#0f131e] border-b border-[#2a2e39] py-3.5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onSelectIndex(indices[0])}
            className="flex items-center gap-1 text-lg text-white font-bold group hover:text-[#2962ff] transition-colors"
          >
            <span>Indices</span>
            <span className="material-symbols-outlined text-[#787b86] group-hover:text-white transition-colors">
              chevron_right
            </span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white border border-[#2a2e39] transition-colors"
              title="Previous indices"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white border border-[#2a2e39] transition-colors"
              title="Next indices"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Ticker Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {visibleIndices.map((index) => {
            const isBull = index.isPositive;
            return (
              <div
                key={index.id}
                onClick={() => onSelectIndex(index)}
                className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] p-3 rounded transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center font-bold shrink-0"
                      style={{ backgroundColor: index.badgeBg }}
                    >
                      {index.badgeText}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-[#d1d4dc] group-hover:text-[#2962ff] transition-colors truncate">
                        {index.name}
                      </div>
                      <div className="text-[10px] text-[#787b86] truncate">{index.symbol}</div>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <svg
                    className={`w-14 h-5 overflow-visible shrink-0 ${
                      isBull ? 'stroke-[#089981]' : 'stroke-[#f23645]'
                    }`}
                    fill="none"
                    viewBox="0 0 50 20"
                  >
                    {isBull ? (
                      <path
                        d="M0,16 L10,14 L20,15 L28,8 L38,10 L50,3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <path
                        d="M0,4 L12,6 L24,14 L34,12 L44,17 L50,18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    )}
                  </svg>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-semibold text-white text-sm sm:text-base tabular-nums">
                    {index.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <div
                    className={`flex items-center gap-1 font-semibold text-xs tabular-nums ${
                      isBull ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    <span>
                      {isBull ? '+' : ''}
                      {index.change.toFixed(2)}
                    </span>
                    <span
                      className={`px-1 py-0.5 rounded text-[10px] font-bold ${
                        isBull
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : 'bg-[#f23645]/15 text-[#f23645]'
                      }`}
                    >
                      {isBull ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
