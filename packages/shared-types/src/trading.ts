// Trading and Strategy Types

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  code: string;              // The actual strategy code
  parameters: StrategyParameter[];
  createdBy: string;         // User ID
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyParameter {
  name: string;
  type: 'number' | 'string' | 'boolean';
  defaultValue: any;
  description: string;
  min?: number;              // For number types
  max?: number;
}

export interface Trade {
  id: string;
  strategyId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  executionCost: number;     // Fees, commissions
  slippage: number;          // Difference from expected price
  orderId?: string;          // Reference to original order
}

export interface Order {
  id: string;
  strategyId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price?: number;            // For limit orders
  stopPrice?: number;        // For stop orders
  status: OrderStatus;
  createdAt: Date;
  executedAt?: Date;
}

export type OrderStatus =
  | 'PENDING'
  | 'FILLED'
  | 'PARTIALLY_FILLED'
  | 'CANCELLED'
  | 'REJECTED';

// Position is defined in portfolio.ts to avoid duplication