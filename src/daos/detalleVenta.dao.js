const db = require('../db');

class DetalleVentaDAO {
  constructor() {
    this.table = 'detalle_venta';
  }

  async create({ producto_id, cantidad, precio_unitario }) {
    const conn = await db.getConnection();
    try {
      
      if (typeof arguments[0].venta_id !== 'undefined' && arguments[0].venta_id !== null) {
        const venta_id = arguments[0].venta_id;
        const [res] = await conn.query(
          `INSERT INTO ${this.table} (venta_id, producto_id, cantidad, precio_unitario)
           VALUES (?, ?, ?, ?)`,
          [venta_id, producto_id, cantidad, precio_unitario]
        );
        return { id: res.insertId, venta_id, producto_id, cantidad, precio_unitario };
      }

      const [res] = await conn.query(
        `INSERT INTO ${this.table} (producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?)`,
        [producto_id, cantidad, precio_unitario]
      );
      return { id: res.insertId, producto_id, cantidad, precio_unitario };
    } finally {
      conn.release();
    }
  }

  async findAll() {
    const [rows] = await db.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async findByVentaId(venta_id) {
    const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE venta_id = ?`, [venta_id]);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  // findByVentaId removed because detalle_venta no depende de ventas anymore

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
