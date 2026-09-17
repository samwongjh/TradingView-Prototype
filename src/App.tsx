import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSubheader } from './components/HeroSubheader';
import { IndicesCarousel } from './components/IndicesCarousel';
import { ScreenerTable } from './components/ScreenerTable';
import { SectorsPerformance } from './components/SectorsPerformance';
import { MarketSentimentCard } from './components/MarketSentimentCard';
import { MarketNewsCard } from './components/MarketNewsCard';
import { CommunityIdeasCard } from './components/CommunityIdeasCard';
import { StockDetailModal } from './components/StockDetailModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

import {
  INITIAL_STOCKS,
  INDICES,
  SECTORS,
  NEWS_ARTICLES,
  COMMUNITY_IDEA,
  CATEGORY_STOCKS
} from './data/marketData';
import { Stock, MarketIndex, MarketCategory } from './types';

export default function App() {
  const [activeNav, setActiveNav] = useState<string>('Markets');
  const [selectedRegion, setSelectedRegion] = useState<string>('Markets, everywhere');
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(INDICES);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'MSFT'];
    } catch {
      return ['NVDA', 'AAPL', 'MSFT'];
    }
  });

  // Handle category changes (e.g. US Stocks vs Crypto vs Forex)
  const handleSelectCategory = (cat: MarketCategory) => {
    setActiveCategory(cat);
    if (CATEGORY_STOCKS[cat]) {
      setStocks(CATEGORY_STOCKS[cat]);
    } else {
      setStocks(INITIAL_STOCKS);
    }
  };

  // Keyboard shortcut for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle real-time tick simulator to keep the market dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random stock and slightly adjust lastPrice
      setStocks((prevStocks) => {
        if (prevStocks.length === 0) return prevStocks;
        const randomIndex = Math.floor(Math.random() * prevStocks.length);
        const target = prevStocks[randomIndex];
        // small perturbation: -0.15% to +0.15%
        const deltaFactor = 1 + (Math.random() * 0.003 - 0.0015);
        const newPrice = +(target.lastPrice * deltaFactor).toFixed(2);
        const diff = +(newPrice - target.lastPrice).toFixed(2);

        if (diff === 0) return prevStocks;

        const newChangeAmount = +(target.changeAmount + diff).toFixed(2);
        const newChangePercent = +(target.changePercent + (diff / target.lastPrice) * 100).toFixed(2);

        const updated = [...prevStocks];
        updated[randomIndex] = {
          ...target,
          lastPrice: newPrice,
          changeAmount: newChangeAmount,
          changePercent: newChangePercent
        };
        return updated;
      });

      // Also occasionally update one index
      if (Math.random() > 0.5) {
        setIndices((prevIndices) => {
          const randIdx = Math.floor(Math.random() * prevIndices.length);
          const target = prevIndices[randIdx];
          const delta = (Math.random() * 2 - 0.9);
          const newVal = +(target.value + delta).toFixed(2);
          const newChg = +(target.change + delta).toFixed(2);
          const updated = [...prevIndices];
          updated[randIdx] = {
            ...target,
            value: newVal,
            change: newChg,
            isPositive: newChg >= 0
          };
          return updated;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleSelectSymbolFromArticle = (symbol: string) => {
    const found = stocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      setSelectedStock(found);
    } else {
      // Find in INITIAL_STOCKS or show search
      const fallback = INITIAL_STOCKS.find((s) => s.symbol === symbol) || INITIAL_STOCKS[0];
      setSelectedStock(fallback);
    }
  };

  const handleGetStarted = () => {
    // Open NVDA as the featured stock for the user to explore
    const nvda = stocks.find((s) => s.symbol === 'NVDA') || stocks[0];
    setSelectedStock(nvda);
  };

  return (
    <div className="bg-[#131722] text-[#d1d4dc] min-h-screen flex flex-col font-sans selection:bg-[#2962ff] selection:text-white">
      {/* Top Nav Bar */}
      <Header
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGetStarted={handleGetStarted}
      />

      {/* Hero Subheader */}
      <HeroSubheader
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* Major Market Indices Carousel / Row */}
      <IndicesCarousel
        indices={indices}
        onSelectIndex={(idx) => {
          // Open representative stock or show details
          const matching = stocks.find((s) => s.exchange === 'NASDAQ') || stocks[0];
          setSelectedStock(matching);
        }}
      />

      {/* Main App Workspace: 8-col Primary + 4-col Sidebar */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ===================== PRIMARY COLUMN (8 COLS) ===================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stock Screener Module */}
            <ScreenerTable
              stocks={stocks}
              onSelectStock={(stock) => setSelectedStock(stock)}
              onOpenFullScreener={() => {
                alert('Expanded Full Screener mode active. You can filter and export symbols below.');
              }}
            />

            {/* U.S. Sectors Performance Module */}
            <SectorsPerformance
              sectors={SECTORS}
              onSelectSector={(sectorName) => {
                // Filter the screener table to this sector
                const filtered = INITIAL_STOCKS.filter((s) =>
                  s.sector.toLowerCase().includes(sectorName.toLowerCase().slice(0, 4))
                );
                if (filtered.length > 0) {
                  setStocks(filtered);
                }
              }}
            />
          </div>

          {/* ===================== SECONDARY COLUMN / SIDEBAR (4 COLS) ===================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* Fear & Greed Sentiment Gauge */}
            <MarketSentimentCard />

            {/* Live Financial News Feed */}
            <MarketNewsCard
              articles={NEWS_ARTICLES}
              onSelectSymbol={handleSelectSymbolFromArticle}
            />

            {/* Community Trading Ideas */}
            <CommunityIdeasCard
              idea={COMMUNITY_IDEA}
              onSelectSymbol={handleSelectSymbolFromArticle}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Stock Detail Modal / Drawer */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          isWatchlisted={watchlist.includes(selectedStock.symbol)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={INITIAL_STOCKS}
        indices={INDICES}
        onSelectStock={(stock) => setSelectedStock(stock)}
      />
    </div>
  );
}
