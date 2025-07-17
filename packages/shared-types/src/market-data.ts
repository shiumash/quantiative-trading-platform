// Market Data Types - Foundation of all trading systems

export interface OHLCVData {
  symbol: string;           // Stock/crypto symbol (e.g., "AAPL", "BTC-USD")
  timestamp: Date;          // When this data point occurred
  open: number;            // Opening price
  high: number;            // Highest price in period
  low: number;             // Lowest price in period
  close: number;           // Closing price
  volume: number;          // Trading volume
  adjustedClose?: number;  // Price adjusted for splits/dividends
}

export interface TimeSeriesData {
  symbol: string;
  data: OHLCVData[];
  metadata: {
    source: string;        // Where data came from (e.g., "yahoo", "alpha_vantage")
    lastUpdated: Date;
    frequency: TimeInterval;
  };
}

export type TimeInterval = 
  | '1min' 
  | '5min' 
  | '15min' 
  | '1hour' 
  | '1day' 
  | '1week' 
  | '1month';

export interface DataQuery {
  symbol: string;
  startDate: Date;
  endDate: Date;
  interval: TimeInterval;
  source?: string;
}

// For real-time data streaming
export interface MarketDataEvent {
  type: 'price_update' | 'volume_update' | 'trade';
  symbol: string;
  data: OHLCVData;
  timestamp: Date;
}