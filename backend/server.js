require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

// Pool lazy hota hai, DB ready na ho tab bhi server start ho jayega
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 6,
  ssl: { ca: fs.readFileSync(path.join(__dirname, 'global-bundle.pem')) },
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'notify-me' });
});

app.get('/api/db-check', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ db: 'connected', rows });
  } catch (err) {
    res.status(500).json({ db: 'not connected', error: err.message });
  }
});
require('./routes')(app, pool);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
