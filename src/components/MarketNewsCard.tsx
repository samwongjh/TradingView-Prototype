import React, { useState } from 'react';
import { NewsArticle } from '../types';

interface MarketNewsCardProps {
  articles: NewsArticle[];
  onSelectSymbol?: (symbol: string) => void;
}

export const MarketNewsCard: React.FC<MarketNewsCardProps> = ({
  articles,
  onSelectSymbol
}) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <>
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Market News</h2>
          <button
            onClick={() => setSelectedArticle(articles[0])}
            className="text-[#2962ff] hover:text-[#1e53e5] text-xs font-semibold"
          >
            See all
          </button>
        </div>

        <div className="divide-y divide-[#2a2e39]">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="py-3 first:pt-0 last:pb-0 group cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: article.sourceColor }}
                    >
                      {article.source}
                    </span>
                    <span className="text-[#50535e] text-xs">•</span>
                    <span className="text-[10px] text-[#787b86]">
                      {article.timeAgo}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm text-[#d1d4dc] group-hover:text-[#2962ff] font-medium leading-snug transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </div>

                <div className="w-16 h-14 rounded bg-[#2a2e39] overflow-hidden shrink-0 border border-[#2a2e39]">
                  <img
                    referrerPolicy="no-referrer"
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1e222d] border border-[#363a45] rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-[#787b86] hover:text-white p-1 rounded-full bg-[#131722] hover:bg-[#2a2e39] transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded bg-[#131722]"
                style={{ color: selectedArticle.sourceColor }}
              >
                {selectedArticle.source}
              </span>
              <span className="text-xs text-[#787b86]">{selectedArticle.timeAgo}</span>
              <span className="text-[#50535e]">•</span>
              <span className="text-xs text-[#787b86]">{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="w-full h-52 rounded-lg overflow-hidden mb-4 border border-[#2a2e39]">
              <img
                referrerPolicy="no-referrer"
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-[#22ab94] font-medium mb-3 italic">
              {selectedArticle.summary}
            </p>

            <div className="text-xs sm:text-sm text-[#d1d4dc] whitespace-pre-line leading-relaxed space-y-3 mb-6">
              {selectedArticle.content}
            </div>

            {selectedArticle.relatedSymbols.length > 0 && (
              <div className="pt-4 border-t border-[#2a2e39] flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#787b86]">Related Symbols:</span>
                {selectedArticle.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => {
                      if (onSelectSymbol) onSelectSymbol(sym);
                      setSelectedArticle(null);
                    }}
                    className="text-xs font-semibold px-2 py-1 rounded bg-[#131722] border border-[#2a2e39] hover:border-[#2962ff] text-[#2962ff] transition-colors"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
