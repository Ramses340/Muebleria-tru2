require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

/* Middlewares esenciales */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Servir FRONTEND */
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

/* Rutas Backend */
app.use('/api/auth', authRoutes);

/* Página principal */
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

/* Iniciar servidor */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo correctamente → http://localhost:${PORT}`)
);
