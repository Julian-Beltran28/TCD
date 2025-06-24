const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const proveedorCtrl = require('../controllers/proveedorController');

// Configuración multer
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

// Rutas
router.post('/registrar', upload.single('imagen'), proveedorCtrl.registrarProveedor);
router.get('/proveedores', proveedorCtrl.listarProveedores);
router.get('/proveedores/:id', proveedorCtrl.obtenerProveedor);
router.put('/actualizar/:id', upload.single('imagen'), proveedorCtrl.actualizarProveedor);
router.delete('/delete/:id', proveedorCtrl.eliminarProveedor);

module.exports = router;
