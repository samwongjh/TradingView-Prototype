import React, { useState, useEffect, useRef } from 'react';
import { Stock, MarketIndex } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  indices: MarketIndex[];
  onSelectStock: (stock: Stock) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectStock
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIndices = indices.filter(
    (idx) =>
      idx.name.toLowerCase().includes(query.toLowerCase()) ||
      idx.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(filteredStocks.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredStocks[selectedIndex]) {
        onSelectStock(filteredStocks[selectedIndex]);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1e222d] border border-[#363a45] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#2a2e39] flex items-center gap-2.5 bg-[#131722]/50">
          <span className="material-symbols-outlined text-[#787b86] text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search symbols, companies, or sectors..."
            className="w-full bg-transparent text-sm text-white placeholder:text-[#50535e] focus:outline-none"
          />
          <kbd className="text-[10px] text-[#787b86] bg-[#131722] px-1.5 py-0.5 rounded border border-[#2a2e39] font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 divide-y divide-[#2a2e39]/50">
          {filteredStocks.length === 0 && filteredIndices.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#787b86]">
              No instruments match &quot;{query}&quot;
            </div>
          ) : (
            <>
              {/* Indices section if any match */}
              {filteredIndices.length > 0 && (
                <div className="pb-1">
                  <div className="text-[10px] font-semibold text-[#787b86] px-2 py-1 uppercase tracking-wider">
                    Indices
                  </div>
                  {filteredIndices.map((idx) => (
                    <div
                      key={idx.id}
                      onClick={() => {
                        // find matching stock or close
                        onClose();
                      }}
                      className="px-3 py-2 rounded hover:bg-[#2a2e39] transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                          style={{ backgroundColor: idx.badgeBg }}
                        >
                          {idx.badgeText}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#2962ff]">
                            {idx.name}
                          </div>
                          <div className="text-[10px] text-[#787b86]">{idx.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-white tabular-nums">
                          {idx.value.toFixed(2)}
                        </div>
                        <div
                          className={`text-[10px] tabular-nums font-semibold ${
                            idx.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {idx.isPositive ? '+' : ''}{idx.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stocks Section */}
              {filteredStocks.length > 0 && (
                <div className="pt-1">
                  <div className="text-[10px] font-semibold text-[#787b86] px-2 py-1 uppercase tracking-wider">
                    Stocks &amp; Equities
                  </div>
                  {filteredStocks.map((stock, i) => {
                    const isBull = stock.changePercent >= 0;
                    const isSelected = i === selectedIndex;
                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          onSelectStock(stock);
                          onClose();
                        }}
                        className={`px-3 py-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-[#2a2e39]' : 'hover:bg-[#2a2e39]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded border flex items-center justify-center font-bold text-[10px]"
                            style={{
                              backgroundColor: stock.logoBg,
                              borderColor: stock.logoBorder,
                              color: stock.logoColor
                            }}
                          >
                            {stock.logoText}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-1">
                              <span>{stock.symbol}</span>
                              <span className="text-[10px] text-[#787b86] font-normal">{stock.exchange}</span>
                            </div>
                            <div className="text-[10px] text-[#787b86] truncate max-w-[200px]">
                              {stock.name}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold text-white tabular-nums">
                            ${stock.lastPrice.toFixed(2)}
                          </div>
                          <div
                            className={`text-[10px] tabular-nums font-semibold ${
                              isBull ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isBull ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-[#131722] border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
          <span>Navigation: <kbd className="px-1 bg-[#1e222d] border border-[#2a2e39] rounded">↑</kbd> <kbd className="px-1 bg-[#1e222d] border border-[#2a2e39] rounded">↓</kbd></span>
          <span>Select: <kbd className="px-1 bg-[#1e222d] border border-[#2a2e39] rounded">Enter</kbd></span>
        </div>
      </div>
    </div>
  );
};
