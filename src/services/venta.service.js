const db = require('../db');

exports.createVentaWithDetalles = async ({ usuario_id, items }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [ventaResult] = await conn.query(
      `INSERT INTO ventas (usuario_id, total) VALUES (?, ?)`,
      [usuario_id, 0]
    );
    const ventaId = ventaResult.insertId;

    let total = 0;
    for(const item of items){
      const subtotal = item.cantidad * item.precio_unitario;
      total += subtotal;
      await conn.query(
        `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`,
        [ventaId, item.producto_id, item.cantidad, item.precio_unitario]
      );
      await conn.query(`UPDATE productos SET stock = stock - ? WHERE id = ?`, [item.cantidad, item.producto_id]);
    }

    await conn.query(`UPDATE ventas SET total = ? WHERE id = ?`, [total, ventaId]);
    await conn.commit();
    return { id: ventaId, total };
  } catch(err){
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
