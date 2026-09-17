import React, { useState, useMemo } from 'react';
import { Stock } from '../types';

interface StockDetailModalProps {
  stock: Stock | null;
  onClose: () => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (symbol: string) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  isWatchlisted = false,
  onToggleWatchlist
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; time: string } | null>(null);

  if (!stock) return null;

  const isBull = stock.changePercent >= 0;

  // Generate synthetic price points for the selected timeframe
  const chartPoints = useMemo(() => {
    const base = stock.lastPrice;
    const pointsCount = 24;
    const points: { time: string; price: number; open: number; high: number; low: number; close: number }[] = [];

    let current = base * (1 - (stock.changePercent / 100));
    const step = (stock.lastPrice - current) / pointsCount;

    for (let i = 0; i < pointsCount; i++) {
      const noise = (Math.sin(i * 0.8) + Math.cos(i * 1.5)) * (base * 0.006);
      const val = +(current + noise).toFixed(2);
      const open = +(val - (Math.random() * 0.5 - 0.25)).toFixed(2);
      const close = val;
      const high = Math.max(open, close) + +(Math.random() * 0.8).toFixed(2);
      const low = Math.min(open, close) - +(Math.random() * 0.8).toFixed(2);

      const hour = 9 + Math.floor((i * 6.5) / pointsCount);
      const minute = Math.floor(((i * 6.5) % 1) * 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} EST`;

      points.push({ time: timeStr, price: val, open, high, low, close });
      current += step;
    }
    // Ensure last point is exactly stock.lastPrice
    points[points.length - 1].price = stock.lastPrice;
    points[points.length - 1].close = stock.lastPrice;

    return points;
  }, [stock, timeframe]);

  // Compute SVG coordinates
  const minPrice = Math.min(...chartPoints.map((p) => p.low || p.price)) * 0.995;
  const maxPrice = Math.max(...chartPoints.map((p) => p.high || p.price)) * 1.005;
  const range = maxPrice - minPrice || 1;

  const svgWidth = 600;
  const svgHeight = 220;

  const pathD = useMemo(() => {
    return chartPoints
      .map((p, idx) => {
        const x = (idx / (chartPoints.length - 1)) * svgWidth;
        const y = svgHeight - ((p.price - minPrice) / range) * svgHeight;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [chartPoints, minPrice, range]);

  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  const handleOrder = (type: 'BUY' | 'SELL') => {
    const total = (tradeShares * stock.lastPrice).toFixed(2);
    setOrderNotification(`Paper Order Executed: ${type} ${tradeShares} shares of ${stock.symbol} @ $${stock.lastPrice.toFixed(2)} ($${total})`);
    setTimeout(() => {
      setOrderNotification(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1e222d] border border-[#363a45] rounded-xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#787b86] hover:text-white p-1 rounded-full bg-[#131722] hover:bg-[#2a2e39] transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-lg border flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: stock.logoBg,
                borderColor: stock.logoBorder,
                color: stock.logoColor
              }}
            >
              {stock.logoText}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{stock.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#131722] text-[#787b86] font-medium border border-[#2a2e39]">
                  {stock.exchange}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#131722] text-[#787b86] font-medium border border-[#2a2e39]">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-[#787b86] mt-0.5">{stock.name}</p>
            </div>
          </div>

          <div className="flex items-baseline sm:flex-col sm:items-end gap-3 sm:gap-0">
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              ${stock.lastPrice.toFixed(2)}
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold tabular-nums ${
                isBull ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              <span>{isBull ? '+' : ''}${Math.abs(stock.changeAmount).toFixed(2)}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  isBull ? 'bg-[#089981]/15 text-[#089981]' : 'bg-[#f23645]/15 text-[#f23645]'
                }`}
              >
                {isBull ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Order Notification Toast */}
        {orderNotification && (
          <div className="my-3 p-2.5 bg-[#089981]/20 border border-[#089981]/50 rounded text-xs text-[#22ab94] flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{orderNotification}</span>
          </div>
        )}

        {/* Interactive Chart Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 my-3">
          {/* Timeframes */}
          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
            {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2a2e39] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle & Watchlist */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
              <button
                onClick={() => setChartType('area')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  chartType === 'area' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
                title="Area Chart"
              >
                <span className="material-symbols-outlined text-sm">show_chart</span>
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  chartType === 'candles' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
                title="Candlestick Chart"
              >
                <span className="material-symbols-outlined text-sm">candlestick_chart</span>
              </button>
            </div>

            {onToggleWatchlist && (
              <button
                onClick={() => onToggleWatchlist(stock.symbol)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                  isWatchlisted
                    ? 'bg-[#2962ff]/15 border-[#2962ff] text-[#2962ff]'
                    : 'bg-[#131722] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isWatchlisted ? 'star' : 'star_border'}
                </span>
                <span className="hidden sm:inline">
                  {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg p-3 relative h-60 overflow-hidden select-none">
          {/* Crosshair Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 left-3 bg-[#1e222d] border border-[#363a45] rounded px-2.5 py-1 text-[11px] z-20 shadow-lg pointer-events-none">
              <div className="text-white font-semibold">${hoveredPoint.price.toFixed(2)}</div>
              <div className="text-[#787b86] text-[10px]">{hoveredPoint.time}</div>
            </div>
          )}

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isBull ? '#089981' : '#f23645'} stopOpacity="0.35" />
                <stop offset="100%" stopColor={isBull ? '#089981' : '#f23645'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((fraction) => (
              <line
                key={fraction}
                x1="0"
                y1={svgHeight * fraction}
                x2={svgWidth}
                y2={svgHeight * fraction}
                stroke="#2a2e39"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {chartType === 'area' ? (
              <>
                <path d={areaD} fill="url(#chartGradient)" />
                <path
                  d={pathD}
                  fill="none"
                  stroke={isBull ? '#089981' : '#f23645'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              /* Candlestick renderer */
              chartPoints.map((p, idx) => {
                const x = (idx / (chartPoints.length - 1)) * svgWidth;
                const candleBull = p.close >= p.open;
                const yHigh = svgHeight - ((p.high - minPrice) / range) * svgHeight;
                const yLow = svgHeight - ((p.low - minPrice) / range) * svgHeight;
                const yOpen = svgHeight - ((p.open - minPrice) / range) * svgHeight;
                const yClose = svgHeight - ((p.close - minPrice) / range) * svgHeight;

                const topY = Math.min(yOpen, yClose);
                const height = Math.max(2, Math.abs(yClose - yOpen));
                const color = candleBull ? '#089981' : '#f23645';

                return (
                  <g key={idx}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1" />
                    <rect
                      x={x - 4}
                      y={topY}
                      width={8}
                      height={height}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })
            )}

            {/* Interactive hover points */}
            {chartPoints.map((p, idx) => {
              const x = (idx / (chartPoints.length - 1)) * svgWidth;
              const y = svgHeight - ((p.price - minPrice) / range) * svgHeight;
              return (
                <rect
                  key={idx}
                  x={x - (svgWidth / chartPoints.length) / 2}
                  y="0"
                  width={svgWidth / chartPoints.length}
                  height={svgHeight}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredPoint({ x, y, price: p.price, time: p.time })}
                />
              );
            })}

            {/* Crosshair indicator */}
            {hoveredPoint && (
              <>
                <line
                  x1={hoveredPoint.x}
                  y1="0"
                  x2={hoveredPoint.x}
                  y2={svgHeight}
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="4"
                  fill="#ffffff"
                  stroke={isBull ? '#089981' : '#f23645'}
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-2.5 bg-[#131722] border border-[#2a2e39] rounded">
            <div className="text-[10px] text-[#787b86]">Market Cap</div>
            <div className="text-xs font-semibold text-white mt-0.5">{stock.marketCap}</div>
          </div>
          <div className="p-2.5 bg-[#131722] border border-[#2a2e39] rounded">
            <div className="text-[10px] text-[#787b86]">P/E Ratio</div>
            <div className="text-xs font-semibold text-white mt-0.5">{stock.peRatio}</div>
          </div>
          <div className="p-2.5 bg-[#131722] border border-[#2a2e39] rounded">
            <div className="text-[10px] text-[#787b86]">EPS (TTM)</div>
            <div className="text-xs font-semibold text-white mt-0.5">${stock.eps}</div>
          </div>
          <div className="p-2.5 bg-[#131722] border border-[#2a2e39] rounded">
            <div className="text-[10px] text-[#787b86]">52W Range</div>
            <div className="text-xs font-semibold text-white mt-0.5">${stock.low52} - ${stock.high52}</div>
          </div>
        </div>

        {/* Paper Trading Simulation Bar */}
        <div className="p-3 bg-[#131722] border border-[#2a2e39] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#787b86]">Shares:</span>
            <input
              type="number"
              min="1"
              max="10000"
              value={tradeShares}
              onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 bg-[#1e222d] border border-[#2a2e39] rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-[#2962ff]"
            />
            <span className="text-xs text-[#787b86] ml-2">
              Est. Total: <strong className="text-white">${(tradeShares * stock.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleOrder('BUY')}
              className="flex-1 sm:flex-none bg-[#089981] hover:bg-[#22ab94] text-white px-5 py-1.5 rounded text-xs font-bold transition-colors"
            >
              Buy
            </button>
            <button
              onClick={() => handleOrder('SELL')}
              className="flex-1 sm:flex-none bg-[#f23645] hover:bg-[#f7525f] text-white px-5 py-1.5 rounded text-xs font-bold transition-colors"
            >
              Sell
            </button>
          </div>
        </div>

        {/* Company Overview Description */}
        <div className="mt-4 text-xs text-[#787b86] leading-relaxed">
          <p>{stock.description}</p>
        </div>
      </div>
    </div>
  );
};
