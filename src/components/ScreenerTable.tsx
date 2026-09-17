import React, { useState, useMemo } from 'react';
import { Stock, ScreenerTab } from '../types';

interface ScreenerTableProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  onOpenFullScreener?: () => void;
}

export const ScreenerTable: React.FC<ScreenerTableProps> = ({
  stocks,
  onSelectStock,
  onOpenFullScreener
}) => {
  const [activeTab, setActiveTab] = useState<ScreenerTab>('Most active');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>('Mega Cap (> $200B)');
  const [symbolFilter, setSymbolFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  const tabs: ScreenerTab[] = [
    'Most active',
    'Gainers',
    'Losers',
    'Unusual volume',
    '52-week highs',
    'Most volatile'
  ];

  // Filter and sort stocks based on active tab and dropdown filters
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Sector filter
    if (selectedSector !== 'All Sectors') {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Market cap filter
    if (selectedMarketCap !== 'All Market Caps') {
      result = result.filter((s) => s.marketCapCategory === selectedMarketCap);
    }

    // Symbol / search query filter
    if (symbolFilter.trim()) {
      const q = symbolFilter.toLowerCase();
      result = result.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.exchange.toLowerCase().includes(q)
      );
    }

    // Sort based on active tab
    switch (activeTab) {
      case 'Most active':
        result.sort((a, b) => b.rawVolume - a.rawVolume);
        break;
      case 'Gainers':
        result.sort((a, b) => b.changePercent - a.changePercent);
        break;
      case 'Losers':
        result.sort((a, b) => a.changePercent - b.changePercent);
        break;
      case 'Unusual volume':
        result.sort((a, b) => (b.rawVolume / b.rawMarketCap) - (a.rawVolume / a.rawMarketCap));
        break;
      case '52-week highs':
        result.sort((a, b) => (a.high52 - a.lastPrice) - (b.high52 - b.lastPrice));
        break;
      case 'Most volatile':
        result.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
        break;
    }

    return result;
  }, [stocks, activeTab, selectedSector, selectedMarketCap, symbolFilter]);

  const totalItems = filteredStocks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const displayedStocks = filteredStocks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportCSV = () => {
    const headers = ['Symbol', 'Name', 'Exchange', 'Last Price', 'Change %', 'Change $', 'Volume', 'Market Cap', 'Rating', 'Sector'];
    const rows = filteredStocks.map((s) => [
      s.symbol,
      `"${s.name}"`,
      s.exchange,
      s.lastPrice,
      `${s.changePercent}%`,
      s.changeAmount,
      s.volume,
      s.marketCap,
      s.technicalRating,
      s.sector
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradingview_screener_${activeTab.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-hidden">
      {/* Screener Category Tabs */}
      <div className="border-b border-[#2a2e39] flex items-center justify-between px-4 pt-3 pb-0 overflow-x-auto custom-scrollbar">
        <div className="flex items-center space-x-6 whitespace-nowrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`pb-3 text-xs font-semibold transition-colors relative ${
                  isActive
                    ? 'border-b-2 border-[#2962ff] text-white'
                    : 'border-b-2 border-transparent text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenFullScreener || (() => setActiveTab('Most active'))}
          className="hidden sm:flex items-center gap-1 text-[#2962ff] hover:text-[#1e53e5] text-xs pb-3 font-semibold shrink-0 cursor-pointer"
        >
          <span>Open Screener</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </div>

      {/* Controls Bar: Filter, Quick Search & Export */}
      <div className="p-3 bg-[#131722]/50 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Sector Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] text-xs py-1.5 pl-2.5 pr-8 rounded focus:outline-none focus:border-[#2962ff] appearance-none cursor-pointer"
            >
              <option value="All Sectors">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Financials">Financials</option>
              <option value="Consumer Discretionary">Consumer Discretionary</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Energy">Energy</option>
              <option value="Communication">Communication</option>
            </select>
            <span className="material-symbols-outlined text-sm absolute right-2 top-2.5 text-[#787b86] pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Market Cap Filter */}
          <div className="relative hidden sm:block">
            <select
              value={selectedMarketCap}
              onChange={(e) => {
                setSelectedMarketCap(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] text-xs py-1.5 pl-2.5 pr-8 rounded focus:outline-none focus:border-[#2962ff] appearance-none cursor-pointer"
            >
              <option value="All Market Caps">All Market Caps</option>
              <option value="Mega Cap (> $200B)">Mega Cap (&gt;$200B)</option>
              <option value="Large Cap ($10B-$200B)">Large Cap ($10B-$200B)</option>
              <option value="Mid Cap ($2B-$10B)">Mid Cap ($2B-$10B)</option>
              <option value="Small Cap (< $2B)">Small Cap (&lt;$2B)</option>
            </select>
            <span className="material-symbols-outlined text-sm absolute right-2 top-2.5 text-[#787b86] pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-[#787b86] text-sm">
              filter_alt
            </span>
            <input
              type="text"
              value={symbolFilter}
              onChange={(e) => {
                setSymbolFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter symbols..."
              className="bg-[#1e222d] border border-[#2a2e39] rounded py-1 pl-7 pr-3 text-xs text-[#d1d4dc] placeholder:text-[#50535e] focus:outline-none focus:border-[#2962ff] w-36 sm:w-44"
            />
            {symbolFilter && (
              <button
                onClick={() => setSymbolFilter('')}
                className="absolute right-2 top-1.5 text-[#787b86] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={exportCSV}
            className="p-1.5 rounded border border-[#2a2e39] bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] transition-colors"
            title="Export CSV"
          >
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
      </div>

      {/* Dense Stock Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e222d] border-b border-[#2a2e39] text-[11px] text-[#787b86] uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-4 sticky left-0 bg-[#1e222d] z-10">Symbol</th>
              <th className="py-2.5 px-3 text-right">Last</th>
              <th className="py-2.5 px-3 text-right">Chg %</th>
              <th className="py-2.5 px-3 text-right">Chg $</th>
              <th className="py-2.5 px-3 text-right">Vol</th>
              <th className="py-2.5 px-3 text-right hidden md:table-cell">Mkt Cap</th>
              <th className="py-2.5 px-3 text-center">Technical Rating</th>
              <th className="py-2.5 px-4 text-right">7D Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39] text-xs">
            {displayedStocks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#787b86]">
                  No stocks match the selected criteria.
                </td>
              </tr>
            ) : (
              displayedStocks.map((stock) => {
                const isBull = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-[#2a2e39]/50 transition-colors group cursor-pointer"
                  >
                    {/* Symbol + Name */}
                    <td className="py-2.5 px-4 sticky left-0 bg-[#1e222d] group-hover:bg-[#2a2e39] transition-colors z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded border flex items-center justify-center font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: stock.logoBg,
                            borderColor: stock.logoBorder,
                            color: stock.logoColor
                          }}
                        >
                          {stock.logoText}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors flex items-center gap-1">
                            {stock.symbol}
                            <span className="text-[10px] text-[#787b86] font-normal">
                              {stock.exchange}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#787b86] truncate max-w-[120px]">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Last Price */}
                    <td className="py-2.5 px-3 text-right font-semibold text-white tabular-nums">
                      ${stock.lastPrice.toFixed(2)}
                    </td>

                    {/* Change % */}
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-block font-semibold px-1.5 py-0.5 rounded text-xs tabular-nums ${
                          isBull
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isBull ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Change $ */}
                    <td
                      className={`py-2.5 px-3 text-right font-semibold tabular-nums ${
                        isBull ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isBull ? '+' : ''}${Math.abs(stock.changeAmount).toFixed(2)}
                    </td>

                    {/* Volume */}
                    <td className="py-2.5 px-3 text-right text-[#d1d4dc] tabular-nums">
                      {stock.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-2.5 px-3 text-right text-[#d1d4dc] tabular-nums hidden md:table-cell">
                      {stock.marketCap}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          stock.technicalRating.includes('Buy')
                            ? 'bg-[#089981]/15 text-[#22ab94] border-[#089981]/30'
                            : stock.technicalRating.includes('Sell')
                            ? 'bg-[#f23645]/15 text-[#f7525f] border-[#f23645]/30'
                            : 'bg-[#313441] text-[#787b86] border-[#2a2e39]'
                        }`}
                      >
                        {stock.technicalRating}
                      </span>
                    </td>

                    {/* 7D Trend Sparkline */}
                    <td className="py-2.5 px-4 text-right">
                      <svg
                        className={`w-16 h-5 ml-auto ${
                          isBull ? 'stroke-[#089981]' : 'stroke-[#f23645]'
                        }`}
                        fill="none"
                        viewBox="0 0 60 20"
                      >
                        {isBull ? (
                          <path
                            d="M0,18 L12,14 L24,16 L36,9 L48,11 L60,3"
                            strokeLinecap="round"
                            strokeWidth="1.5"
                          />
                        ) : (
                          <path
                            d="M0,5 L14,7 L26,14 L38,12 L50,17 L60,18"
                            strokeLinecap="round"
                            strokeWidth="1.5"
                          />
                        )}
                      </svg>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="p-3 bg-[#1e222d] border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
        <span>
          Showing {displayedStocks.length} of {totalItems} symbols
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="hover:text-[#d1d4dc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="hover:text-[#d1d4dc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currentPage === pageNum
                  ? 'text-white bg-[#2a2e39] font-bold'
                  : 'hover:text-[#d1d4dc]'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="hover:text-[#d1d4dc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
