const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Importa el controlador con los nombres correctos
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

// Rutas para gestión de proveedores
router.get('/listar', proveedorController.listarProveedores);
router.get('/:id', proveedorController.obtenerProveedor);
router.post('/', upload.single('imagen_empresa'), proveedorController.crearProveedor);
router.put('/:id', upload.single('imagen_empresa'), proveedorController.actualizarProveedor);
router.put('/delete/:id', proveedorController.softDeleteProveedor);

// Rutas adicionales
router.get('/productos/:id', proveedorController.listarProductosPorProveedor);
router.post('/comprar', proveedorController.comprarProductos);

module.exports = router;