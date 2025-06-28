const express = require('express');
const router = express.Router();
const ventasCtrl = require('../controllers/ventas.controller');

// Rutas
router.post('/', ventasCtrl.crearVenta); 
router.get('/', ventasCtrl.listarVentas);
router.delete('/:id', ventasCtrl.eliminarVenta);

module.exports = router;
