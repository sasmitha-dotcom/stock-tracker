export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: number;
  symbol: string;
  type: TradeType;
  quantity: number;
  price: number;
  trade_date: string;
  notes?: string;
  created_at: string;
}

export interface TradePayload {
  symbol: string;
  type: TradeType;
  quantity: number;
  price: number;
  trade_date: string;
  notes?: string;
}
