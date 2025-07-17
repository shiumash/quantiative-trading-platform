// Portfolio and Risk Management Types

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  positions: Position[];
  cash: number;              // Available cash
  totalValue: number;        // Cash + market value of positions
  lastUpdated: Date;
  createdAt: Date;
}

export interface Position {
  symbol: string;
  quantity: number;          // Positive = long, negative = short
  averagePrice: number;      // Average cost basis
  marketValue: number;       // Current market value
  unrealizedPnL: number;     // Profit/loss if closed now
  realizedPnL: number;       // Profit/loss from closed trades
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  portfolioId: string;
  startDate: Date;
  endDate: Date;
  
  // Return metrics
  totalReturn: number;       // Total % return
  annualizedReturn: number;  // Annualized % return
  
  // Risk metrics
  sharpeRatio: number;       // Risk-adjusted return
  maxDrawdown: number;       // Worst peak-to-trough decline
  volatility: number;        // Standard deviation of returns
  
  // Trading metrics
  winRate: number;           // % of profitable trades
  profitFactor: number;      // Gross profit / gross loss
  averageWin: number;        // Average winning trade
  averageLoss: number;       // Average losing trade
  
  // Benchmark comparison
  benchmarkReturn?: number;  // S&P 500 or other benchmark
  alpha?: number;            // Excess return vs benchmark
  beta?: number;             // Correlation with benchmark
  
  calculatedAt: Date;
}