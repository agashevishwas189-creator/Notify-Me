module.exports = (app, pool) => {
  // Saari streams
  app.get('/api/streams', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, name FROM streams');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Stream ke CAP rounds
  app.get('/api/streams/:id/rounds', async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM cap_rounds WHERE stream_id = ? ORDER BY start_date',
        [req.params.id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Subscribe
  app.post('/api/subscribe', async (req, res) => {
    const { email, stream_id } = req.body;
    if (!email || !stream_id) {
      return res.status(400).json({ error: 'email and stream_id required' });
    }
    try {
      await pool.query(
        'INSERT INTO subscribers (email, stream_id) VALUES (?, ?)',
        [email, stream_id]
      );
      res.status(201).json({ message: 'Subscribed successfully' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Already subscribed' });
      }
      res.status(500).json({ error: err.message });
    }
  });
};
