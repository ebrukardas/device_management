const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create a PostgreSQL connection pool
// Default values point to the docker-compose setup
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'devices_db',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432,
});

// GET all devices
app.get('/api/devices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY id');
    // Map camelCase to snake_case equivalent
    const devices = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      addedAt: row.added_at,
      lastConnectedAt: row.last_connected_at
    }));
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve devices' });
  }
});

// POST a new device
app.post('/api/devices', async (req, res) => {
  try {
    const { id, name, type, status, addedAt, lastConnectedAt } = req.body;
    
    // We optionally use the provided ID, otherwise let Postgres sequence generate it
    let result;
    if (id) {
      result = await pool.query(
        'INSERT INTO devices (id, name, type, status, added_at, last_connected_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, name, type, status, addedAt, lastConnectedAt]
      );
    } else {
        result = await pool.query(
        'INSERT INTO devices (name, type, status, added_at, last_connected_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, type, status, addedAt, lastConnectedAt]
      );
    }

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      addedAt: row.added_at,
      lastConnectedAt: row.last_connected_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add device' });
  }
});

// PUT (update) a device's connection status
app.put('/api/devices/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, lastConnectedAt } = req.body;
    const result = await pool.query(
      'UPDATE devices SET status = $1, last_connected_at = $2 WHERE id = $3 RETURNING *',
      [status, lastConnectedAt, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const row = result.rows[0];
    res.json({
        id: row.id,
        name: row.name,
        type: row.type,
        status: row.status,
        addedAt: row.added_at,
        lastConnectedAt: row.last_connected_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update device status' });
  }
});

// DELETE a device
app.delete('/api/devices/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('DELETE FROM devices WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
