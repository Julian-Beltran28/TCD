-- Limpieza
DROP DATABASE IF EXISTS techCraft;
CREATE DATABASE techCraft;
USE techCraft;

-- Roles y Usuarios
CREATE TABLE Roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombreRol ENUM('Admin', 'Supervisor','Personal') NOT NULL
);

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
    FOREIGN KEY (id_Rol) REFERENCES Roles(id)
);

-- Categorías y Subcategorías
CREATE TABLE Categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Categoria VARCHAR(50),
    Imagen VARCHAR(255),      
    Descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE SubCategorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_Subcategoria VARCHAR(100),
    Descripcion VARCHAR(100) NOT NULL,
    Imagen VARCHAR(255),
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
    imagen_empresa VARCHAR(255) 
);

-- Productos (asociado a proveedor directamente)
CREATE TABLE Productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    imagen_producto VARCHAR(255),
    Nombre_productos VARCHAR(100) NOT NULL,
    precio INT NOT NULL DEFAULT 0,
    Descripcion TEXT,
    Codigo_de_barras VARCHAR(30),    
    stock INT DEFAULT 0,
    id_SubCategorias INT,
    id_Proveedor INT,
    FOREIGN KEY (id_SubCategorias) REFERENCES SubCategorias(id),
    FOREIGN KEY (id_Proveedor) REFERENCES Proveedores(id)
);

-- Compras a proveedor (detalle)
CREATE TABLE DetalleCompraProveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_proveedor INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS ((cantidad * precio_compra) - descuento) STORED,
    metodo_pago VARCHAR(50) NOT NULL,
    info_pago JSON,
    detalle_compra TEXT,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id),
    FOREIGN KEY (id_producto) REFERENCES Productos(id)
);


-- Ventas a clientes (detalle)
CREATE TABLE Ingreso_ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    Cantidad INT NOT NULL,
    Valor_Unitario DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    SubTotal DECIMAL(10,2) GENERATED ALWAYS AS ((Cantidad * Valor_Unitario) - Descuento) STORED,
    metodo_pago VARCHAR(50) NOT NULL,
    info_pago JSON NULL,
    Detalle_Venta TEXT, 
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES Productos(id)
);

-- Métodos de pago y pagos
CREATE TABLE Metodo_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    metodo ENUM('Efectivo', 'Billetera Virtual') NOT NULL
);

CREATE TABLE Pago (
    referencia_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    fecha_hora_pago DATETIME NOT NULL,
    monto_a_pagar DECIMAL(10,2) NOT NULL,
    id_metodo_pago INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_pago(id)
);

-- Factura final
CREATE TABLE Factura (
    numero_factura INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,            
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_venta INT NOT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id), 
    FOREIGN KEY (id_venta) REFERENCES Ingreso_ventas(id) 
);

