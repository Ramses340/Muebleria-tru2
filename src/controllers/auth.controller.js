const jwt = require('jsonwebtoken');
const db = require('../db');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES = '2h';

// WARNING: This example stores plain text passwords for simplicity.
// For production use bcrypt to hash passwords.

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // check exists
    const [rows] = await db.query('SELECT id FROM usuarios WHERE username = ?', [username]);
    if (rows.length) return res.status(400).json({ message: 'Usuario ya existe' });
    const [result] = await db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ id: result.insertId, username });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT id, username, password FROM usuarios WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    // plain compare (replace with bcrypt.compare for hashed passwords)
    if (password !== user.password) return res.status(401).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
};
