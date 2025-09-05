// src/routes/productos.routes.js
const express = require("express");
const router = express.Router();
const productoCtrl = require("../controllers/productos.controller");
const multer = require("multer");

// Configuración de Multer para imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
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


module.exports = router;
