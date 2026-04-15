const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('trade_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
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
    return res.status(201).json(data);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
