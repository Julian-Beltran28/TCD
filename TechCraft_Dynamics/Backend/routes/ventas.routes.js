const express = require('express');
const router = express.Router();
const ventasCtrl = require('../controllers/ventas.controller');

// Rutas
router.post('/', ventasCtrl.crearVenta); 
router.get('/', ventasCtrl.listarVentas);
router.delete('/:id', ventasCtrl.eliminarVenta);
// Nueva ruta directa para eliminar por ID único
router.delete('/unidad/:id', ventasCtrl.eliminarVentaPorId);


module.exports = router;
