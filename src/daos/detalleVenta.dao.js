const db = require('../db');

class DetalleVentaDAO {
  constructor() {
    this.table = 'detalle_venta';
  }

  async create({ venta_id, producto_id, cantidad, precio_unitario }) {
    const conn = await db.getConnection();
    try {
      const [res] = await conn.query(
        `INSERT INTO ${this.table} (venta_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [venta_id, producto_id, cantidad, precio_unitario]
      );
      return { id: res.insertId, venta_id, producto_id, cantidad, precio_unitario };
    } finally {
      conn.release();
    }
  }

  async findById(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async findByVentaId(venta_id) {
    const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE venta_id = ?`, [venta_id]);
    return rows;
  }

  async update(id, { cantidad, precio_unitario }) {
    const conn = await db.getConnection();
    try {
      await conn.query(
        `UPDATE ${this.table} SET cantidad = COALESCE(?, cantidad), precio_unitario = COALESCE(?, precio_unitario) WHERE id = ?`,
        [cantidad, precio_unitario, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  async delete(id) {
    const [res] = await db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new DetalleVentaDAO();
