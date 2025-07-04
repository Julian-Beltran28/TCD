const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ Nombre corregido del controlador
const proveedorController = require('../controllers/proveedores.controller');

// Configuración de almacenamiento para imágenes con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ Rutas para gestión de proveedores
router.get('/listar', proveedorController.ListarProveedores);
router.get('/:id', proveedorController.ObtenerProveedor);
router.post('/', upload.single('imagen_empresa'), proveedorController.CrearProveedor);
router.put('/:id', upload.single('imagen_empresa'), proveedorController.ActualizarProveedor);
router.put('/delete/:id', proveedorController.SoftDeleteProveedor);

// ✅ Rutas adicionales
router.get('/productos/:id', proveedorController.ListarProductosPorProveedor);
router.post('/comprar', proveedorController.ComprarProductos);

module.exports = router;
