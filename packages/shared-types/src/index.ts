// Main exports for shared types package

// Market Data
export * from './market-data';

// Trading
export * from './trading';

// Portfolio
export * from './portfolio';

// User Management
export * from './user';

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event types for message queue
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
}

export interface DataIngestionEvent extends BaseEvent {
  type: 'data.ingested' | 'data.failed';
  symbol: string;
  recordCount?: number;
  error?: string;
}

export interface StrategyEvent extends BaseEvent {
  type: 'strategy.created' | 'strategy.updated' | 'strategy.executed';
  strategyId: string;
  userId: string;
}

export interface BacktestEvent extends BaseEvent {
  type: 'backtest.started' | 'backtest.completed' | 'backtest.failed';
  backtestId: string;
  strategyId: string;
  userId: string;
}