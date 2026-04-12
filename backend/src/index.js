require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tradesRouter = require('./routes/trades');
const pnlRouter = require('./routes/pnl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/trades', tradesRouter);
app.use('/api/pnl', pnlRouter);

app.listen(PORT, () => {
  console.log(`Stock Tracker API running on http://localhost:${PORT}`);
});
