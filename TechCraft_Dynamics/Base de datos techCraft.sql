-- Limpieza base
DROP DATABASE IF EXISTS techCraft;
CREATE DATABASE techCraft;
USE techCraft;

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
  FOREIGN KEY (id_Rol) REFERENCES Roles(id)
);

-- Categorías y subcategorías
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
  activo TINYINT DEFAULT 1
);

-- Productos
CREATE TABLE ProductosPaquete (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Imagen_producto VARCHAR(255),
  Nombre_producto VARCHAR(100) NOT NULL,
  precio INT NOT NULL DEFAULT 0,
  Descripcion TEXT,
  Codigo_de_barras VARCHAR(30),
  stock INT DEFAULT 0,
  id_SubCategorias INT,
  id_Proveedor INT,
  tipo_producto ENUM('paquete') NOT NULL DEFAULT 'paquete',
  activo BOOLEAN DEFAULT 1,
  FOREIGN KEY (id_SubCategorias) REFERENCES SubCategorias(id),
  FOREIGN KEY (id_Proveedor) REFERENCES Proveedores(id)
);

CREATE TABLE ProductosGramaje (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Imagen_producto VARCHAR(255),
  Nombre_producto VARCHAR(100) NOT NULL,
  Kilogramos INT NOT NULL DEFAULT 0,
  Precio_kilogramo INT NOT NULL DEFAULT 0,
  Libras INT NOT NULL DEFAULT 0,
  Precio_libras INT NOT NULL DEFAULT 0,
  Descripcion TEXT,
  id_SubCategorias INT,
  id_ProductosPaquete INT,
  id_Proveedor INT,
  tipo_producto ENUM('gramaje') NOT NULL DEFAULT 'gramaje',
  activo BOOLEAN DEFAULT 1,
  FOREIGN KEY (id_SubCategorias) REFERENCES SubCategorias(id),
  FOREIGN KEY (id_ProductosPaquete) REFERENCES ProductosPaquete(id),
  FOREIGN KEY (id_Proveedor) REFERENCES Proveedores(id)
);

-- Compras a proveedor (detalle)
CREATE TABLE DetalleCompraProveedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_proveedor INT NOT NULL,
  id_ProductosPaquete INT NOT NULL,
  id_ProductosGramaje INT NULL,
  cantidad INT NOT NULL,
  precio_compra DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS ((cantidad * precio_compra) - descuento) STORED,
  metodo_pago VARCHAR(50) NOT NULL,
  info_pago JSON,
  detalle_compra TEXT,
  fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id),
  FOREIGN KEY (id_ProductosPaquete) REFERENCES ProductosPaquete(id),
  FOREIGN KEY (id_ProductosGramaje) REFERENCES ProductosGramaje(id)
);

-- Ingreso de ventas (clientes)
CREATE TABLE Ingreso_ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_ProductosPaquete INT NULL,
  id_ProductosGramaje INT NULL,
  Cantidad INT NOT NULL,
  Valor_Unitario DECIMAL(10,2) NOT NULL,
  Descuento DECIMAL(10,2) DEFAULT 0,
  SubTotal DECIMAL(10,2) GENERATED ALWAYS AS ((Cantidad * Valor_Unitario) - Descuento) STORED,
  metodo_pago VARCHAR(50) NOT NULL,
  info_pago JSON NULL,
  Detalle_Venta TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ProductosPaquete) REFERENCES ProductosPaquete(id),
  FOREIGN KEY (id_ProductosGramaje) REFERENCES ProductosGramaje(id)
);

-- Métodos de pago y pagos
CREATE TABLE Metodo_pago (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metodo ENUM('Efectivo', 'Billetera Virtual') NOT NULL
);

CREATE TABLE Pago (
  referencia_pago INT PRIMARY KEY AUTO_INCREMENT,
  id_ProductosPaquete INT NOT NULL,
  fecha_hora_pago DATETIME NOT NULL,
  monto_a_pagar DECIMAL(10,2) NOT NULL,
  id_metodo_pago INT NOT NULL,
  FOREIGN KEY (id_ProductosPaquete) REFERENCES ProductosPaquete(id),
  FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_pago(id)
);

-- Factura
CREATE TABLE Factura (
  numero_factura INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_venta INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
  FOREIGN KEY (id_venta) REFERENCES Ingreso_ventas(id)
);
