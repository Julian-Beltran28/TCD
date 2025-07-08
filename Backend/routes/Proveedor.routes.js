const express = require('express');
const router = express.Router();

const { obtenerProveedores } = require('../controllers/Proveedor.controller');

// Ruta GET para obtener todos los proveedores
router.get('/', obtenerProveedores);

module.exports = router;