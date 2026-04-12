# Stock Tracker

Angular + Node.js + PostgreSQL app to track stock trades and P&L.

---

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Angular CLI (`npm install -g @angular/cli`)

---

## Setup

### 1. Database
```bash
createdb stock_tracker
psql stock_tracker < database/migrations/001_init.sql
```

### 2. Backend
```bash
cd backend
npm install
# Edit .env — update DATABASE_URL with your Postgres credentials
npm start
# API running at http://localhost:3000
```

### 3. Frontend
```bash
cd frontend
ng new . --routing --style=scss   # only needed once to generate Angular files
npm install @angular/material @angular/cdk
ng serve --proxy-config proxy.conf.json
# App running at http://localhost:4200
```

---

## Usage

| Route | Description |
|-------|-------------|
| `/trades` | View, add, edit, delete trades |
| `/pnl` | P&L dashboard (realized + unrealized) |

For **unrealized P&L**, enter current prices in the format `AAPL:185.5,TSLA:210` and click Refresh.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trades` | List all trades |
| POST | `/api/trades` | Add trade |
| PUT | `/api/trades/:id` | Update trade |
| DELETE | `/api/trades/:id` | Delete trade |
| GET | `/api/pnl?prices=SYM:price` | P&L summary |
