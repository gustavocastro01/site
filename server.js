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

// Rota de Cadastro
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name',
      [name, email, hashedPassword]
    );
    res.status(201).json({ id: result.rows[0].id, name: result.rows[0].name });
  } catch (error) {
    if (error.code === '23505') { 
      res.status(409).json({ error: 'Email already in use.' });
    } else {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
