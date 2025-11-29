const Producto = require('./data/Producto');
const Cliente = require('./data/Cliente');
const Pedido = require('./data/Pedido');
const db = require('./db');

async function main() {
    console.log('--- PRUEBAS DE Capa de Datos ---');

    // borra las tablas para empezar limpio
    await db.execute('DELETE FROM pedidos_productos');
    await db.execute('DELETE FROM pedidos');
    await db.execute('DELETE FROM productos');
    await db.execute('DELETE FROM clientes');
    console.log('Tablas eliminadas');

    // crea el productos
    const prod1 = new Producto('Silla', 500, 10);
    const prod2 = new Producto('Mesa', 1500, 5);
    await prod1.crear();
    await prod2.crear();
    console.log('Productos creados');

    // crea el cliente
    const cliente1 = new Cliente('Juan Pérez', 'juan@mail.com', '5551234567');
    await cliente1.crear();
    console.log('Cliente creado');

    // crea pedido con su propio id de los clientes
    const pedido1 = new Pedido(cliente1.id, [
        {idProducto: prod1.id, cantidad:2},
        {idProducto: prod2.id, cantidad:1}
    ], 2500);
    await pedido1.crear();
    console.log('Pedido creado');

    // lee los datos
    console.log('Productos:', await Producto.obtenerTodos());
    console.log('Clientes:', await Cliente.obtenerTodos());
    console.log('Pedidos:', JSON.stringify(await Pedido.obtenerTodos(), null, 2));

    // edita un producto y un cliente
    await prod1.editar('Silla Actualizada', 550, 8);
    await cliente1.editar('Juan Pérez Actualizado', 'juan2@mail.com', '5557654321');
    console.log('Producto y Cliente editados');

    console.log('Productos después de editar:', await Producto.obtenerTodos());
    console.log('Clientes después de editar:', await Cliente.obtenerTodos());

    // elimina un pedido y un producto
    await pedido1.eliminar();
    await prod2.eliminar();  
    console.log('Pedido y Producto eliminados');

    console.log('Productos finales:', await Producto.obtenerTodos());
    console.log('Pedidos finales:', JSON.stringify(await Pedido.obtenerTodos(), null, 2));
    console.log('Clientes finales:', await Cliente.obtenerTodos());
}

main().then(()=>console.log('Pruebas completadas')).catch(console.error);
