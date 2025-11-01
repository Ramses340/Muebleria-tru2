const db = require('../db');

class Pedido {
    constructor(idCliente, productos, total, id = null) {
        this.id = id;
        this.idCliente = idCliente;
        this.productos = productos; 
        this.total = total;
    }

    async crear() {
        const [result] = await db.execute(
            'INSERT INTO pedidos (idCliente, total) VALUES (?, ?)',
            [this.idCliente, this.total]
        );
        this.id = result.insertId;
        for (const p of this.productos) {
            await db.execute(
                'INSERT INTO pedidos_productos (idPedido, idProducto, cantidad) VALUES (?, ?, ?)',
                [this.id, p.idProducto, p.cantidad]
            );
        }
    }

    static async obtenerTodos() {
        const [pedidos] = await db.execute('SELECT * FROM pedidos');
        const resultado = [];
        for (const pedido of pedidos) {
            const [productos] = await db.execute('SELECT * FROM pedidos_productos WHERE idPedido=?', [pedido.id]);
            resultado.push({
                ...pedido,
                productos
            });
        }
        return resultado;
    }

    async eliminar() {
        await db.execute('DELETE FROM pedidos_productos WHERE idPedido=?', [this.id]);
        await db.execute('DELETE FROM pedidos WHERE id=?', [this.id]);
    }
}

module.exports = Pedido;
