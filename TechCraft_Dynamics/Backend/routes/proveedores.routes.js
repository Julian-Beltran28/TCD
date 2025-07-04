const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Importa el controlador con los nombres correctos
const proveedoresController = require('../controllers/proveedores.controller');

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
router.get('/listar', proveedoresController.ListarProveedores);
router.get('/:id', proveedoresController.ObtenerProveedor);
router.post('/', upload.single('imagen_empresa'), proveedoresController.CrearProveedor);
router.put('/:id', upload.single('imagen_empresa'), proveedoresController.ActualizarProveedor);
router.put('/delete/:id', proveedoresController.SoftDeleteProveedor);

// Rutas adicionales
router.get('/productos/:id', proveedoresController.ListarProductosPorProveedor);
router.post('/comprar', proveedoresController.ComprarProductos);

module.exports = router;