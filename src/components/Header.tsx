import React, { useState } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  activeNav,
  setActiveNav,
  onGetStarted
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  return (
    <header className="bg-[#131722] border-b border-[#2a2e39] sticky top-0 z-40 w-full">
      <div className="flex justify-between items-center h-12 w-full px-4 sm:px-6">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveNav('Markets')} 
            className="flex items-center gap-1 text-[#d1d4dc] tracking-tight group text-left"
          >
            <svg className="w-7 h-5 text-white" fill="currentColor" viewBox="0 0 36 28">
              <path d="M14 0H0V28H14V0ZM18 9.5H32V28H18V9.5ZM32 0H22V6.5H32V0Z" />
            </svg>
            <span className="font-bold tracking-tight text-white hidden sm:inline text-base">
              TradingView
            </span>
          </button>

          {/* Search Bar Trigger */}
          <div
            onClick={onOpenSearch}
            className="relative hidden sm:flex items-center cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-2.5 text-[#787b86] group-hover:text-[#d1d4dc] transition-colors text-[18px]">
              search
            </span>
            <input
              readOnly
              type="text"
              placeholder="Search (Ctrl+K)"
              className="bg-[#2a2e39]/50 border border-[#2a2e39] group-hover:border-[#363a45] rounded-lg pl-8 pr-14 py-1 text-xs text-[#d1d4dc] placeholder:text-[#787b86] cursor-pointer w-44 md:w-56 transition-colors"
            />
            <kbd className="absolute right-2 text-[10px] text-[#787b86] bg-[#131722] px-1.5 py-0.5 rounded border border-[#2a2e39] font-mono">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 h-12">
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`text-xs px-3 py-3.5 font-medium transition-colors duration-150 relative ${
                  isActive
                    ? 'text-[#d1d4dc] font-semibold border-b-2 border-[#2962ff]'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden text-[#787b86] hover:text-[#d1d4dc] p-1.5 rounded hover:bg-[#2a2e39] transition-colors"
            title="Search"
          >
            <span className="material-symbols-outlined text-lg">search</span>
          </button>

          {/* Language / Region */}
          <button
            onClick={() => alert('Language set to English (US)')}
            className="flex items-center gap-1 text-xs text-[#787b86] hover:text-[#d1d4dc] transition-colors py-1 px-1.5 rounded hover:bg-[#2a2e39]"
          >
            <span className="material-symbols-outlined text-base">language</span>
            <span className="hidden sm:inline font-medium">EN</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              className="text-[#787b86] hover:text-[#d1d4dc] p-1.5 rounded hover:bg-[#2a2e39] transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#2962ff] rounded-full ring-2 ring-[#131722]" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1e222d] border border-[#363a45] rounded-lg shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-[#2a2e39] flex justify-between items-center">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  <span className="text-[10px] text-[#2962ff] cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-[#2a2e39] text-xs">
                  <div className="p-3 hover:bg-[#2a2e39]/50 transition-colors">
                    <p className="text-white font-medium">NVDA reached target</p>
                    <p className="text-[#787b86] text-[11px] mt-0.5">Price touched $141.50 (+3.1%)</p>
                    <span className="text-[10px] text-[#787b86] mt-1 block">5m ago</span>
                  </div>
                  <div className="p-3 hover:bg-[#2a2e39]/50 transition-colors">
                    <p className="text-white font-medium">U.S. Market Open</p>
                    <p className="text-[#787b86] text-[11px] mt-0.5">NYSE & NASDAQ regular trading started</p>
                    <span className="text-[10px] text-[#787b86] mt-1 block">45m ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User / Profile */}
          <button
            onClick={() => alert('Signed in as Pro Trader (sam.wong.jh@gmail.com)')}
            className="text-[#787b86] hover:text-[#d1d4dc] p-1.5 rounded hover:bg-[#2a2e39] transition-colors"
            title="User Profile"
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
          </button>

          {/* Trailing Primary Action */}
          <button
            onClick={onGetStarted}
            className="bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs px-3.5 py-1.5 rounded font-semibold transition-colors duration-150 shadow-sm"
          >
            Get started
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-[#787b86] hover:text-[#d1d4dc] p-1.5 rounded hover:bg-[#2a2e39]"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#1e222d] border-b border-[#2a2e39] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                setShowMobileMenu(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded text-xs ${
                activeNav === item ? 'bg-[#2962ff] text-white font-semibold' : 'text-[#787b86] hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
