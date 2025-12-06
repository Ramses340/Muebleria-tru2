const detalleDao = require('../daos/detalleVenta.dao');
const db = require('../db');

exports.create = async (req, res, next) => {
  try {
    const { venta_id } = req.body; // optional
    const { producto_id, cantidad } = req.body;

    // Validar que el producto exista y obtener su precio
    const [prodRows] = await db.query('SELECT id, stock, precio FROM productos WHERE id = ?', [producto_id]);
    if (!prodRows || prodRows.length === 0) {
      return res.status(400).json({ message: `Producto con id=${producto_id} no existe` });
    }

    const producto = prodRows[0];
    if (typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    if (cantidad > producto.stock) {
      return res.status(400).json({ message: `Cantidad solicitada (${cantidad}) mayor al stock disponible (${producto.stock})` });
    }

    // Usar el precio actual del producto como precio_unitario
    const precio_unitario = Number(producto.precio);

    let assignedVentaId = venta_id;

    if (!assignedVentaId) {
      
      const usuario_id = req.user && req.user.id ? req.user.id : null;
      
      const cliente_id = req.body.cliente_id || 1;
      const [ventaRes] = await db.query('INSERT INTO ventas (usuario_id, cliente_id, total) VALUES (?, ?, ?)', [usuario_id, cliente_id, 0]);
      assignedVentaId = ventaRes.insertId;
    } else {
      // si se envía venta_id, validar que exista
      const [vrows] = await db.query('SELECT id FROM ventas WHERE id = ?', [assignedVentaId]);
      if (!vrows || vrows.length === 0) {
        return res.status(400).json({ message: `Venta con id=${assignedVentaId} no existe` });
      }
    }

    // Crear detalle asociado a assignedVentaId
    const newDetalle = await detalleDao.create({ venta_id: assignedVentaId, producto_id, cantidad, precio_unitario });

    

    res.status(201).json(newDetalle);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const detalles = await detalleDao.findAll();
    res.status(200).json(detalles);
  } catch (err) {
    next(err);
  }
};

exports.getByVenta = async (req, res, next) => {
  try {
    const venta_id = parseInt(req.params.venta_id, 10);
    const detalles = await detalleDao.findByVentaId(venta_id);
    res.status(200).json(detalles);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const detalle = await detalleDao.findById(id);
    if(!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });
    res.status(200).json(detalle);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const updated = await detalleDao.update(id, req.body);
    if(!updated) return res.status(404).json({ message: 'Detalle no encontrado' });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const ok = await detalleDao.delete(id);
    if(!ok) return res.status(404).json({ message: 'Detalle no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
