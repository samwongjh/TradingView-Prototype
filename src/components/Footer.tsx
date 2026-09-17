import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#131722] border-t border-[#2a2e39] mt-12 w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand Logo & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#"
            className="text-base text-[#d1d4dc] font-bold flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg className="w-6 h-4 text-white" fill="currentColor" viewBox="0 0 36 28">
              <path d="M14 0H0V28H14V0ZM18 9.5H32V28H18V9.5ZM32 0H22V6.5H32V0Z" />
            </svg>
            <span className="text-white">TradingView</span>
          </a>
          <span className="hidden sm:inline text-[#50535e]">•</span>
          <span className="text-[#787b86] text-xs">
            &copy; 2025 TradingView, Inc. All rights reserved.
          </span>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <a
            href="#markets"
            className="text-[#d1d4dc] font-semibold hover:text-white transition-colors"
          >
            Markets
          </a>
          <a
            href="#screeners"
            className="text-[#787b86] hover:text-[#d1d4dc] transition-colors"
          >
            Screeners
          </a>
          <a
            href="#terms"
            className="text-[#787b86] hover:text-[#d1d4dc] transition-colors"
          >
            Terms of service
          </a>
          <a
            href="#privacy"
            className="text-[#787b86] hover:text-[#d1d4dc] transition-colors"
          >
            Privacy policy
          </a>
          <a
            href="#status"
            className="text-[#787b86] hover:text-[#d1d4dc] transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            Status
          </a>
        </div>

        {/* Regulatory Disclaimers / Market Source */}
        <div className="text-[10px] text-[#787b86] text-center md:text-right">
          Data delivered with sub-second latency from direct exchange feeds.
        </div>
      </div>
    </footer>
  );
};
