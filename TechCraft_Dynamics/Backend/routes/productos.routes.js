const express = require('express');
const router = express.Router();
const productosCtrl = require('../controllers/productos.controller');

router.get('/', productosCtrl.listarProductos);
router.post('/', productosCtrl.crearProducto);
router.put('/:id', productosCtrl.actualizarProducto);
router.delete('/:id', productosCtrl.eliminarProducto);

module.exports = router;
