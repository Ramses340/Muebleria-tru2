const db = require('../db');

exports.findAll = async () => {
  const [rows] = await db.query('SELECT id, nombre, precio, stock FROM productos');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT id, nombre, precio, stock FROM productos WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async ({ nombre, precio, stock }) => {
  const [result] = await db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio, stock]);
  return { id: result.insertId, nombre, precio, stock };
};

exports.update = async (id, { nombre, precio, stock }) => {
  // fetch existing
  const [rows] = await db.query('SELECT id FROM productos WHERE id = ?', [id]);
  if (!rows.length) return null;
  // update fields that are provided
  const current = (await db.query('SELECT nombre, precio, stock FROM productos WHERE id = ?', [id]))[0][0];
  const newNombre = nombre !== undefined ? nombre : current.nombre;
  const newPrecio = precio !== undefined ? precio : current.precio;
  const newStock = stock !== undefined ? stock : current.stock;
  await db.query('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [newNombre, newPrecio, newStock, id]);
  return { id, nombre: newNombre, precio: newPrecio, stock: newStock };
};

exports.delete = async (id) => {
  const [res] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
  return res.affectedRows > 0;
};
