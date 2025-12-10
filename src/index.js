require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');
const errorHandler = require('./middlewares/error.middleware');

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
app.use('/api/productos', productosRoutes);
app.use('/api/detalleVenta', detalleVentaRoutes);

/* Página principal */
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

/* Rutas que redirigen a index.html para que el router maneje */
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/productos.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/ventas.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

/* 404 */
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

/* Error handler */
app.use(errorHandler);

/* Iniciar servidor */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo correctamente → http://localhost:${PORT}`)
);
