const db = require('../db');

class Producto {
    constructor(nombre, precio, stock, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    async crear() {
        const [result] = await db.execute(
            'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
            [this.nombre, this.precio, this.stock]
        );
        this.id = result.insertId;
        return result;
    }

    static async obtenerTodos() {
        const [rows] = await db.execute('SELECT * FROM productos');
        return rows;
    }

    async editar(nombre, precio, stock) {
        await db.execute(
            'UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?',
            [nombre, precio, stock, this.id]
        );
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    async eliminar() {
        await db.execute('DELETE FROM pedidos_productos WHERE idProducto=?', [this.id]);
        await db.execute('DELETE FROM productos WHERE id=?', [this.id]);
    }
}

module.exports = Producto;
