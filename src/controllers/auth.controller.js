// src/controllers/auth.controller.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db');  // db YA ES pool.promise()
const bcrypt = require('bcryptjs');

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES = '2h';

/* ---------------------------------------------------
  REGISTRO DE USUARIO
--------------------------------------------------- */
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar datos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Verificar si el correo ya existe
    const [exists] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    return res.status(201).json({
      id: result.insertId,
      nombre,
      email,
      message: "Usuario registrado correctamente"
    });

  } catch (err) {
    console.error("Error en REGISTER:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/* ---------------------------------------------------
  LOGIN DE USUARIO
--------------------------------------------------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // Buscar usuario
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];

    // Validar contraseña
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Crear token JWT
    const payload = { id: user.id, email: user.email, nombre: user.nombre };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Error en LOGIN:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
