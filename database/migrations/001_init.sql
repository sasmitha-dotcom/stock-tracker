-- Stock Trade Tracker — Initial Schema

CREATE TYPE trade_type AS ENUM ('BUY', 'SELL');

CREATE TABLE trades (
  id          SERIAL PRIMARY KEY,
  symbol      VARCHAR(20)  NOT NULL,
  type        trade_type   NOT NULL,
  quantity    NUMERIC(15,4) NOT NULL CHECK (quantity > 0),
  price       NUMERIC(15,4) NOT NULL CHECK (price > 0),
  trade_date  DATE         NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_symbol ON trades (symbol);
CREATE INDEX idx_trades_date   ON trades (trade_date);
