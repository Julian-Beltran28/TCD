const express = require('express');
const router = express.Router();
const proveedoresCtrl = require('../controllers/proveedores.controller');

// 🔹 Listar todos los proveedores
router.get('/', proveedoresCtrl.listarProveedores);
// 🔹 Listar productos de un proveedor específico
router.get('/productos/:id', proveedoresCtrl.listarProductosPorProveedor);
// 🔹 Registrar compra de productos (aumentar stock y guardar en historial)
router.post('/comprar', proveedoresCtrl.comprarProductos);

module.exports = router;
