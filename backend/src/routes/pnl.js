const express = require('express');
const router = express.Router();
const supabase = require('../db');

/**
 * FIFO P&L calculation.
 *
 * Query param: prices  (optional)
 *   Format: "AAPL:185.50,TSLA:210.00"
 *
 * GET /api/pnl?prices=AAPL:185.50,TSLA:210.00
 */
router.get('/', async (req, res) => {
  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    .order('trade_date', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  // Parse optional current prices from query param
  const currentPrices = {};
  if (req.query.prices) {
    req.query.prices.split(',').forEach((entry) => {
      const [sym, price] = entry.split(':');
      if (sym && price) currentPrices[sym.toUpperCase()] = parseFloat(price);
    });
  }

  // Group by symbol
  const bySymbol = {};
  for (const trade of trades) {
    const sym = trade.symbol.toUpperCase();
    if (!bySymbol[sym]) bySymbol[sym] = [];
    bySymbol[sym].push(trade);
  }

  const summary = [];
  let totalRealized = 0;
  let totalUnrealized = 0;

  for (const [symbol, symTrades] of Object.entries(bySymbol)) {
    const buyQueue = [];
    let realizedPnl = 0;

    for (const trade of symTrades) {
      const qty = parseFloat(trade.quantity);
      const price = parseFloat(trade.price);

      if (trade.type === 'BUY') {
        buyQueue.push({ quantity: qty, price });
      } else {
        let remaining = qty;
        while (remaining > 0 && buyQueue.length > 0) {
          const lot = buyQueue[0];
          const consumed = Math.min(lot.quantity, remaining);
          realizedPnl += consumed * (price - lot.price);
          lot.quantity -= consumed;
          remaining -= consumed;
          if (lot.quantity === 0) buyQueue.shift();
        }
      }
    }

    const openQty = buyQueue.reduce((sum, l) => sum + l.quantity, 0);
    const avgCost =
      openQty > 0
        ? buyQueue.reduce((sum, l) => sum + l.quantity * l.price, 0) / openQty
        : 0;

    const currentPrice = currentPrices[symbol] ?? null;
    const unrealizedPnl = currentPrice !== null ? openQty * (currentPrice - avgCost) : null;

    totalRealized += realizedPnl;
    if (unrealizedPnl !== null) totalUnrealized += unrealizedPnl;

    summary.push({
      symbol,
      realizedPnl: +realizedPnl.toFixed(4),
      openQty: +openQty.toFixed(4),
      avgCost: +avgCost.toFixed(4),
      currentPrice,
      unrealizedPnl: unrealizedPnl !== null ? +unrealizedPnl.toFixed(4) : null,
    });
  }

  res.json({
    summary,
    totals: {
      realizedPnl: +totalRealized.toFixed(4),
      unrealizedPnl: +totalUnrealized.toFixed(4),
    },
  });
});

module.exports = router;
