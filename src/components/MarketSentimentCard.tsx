import React, { useState } from 'react';

export const MarketSentimentCard: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const score = 68;
  const sentiment = 'Greed';

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-white">Market Sentiment</span>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-[#787b86] hover:text-white transition-colors"
          title="Sentiment Gauge Info"
        >
          <span className="material-symbols-outlined text-lg">info</span>
        </button>
      </div>

      {showInfo && (
        <div className="mb-3 p-2.5 bg-[#131722] border border-[#2a2e39] rounded text-[11px] text-[#d1d4dc] leading-relaxed">
          <div className="flex justify-between items-center mb-1 font-semibold text-white">
            <span>Fear &amp; Greed Methodology</span>
            <button onClick={() => setShowInfo(false)} className="text-[#787b86] hover:text-white">✕</button>
          </div>
          Synthesizes 7 market momentum indicators including junk bond demand, market volatility (VIX), put/call options ratios, and stock price breadth into a 0-100 gauge.
        </div>
      )}

      {/* Needle gauge representation */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-48 h-24 overflow-hidden flex justify-center">
          <div className="w-48 h-48 rounded-full border-[12px] border-[#313441] border-t-[#089981] border-r-[#089981] border-b-transparent border-l-[#f23645] rotate-[45deg]" />
          <div className="absolute bottom-0 flex flex-col items-center">
            <span className="text-3xl font-bold text-[#089981] leading-none">
              {score}
            </span>
            <span className="text-xs text-[#d1d4dc] font-semibold mt-1">
              {sentiment}
            </span>
          </div>
        </div>

        <div className="w-full flex justify-between text-[10px] text-[#787b86] mt-2 px-6">
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
        </div>
      </div>

      {/* Advancing vs Declining summary */}
      <div className="mt-4 pt-3 border-t border-[#2a2e39]">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#787b86]">NYSE &amp; NASDAQ Breadth</span>
          <span className="font-semibold text-white tabular-nums">62% Positive</span>
        </div>

        <div className="w-full bg-[#313441] h-2 rounded-full overflow-hidden flex">
          <div className="bg-[#089981] h-full" style={{ width: '62%' }} />
          <div className="bg-[#f23645] h-full" style={{ width: '38%' }} />
        </div>

        <div className="flex justify-between text-[10px] mt-1.5 tabular-nums">
          <span className="text-[#089981] font-semibold">3,412 Advancing</span>
          <span className="text-[#f23645] font-semibold">2,088 Declining</span>
        </div>
      </div>
    </div>
  );
};
