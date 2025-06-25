const express = require('express');
const router = express.Router();
const { crearVenta, listarVentas } = require('../controllers/ventas.controller');

router.post('/ventas', crearVenta);
router.get('/ventas', listarVentas);

module.exports = router;