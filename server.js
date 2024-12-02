const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',
  database: 'cupcake_store',
  password: '123',  
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Rota de Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ name: user.name });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
