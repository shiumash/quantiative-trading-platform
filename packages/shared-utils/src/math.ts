// Mathematical utilities for financial calculations

export interface ReturnSeries {
  returns: number[];
  dates: Date[];
}

// Calculate percentage returns from price series
export function calculateReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const returnValue = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(returnValue);
  }
  return returns;
}

// Calculate Sharpe Ratio (risk-adjusted return)
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0;
  
  const avgReturn = mean(returns);
  const returnStd = standardDeviation(returns);
  
  if (returnStd === 0) return 0;
  
  // Annualize the calculation (assuming daily returns)
  const annualizedReturn = avgReturn * 252; // 252 trading days per year
  const annualizedStd = returnStd * Math.sqrt(252);
  
  return (annualizedReturn - riskFreeRate) / annualizedStd;
}

// Calculate Maximum Drawdown
export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i];
    } else {
      const drawdown = (peak - prices[i]) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
}

// Calculate volatility (standard deviation of returns)
export function calculateVolatility(returns: number[], annualize: boolean = true): number {
  const std = standardDeviation(returns);
  return annualize ? std * Math.sqrt(252) : std;
}

// Calculate win rate from trade returns
export function calculateWinRate(returns: number[]): number {
  if (returns.length === 0) return 0;
  const wins = returns.filter(r => r > 0).length;
  return wins / returns.length;
}

// Calculate profit factor (gross profit / gross loss)
export function calculateProfitFactor(returns: number[]): number {
  const profits = returns.filter(r => r > 0);
  const losses = returns.filter(r => r < 0);
  
  if (losses.length === 0) return profits.length > 0 ? Infinity : 1;
  
  const grossProfit = profits.reduce((sum, r) => sum + r, 0);
  const grossLoss = Math.abs(losses.reduce((sum, r) => sum + r, 0));
  
  return grossLoss === 0 ? Infinity : grossProfit / grossLoss;
}

// Statistical helper functions
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const avg = mean(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const variance = mean(squaredDiffs);
  
  return Math.sqrt(variance);
}

// Calculate correlation between two return series
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
  if (returns1.length !== returns2.length || returns1.length === 0) return 0;
  
  const mean1 = mean(returns1);
  const mean2 = mean(returns2);
  
  let numerator = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  
  for (let i = 0; i < returns1.length; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;
    
    numerator += diff1 * diff2;
    sum1Sq += diff1 * diff1;
    sum2Sq += diff2 * diff2;
  }
  
  const denominator = Math.sqrt(sum1Sq * sum2Sq);
  return denominator === 0 ? 0 : numerator / denominator;
}

// Calculate beta (correlation with market)
export function calculateBeta(assetReturns: number[], marketReturns: number[]): number {
  if (assetReturns.length !== marketReturns.length || assetReturns.length === 0) return 0;
  
  const correlation = calculateCorrelation(assetReturns, marketReturns);
  const assetStd = standardDeviation(assetReturns);
  const marketStd = standardDeviation(marketReturns);
  
  return marketStd === 0 ? 0 : correlation * (assetStd / marketStd);
}