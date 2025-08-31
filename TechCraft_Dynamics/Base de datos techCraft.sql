-- =========================
-- 1. CREACIÓN DE BASE
-- =========================
DROP DATABASE IF EXISTS techCraft;
CREATE DATABASE techCraft;
USE techCraft;

-- =========================
-- 2. TABLAS BÁSICAS
-- =========================

-- Roles
CREATE TABLE Roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombreRol ENUM('Admin', 'Supervisor', 'Personal') NOT NULL
);

-- Usuarios
CREATE TABLE Usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Primer_Nombre VARCHAR(50) NOT NULL,
  Segundo_Nombre VARCHAR(50),
  Primer_Apellido VARCHAR(50) NOT NULL,
  Segundo_Apellido VARCHAR(50),
  Contrasena VARCHAR(255) NOT NULL,
  Tipo_documento VARCHAR(20),
  Numero_documento VARCHAR(100),
  Numero_celular VARCHAR(100),
  Correo_personal VARCHAR(100),
  Correo_empresarial VARCHAR(100),
  id_Rol INT,
  imagen VARCHAR(255),
  activo TINYINT DEFAULT 1,
  FOREIGN KEY (id_Rol) REFERENCES Roles(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías y Subcategorías
CREATE TABLE Categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Nombre_categoria VARCHAR(50) NOT NULL,
  Imagen_categoria VARCHAR(255),
  Descripcion VARCHAR(100),
  activo BOOLEAN DEFAULT 1
);

CREATE TABLE SubCategorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Nombre_Subcategoria VARCHAR(100) NOT NULL,
  Descripcion VARCHAR(100),
  activo BOOLEAN DEFAULT 1,
  id_Categorias INT,
  FOREIGN KEY (id_Categorias) REFERENCES Categorias(id)
);

-- Proveedores
CREATE TABLE Proveedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_empresa VARCHAR(100) NOT NULL,
  tipo_exportacion VARCHAR(50),
  nombre_representante VARCHAR(50) NOT NULL,
  apellido_representante VARCHAR(50) NOT NULL,
  numero_empresarial VARCHAR(20),
  correo_empresarial VARCHAR(100),
  imagen_empresa VARCHAR(255),
  activo TINYINT DEFAULT 1,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. TABLA DE PRODUCTOS
-- =========================

CREATE TABLE Productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Imagen_producto VARCHAR(255),
  Nombre_producto VARCHAR(100) NOT NULL,
  precio INT DEFAULT NULL,
  stock INT DEFAULT NULL,
  Kilogramos INT DEFAULT NULL,
  Precio_kilogramo INT DEFAULT NULL,
  Libras INT DEFAULT NULL,
  Precio_libras INT DEFAULT NULL,
  Codigo_de_barras VARCHAR(30),
  Descripcion TEXT,
  id_SubCategorias INT,
  id_Proveedor INT,
  tipo_producto ENUM('paquete','gramaje') NOT NULL,
  activo BOOLEAN DEFAULT 1,
  FOREIGN KEY (id_SubCategorias) REFERENCES SubCategorias(id),
  FOREIGN KEY (id_Proveedor) REFERENCES Proveedores(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. TABLAS DE MOVIMIENTOS
-- =========================

-- Tabla principal de la venta
CREATE TABLE Venta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metodo_pago VARCHAR(50) NOT NULL,
  info_pago JSON NULL,
  detalle TEXT NULL,
  activo BOOLEAN DEFAULT 1,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla detalle de productos por venta
CREATE TABLE Detalle_venta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  id_proveedor INT NULL,
  cantidad INT NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS ((cantidad * valor_unitario) - descuento) STORED,
  FOREIGN KEY (id_venta) REFERENCES Venta(id),
  FOREIGN KEY (id_producto) REFERENCES Productos(id),
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id)
);



-- Factura
CREATE TABLE Factura (
  numero_factura INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_venta INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
  FOREIGN KEY (id_venta) REFERENCES venta(id)
);