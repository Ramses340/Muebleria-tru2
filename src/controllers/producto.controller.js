const productoDao = require('../daos/producto.dao');

exports.create = async (req, res, next) => {
  try {
    const { nombre, precio, stock } = req.body;
    const created = await productoDao.create({ nombre, precio, stock });
    res.status(201).json(created);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const rows = await productoDao.findAll();
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const p = await productoDao.findById(id);
    if(!p) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(p);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const payload = req.body;
    const updated = await productoDao.update(id, payload);
    if(!updated) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const ok = await productoDao.delete(id);
    if(!ok) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
};
