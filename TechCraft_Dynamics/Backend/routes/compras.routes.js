const express = require('express');
const router = express.Router();
const comprasCtrl = require('../controllers/compras.controller');

// GET - Listar todas las compras a proveedores
router.get('/', comprasCtrl.listarComprasProveedores);

// PUT - Actualizar una compra específica
router.put('/:id', comprasCtrl.actualizarCompraProveedor);

// DELETE - Eliminar una compra específica
router.delete('/:id', comprasCtrl.eliminarCompraProveedor);

module.exports = router;
