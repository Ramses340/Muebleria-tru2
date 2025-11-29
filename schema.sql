
-- Solo copear y pegar este arvhivo en su gestor de base de datos MySQL para crear la base de datos y las tablas necesarias

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS muebleria
CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE muebleria;

-------------------------------------------------------
-- TABLA DE USUARIOS
-------------------------------------------------------
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-------------------------------------------------------
-- TABLA DE CLIENTES
-------------------------------------------------------
DROP TABLE IF EXISTS clientes;
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255)
);

-------------------------------------------------------
-- TABLA DE PRODUCTOS
-------------------------------------------------------
DROP TABLE IF EXISTS productos;
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL DEFAULT 0
);

-------------------------------------------------------
-- TABLA DE VENTAS
-------------------------------------------------------
DROP TABLE IF EXISTS ventas;
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-------------------------------------------------------
-- TABLA DETALLE DE VENTA
-------------------------------------------------------
DROP TABLE IF EXISTS detalle_venta;
CREATE TABLE detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-------------------------------------------------------
-- DATOS INICIALES (FUNCIONALES)
-------------------------------------------------------

-- Usuarios
INSERT INTO usuarios (nombre, email, password) VALUES
('Administrador', 'admin@muebleria.com', 'admin123'),
('Empleado 1', 'empleado1@muebleria.com', 'empleado123');

-- Clientes
INSERT INTO clientes (nombre, telefono, direccion) VALUES
('Juan Pérez', '6441234567', 'Av. Tecnológico 123'),
('María López', '6447654321', 'Calle Juárez 45'),
('Carlos Ruiz', '6449998888', 'Col. Centro #12');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Silla de Madera', 'Silla resistente hecha de pino natural', 950.00, 10),
('Mesa Redonda', 'Mesa de comedor para 4 personas', 2500.00, 5),
('Sofá 3 plazas', 'Sofá tapizado color gris', 4800.00, 3),
('Escritorio Moderno', 'Ideal para oficina o estudio', 1900.00, 7),
('Librero Compacto', 'Mueble de 5 niveles', 1200.00, 8);

-- Venta de ejemplo
INSERT INTO ventas (usuario_id, cliente_id, total) VALUES
(1, 1, 6900.00);

-- Detalle de venta
INSERT INTO detalle_venta (venta_id, producto_id, cantidad, subtotal) VALUES
(1, 1, 2, 1900.00),
(1, 2, 1, 2500.00);
