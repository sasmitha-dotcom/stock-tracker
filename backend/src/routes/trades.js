const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET /api/trades
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('trade_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/trades
router.post('/', async (req, res) => {
  const { symbol, type, quantity, price, trade_date, notes } = req.body;
  if (!symbol || !type || !quantity || !price || !trade_date) {
    return res.status(400).json({ error: 'symbol, type, quantity, price, and trade_date are required' });
  }

  const { data, error } = await supabase
    .from('trades')
    .insert([{ symbol: symbol.toUpperCase(), type, quantity, price, trade_date, notes: notes || null }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/trades/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { symbol, type, quantity, price, trade_date, notes } = req.body;

  const { data, error } = await supabase
    .from('trades')
    .update({ symbol: symbol.toUpperCase(), type, quantity, price, trade_date, notes: notes || null })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Trade not found' });
  res.json(data);
});

// DELETE /api/trades/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
