const detalleDao = require('../daos/detalleVenta.dao');

exports.create = async (req, res, next) => {
  try {
    const { venta_id, producto_id, cantidad, precio_unitario } = req.body;
    const newDetalle = await detalleDao.create({ venta_id, producto_id, cantidad, precio_unitario });
    res.status(201).json(newDetalle);
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
