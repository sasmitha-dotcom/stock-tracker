const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { symbol, type, quantity, price, trade_date, notes } = req.body;

    const { data, error } = await supabase
      .from('trades')
      .update({ symbol: symbol.toUpperCase(), type, quantity, price, trade_date, notes: notes || null })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Trade not found' });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).send();
  }

  res.status(405).json({ error: 'Method not allowed' });
};
