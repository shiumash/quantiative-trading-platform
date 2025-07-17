# Quant Infrastructure Platform

A containerized microservices platform designed to support quantitative trading research, backtesting, and future live trading execution. Built to serve Quant UConn but open for use to the community.

## 🚀 Features

### Core Functionality
- **Historical Market Data Processing** - Ingest, validate, and serve OHLCV data
- **Real-time Data Streaming** - WebSocket connections for live market feeds
- **Strategy Development** - Code, test, and deploy quantitative trading strategies
- **Backtesting Engine** - Simulate strategy performance with realistic execution costs
- **Portfolio Management** - Track positions, P&L, and risk metrics
- **Performance Analytics** - Sharpe ratio, max drawdown, alpha/beta calculations

### Technical Features
- **Microservices Architecture** - Independent, scalable services
- **Multi-language Stack** - Right tool for the right job
- **Event-driven Communication** - Async messaging between services
- **Comprehensive Caching** - Redis for performance optimization
- **Time-series Optimization** - TimescaleDB for efficient market data storage
- **Interactive API Documentation** - Auto-generated with FastAPI
- **Container-first Development** - Docker for consistent environments

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript - Modern, type-safe UI
- **Next.js** - Server-side rendering and API routes
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Financial data visualization

### Backend Services
- **Python + FastAPI** - Core business logic services
  - Market Data Service
  - Strategy Engine
  - Backtesting Service
- **Node.js + TypeScript** - API Gateway and routing
- **Go** - High-performance data ingestion

### Data Layer
- **PostgreSQL** - Primary database with ACID compliance
- **TimescaleDB** - Time-series extension for market data
- **Redis** - Caching and real-time messaging
- **Message Queue** - Event-driven service communication

### Infrastructure
- **Docker** - Containerization for all services
- **Docker Compose** - Local development orchestration
- **Kubernetes** - Production deployment (planned)
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
quantitative-trading-platform/
├── apps/
│   └── dashboard/              # React frontend
├── services/
│   ├── api-gateway/           # TypeScript - API routing & auth
│   ├── python/
│   │   ├── market-data/       # Python - Market data processing
│   │   ├── strategy-engine/   # Python - Strategy execution
│   │   ├── backtesting/       # Python - Performance analysis
│   │   └── shared/            # Python - Shared models & utilities
│   └── go/
│       └── data-ingestion/    # Go - High-performance data ingestion
├── packages/
│   ├── shared-types/          # TypeScript - Shared type definitions
│   ├── shared-utils/          # TypeScript - Common utilities
│   └── database-client/       # TypeScript - Database connections
├── infrastructure/
│   ├── sql/                   # Database schemas and migrations
│   └── docker/                # Docker configurations
├── docker-compose.dev.yml     # Development environment
└── pnpm-workspace.yaml        # Monorepo configuration
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** 18+ and **pnpm** 8+
- **Python** 3.11+ and **pip**
- **Go** 1.21+
- **Docker** and **Docker Compose**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quantitative-trading-platform
   ```

2. **Start the development environment**
   ```bash
   # Start databases and infrastructure
   docker-compose -f docker-compose.dev.yml up -d
   
   # Install dependencies
   pnpm install
   ```

3. **Set up Python services**
   ```bash
   cd services/python/market-data
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

4. **Start services**
   ```bash
   # Terminal 1: Market Data Service
   cd services/python/market-data
   python main.py
   
   # Terminal 2: API Gateway (when ready)
   cd services/api-gateway
   pnpm dev
   
   # Terminal 3: Frontend (when ready)
   cd apps/dashboard
   pnpm dev
   ```

5. **Access the application**
   - **Market Data API**: http://localhost:8001/docs
   - **API Gateway**: http://localhost:3001
   - **Frontend**: http://localhost:3000
   - **Database Admin**: http://localhost:8080 (Adminer)

### Database Access
- **Host**: localhost:5432
- **Database**: quant_dev
- **Username**: quant_user
- **Password**: quant_pass

## 📊 API Documentation

### Market Data Service
- `GET /api/market-data/{symbol}` - Get historical OHLCV data
- `GET /api/market-data/{symbol}/latest` - Get latest price
- `POST /api/market-data/bulk-insert` - Bulk insert market data
- `GET /health` - Service health check

Interactive documentation available at http://localhost:8001/docs when running.

## 🧪 Development

### Running Tests
```bash
# TypeScript packages
pnpm test

# Python services
cd services/python/market-data
pytest

# Go services
cd services/go/data-ingestion
go test ./...
```

### Building Services
```bash
# Build all TypeScript packages
pnpm build

# Build specific Python service
cd services/python/market-data
pip install -r requirements.txt

# Build Go service
cd services/go/data-ingestion
go build
```

### Code Quality
```bash
# TypeScript linting
pnpm lint

# Python formatting
cd services/python
black .
flake8 .

# Go formatting
cd services/go
go fmt ./...
```

## 🚀 Deployment

### Local Development
Uses Docker Compose for consistent local development environment.

## 📈 Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Project structure and monorepo setup
- [x] Database schema and Docker environment
- [x] Python shared models and validation
- [x] Basic FastAPI market data service

### Phase 2: Core Services (In Progress)
- [ ] Complete market data service with caching
- [ ] Strategy engine with execution framework
- [ ] Backtesting service with performance metrics
- [ ] API Gateway with authentication
- [ ] Go data ingestion service

### Phase 3: Frontend & Integration
- [ ] React dashboard with real-time charts
- [ ] WebSocket integration for live data
- [ ] Strategy development IDE
- [ ] Portfolio management interface

### Phase 4: Advanced Features
- [ ] Interactive Brokers integration
- [ ] Machine learning strategy components
- [ ] Advanced risk management
- [ ] Multi-user collaboration features

### Phase 5: Production & Scale
- [ ] Kubernetes deployment
- [ ] Monitoring and observability
- [ ] Load testing and optimization
- [ ] Security hardening

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.