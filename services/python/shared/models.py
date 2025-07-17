"""
Shared Pydantic models for Python services
Equivalent to our TypeScript shared-types
"""
from datetime import datetime
from typing import Optional, List, Literal, Any
from pydantic import BaseModel, Field
from decimal import Decimal

# Market Data Models
class OHLCVData(BaseModel):
    symbol: str
    timestamp: datetime
    open: float = Field(gt=0, description="Opening price must be positive")
    high: float = Field(gt=0, description="High price must be positive") 
    low: float = Field(gt=0, description="Low price must be positive")
    close: float = Field(gt=0, description="Close price must be positive")
    volume: int = Field(ge=0, description="Volume cannot be negative")
    adjusted_close: Optional[float] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

TimeInterval = Literal['1min', '5min', '15min', '1hour', '1day', '1week', '1month']

class TimeSeriesMetadata(BaseModel):
    source: str
    last_updated: datetime
    frequency: TimeInterval

class TimeSeriesData(BaseModel):
    symbol: str
    data: List[OHLCVData]
    metadata: TimeSeriesMetadata

class DataQuery(BaseModel):
    symbol: str
    start_date: datetime
    end_date: datetime
    interval: TimeInterval
    source: Optional[str] = None

# Trading Models
class StrategyParameter(BaseModel):
    name: str
    type: Literal['number', 'string', 'boolean']
    default_value: Any
    description: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None

class TradingStrategy(BaseModel):
    id: str
    name: str
    description: str
    code: str
    parameters: List[StrategyParameter]
    created_by: str
    version: str = "1.0.0"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

OrderSide = Literal['BUY', 'SELL']
OrderType = Literal['MARKET', 'LIMIT', 'STOP']
OrderStatus = Literal['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELLED', 'REJECTED']

class Trade(BaseModel):
    id: str
    strategy_id: Optional[str] = None
    symbol: str
    side: OrderSide
    quantity: float = Field(gt=0)
    price: float = Field(gt=0)
    timestamp: datetime
    execution_cost: float = Field(ge=0)
    slippage: float = Field(ge=0)
    order_id: Optional[str] = None

class Order(BaseModel):
    id: str
    strategy_id: Optional[str] = None
    symbol: str
    side: OrderSide
    type: OrderType
    quantity: float = Field(gt=0)
    price: Optional[float] = Field(gt=0, default=None)
    stop_price: Optional[float] = Field(gt=0, default=None)
    status: OrderStatus
    created_at: datetime
    executed_at: Optional[datetime] = None

# Portfolio Models
class Position(BaseModel):
    symbol: str
    quantity: float  # Can be negative for short positions
    average_price: float = Field(gt=0)
    market_value: float
    unrealized_pnl: float
    realized_pnl: float = 0.0
    last_updated: datetime

class Portfolio(BaseModel):
    id: str
    user_id: str
    name: str
    positions: List[Position] = []
    cash: float = Field(ge=0)
    total_value: float = Field(ge=0)
    last_updated: datetime
    created_at: datetime

# Performance Models
class PerformanceMetrics(BaseModel):
    portfolio_id: str
    start_date: datetime
    end_date: datetime
    
    # Return metrics
    total_return: float
    annualized_return: float
    
    # Risk metrics
    sharpe_ratio: float
    max_drawdown: float
    volatility: float
    
    # Trading metrics
    win_rate: float = Field(ge=0, le=1)
    profit_factor: float = Field(ge=0)
    average_win: float
    average_loss: float
    
    # Benchmark comparison
    benchmark_return: Optional[float] = None
    alpha: Optional[float] = None
    beta: Optional[float] = None
    
    calculated_at: datetime

# User Models
UserRole = Literal['ADMIN', 'RESEARCHER', 'VIEWER', 'TRADER']

class User(BaseModel):
    id: str
    email: str
    username: str
    first_name: str
    last_name: str
    role: UserRole
    is_active: bool = True
    created_at: datetime
    last_login_at: Optional[datetime] = None

# API Response Models
class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    request_id: str

class PaginatedResponse(BaseModel):
    data: List[Any]
    pagination: dict

# Event Models for Message Queue
class BaseEvent(BaseModel):
    id: str
    type: str
    timestamp: datetime = Field(default_factory=datetime.now)
    source: str

class DataIngestionEvent(BaseEvent):
    type: Literal['data.ingested', 'data.failed']
    symbol: str
    record_count: Optional[int] = None
    error: Optional[str] = None

class StrategyEvent(BaseEvent):
    type: Literal['strategy.created', 'strategy.updated', 'strategy.executed']
    strategy_id: str
    user_id: str

class BacktestEvent(BaseEvent):
    type: Literal['backtest.started', 'backtest.completed', 'backtest.failed']
    backtest_id: str
    strategy_id: str
    user_id: str