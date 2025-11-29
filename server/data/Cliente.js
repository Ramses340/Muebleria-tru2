const db = require('../db');

class Cliente {
    constructor(nombre, correo, telefono, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
    }

    async crear() {
        const [result] = await db.execute(
            'INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)',
            [this.nombre, this.correo, this.telefono]
        );
        this.id = result.insertId; 
        return result;
    }

    static async obtenerTodos() {
        const [rows] = await db.execute('SELECT * FROM clientes');
        return rows;
    }

    async editar(nombre, correo, telefono) {
        await db.execute(
            'UPDATE clientes SET nombre=?, correo=?, telefono=? WHERE id=?',
            [nombre, correo, telefono, this.id]
        );
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
    }

    async eliminar() {

        const [pedidos] = await db.execute('SELECT id FROM pedidos WHERE idCliente=?', [this.id]);
        for (const pedido of pedidos) {
            await db.execute('DELETE FROM pedidos_productos WHERE idPedido=?', [pedido.id]);
            await db.execute('DELETE FROM pedidos WHERE id=?', [pedido.id]);
        }
        // Borrar cliente
        await db.execute('DELETE FROM clientes WHERE id=?', [this.id]);
    }
}

module.exports = Cliente;
