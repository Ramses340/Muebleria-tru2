const express = require('express');
const cors = require('cors');

const detalleRoutes = require('./src/routes/detalleVenta.routes');
// nuevas routes
const authRoutes = require('./src/routes/auth.routes');
const productosRoutes = require('./src/routes/productos.routes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/detalleVenta', detalleRoutes);

// 404
app.use((req,res,next)=>{
  res.status(404).json({ message: 'Recurso no encontrado' });
});

// error handler
const errorHandler = require('./src/middlewares/error.middleware');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
