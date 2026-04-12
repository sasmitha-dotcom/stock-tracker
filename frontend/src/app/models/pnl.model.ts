export interface SymbolPnl {
  symbol: string;
  realizedPnl: number;
  openQty: number;
  avgCost: number;
  currentPrice: number | null;
  unrealizedPnl: number | null;
}

export interface PnlResponse {
  summary: SymbolPnl[];
  totals: {
    realizedPnl: number;
    unrealizedPnl: number;
  };
}
