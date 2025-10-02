// src/routes/productos.routes.js
const express = require("express");
const router = express.Router();
const productoCtrl = require("../controllers/productos.controller");
const multer = require("multer");
const path = require("path");


// Configuración de Multer para imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
  // Obtener la extensión del archivo original
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Generar un nombre único SIN caracteres especiales
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  
  // Reemplazar cualquier carácter no alfanumérico en el nombre original (opcional, para mantener parte del nombre)
  const cleanName = path.basename(file.originalname, ext)
    .replace(/[^a-zA-Z0-9]/g, '_') // Reemplaza todo lo que no sea letra/número por guion bajo
    .substring(0, 50); // Limitar longitud

  // Nombre final: cleanName + uniqueSuffix + extensión
  const finalName = `${cleanName}_${uniqueSuffix}${ext}`;
  
  cb(null, finalName);
}
});
const upload = multer({ storage: storage });

/* =============================
   RUTAS DE PRODUCTOS
   ============================= */

// Crear producto (paquete o gramaje, según `tipo_producto` en body)
router.post("/", upload.single("imagen"), productoCtrl.crearProducto);

// Listar todos los productos
router.get("/", productoCtrl.listarProductos);
// Obtener un producto por id
router.get("/:id", productoCtrl.obtenerProducto);


// Actualizar producto
router.put("/:id", upload.single("imagen"), productoCtrl.actualizarProducto);

// Eliminar producto (soft delete)
router.delete("/:id", productoCtrl.eliminarProducto);

// Reportes
router.get("/reportes/mas-vendidos", productoCtrl.masVendidos);
router.get("/reportes/menos-vendidos", productoCtrl.menosVendidos);

router.get('/top-mes/:anio/:mes',productoCtrl.topProductosMes);


module.exports = router;
