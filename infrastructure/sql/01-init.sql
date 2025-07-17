-- Initialize TimescaleDB extension and create basic schema
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create schemas for different domains
CREATE SCHEMA IF NOT EXISTS market_data;
CREATE SCHEMA IF NOT EXISTS trading;
CREATE SCHEMA IF NOT EXISTS users;

-- Market data table (time-series optimized)
CREATE TABLE market_data.ohlcv (
    symbol VARCHAR(20) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    open DECIMAL(12,4) NOT NULL,
    high DECIMAL(12,4) NOT NULL,
    low DECIMAL(12,4) NOT NULL,
    close DECIMAL(12,4) NOT NULL,
    volume BIGINT NOT NULL,
    adjusted_close DECIMAL(12,4),
    source VARCHAR(50) NOT NULL DEFAULT 'unknown',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (symbol, timestamp)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('market_data.ohlcv', 'timestamp');

-- Create indexes for efficient queries
CREATE INDEX idx_ohlcv_symbol_time ON market_data.ohlcv (symbol, timestamp DESC);
CREATE INDEX idx_ohlcv_source ON market_data.ohlcv (source);

-- Users table
CREATE TABLE users.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Trading strategies table
CREATE TABLE trading.strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    parameters JSONB DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES users.users(id),
    version VARCHAR(20) DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE trading.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users.users(id),
    name VARCHAR(255) NOT NULL,
    cash DECIMAL(15,2) DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions table
CREATE TABLE trading.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES trading.portfolios(id),
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(15,4) NOT NULL,
    average_price DECIMAL(12,4) NOT NULL,
    market_value DECIMAL(15,2) DEFAULT 0,
    unrealized_pnl DECIMAL(15,2) DEFAULT 0,
    realized_pnl DECIMAL(15,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, symbol)
);

-- Trades table (time-series)
CREATE TABLE trading.trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES trading.strategies(id),
    portfolio_id UUID NOT NULL REFERENCES trading.portfolios(id),
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    quantity DECIMAL(15,4) NOT NULL,
    price DECIMAL(12,4) NOT NULL,
    execution_cost DECIMAL(10,4) DEFAULT 0,
    slippage DECIMAL(10,4) DEFAULT 0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    order_id UUID
);

-- Convert trades to hypertable
SELECT create_hypertable('trading.trades', 'timestamp');

-- Create indexes
CREATE INDEX idx_trades_strategy ON trading.trades (strategy_id, timestamp DESC);
CREATE INDEX idx_trades_portfolio ON trading.trades (portfolio_id, timestamp DESC);
CREATE INDEX idx_trades_symbol ON trading.trades (symbol, timestamp DESC);