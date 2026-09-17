export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  logoText: string;
  logoBg: string;
  logoBorder: string;
  logoColor: string;
  lastPrice: number;
  changePercent: number;
  changeAmount: number;
  volume: string;
  rawVolume: number;
  marketCap: string;
  rawMarketCap: number; // in Billions
  technicalRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  sparkline: number[];
  sector: 'Technology' | 'Financials' | 'Consumer Discretionary' | 'Healthcare' | 'Energy' | 'Communication' | 'Industrials';
  marketCapCategory: 'Mega Cap (> $200B)' | 'Large Cap ($10B-$200B)' | 'Mid Cap ($2B-$10B)' | 'Small Cap (< $2B)';
  peRatio: number;
  eps: number;
  high52: number;
  low52: number;
  dividendYield: string;
  description: string;
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  region: string;
  badgeText: string;
  badgeBg: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  isPositive: boolean;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  advancingPercent: number;
  decliningPercent: number;
  isPositive: boolean;
}

export interface NewsArticle {
  id: string;
  source: string;
  sourceColor: string;
  timeAgo: string;
  title: string;
  imageUrl: string;
  summary: string;
  content: string;
  readTime: string;
  relatedSymbols: string[];
}

export interface IdeaComment {
  id: string;
  author: string;
  time: string;
  text: string;
  likes: number;
}

export interface CommunityIdea {
  id: string;
  author: string;
  authorInitials: string;
  badgeText: string;
  isLong: boolean;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  comments: IdeaComment[];
}

export type ScreenerTab =
  | 'Most active'
  | 'Gainers'
  | 'Losers'
  | 'Unusual volume'
  | '52-week highs'
  | 'Most volatile';

export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';
