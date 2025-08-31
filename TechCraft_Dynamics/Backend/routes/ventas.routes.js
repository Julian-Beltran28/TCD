const express = require("express");
const router = express.Router();
const ventasCtrl = require("../controllers/ventas.controller");

// Crear venta
router.post("/", ventasCtrl.crearVenta);

// Listar todas las ventas (sin filtro o con filtro por query)
router.get("/", ventasCtrl.listarVentas);

// Listar ventas activas (activo=1)
router.get("/activas", (req, res) => {
  req.query.activo = "1";
  ventasCtrl.listarVentas(req, res);
});

// Listar pedidos pendientes (activo=0)
router.get("/pendientes", (req, res) => {
  req.query.activo = "0";
  ventasCtrl.listarVentas(req, res);
});

// Eliminar una venta
router.delete("/:id", ventasCtrl.eliminarVenta);

// Eliminar todas las ventas
router.delete("/", ventasCtrl.eliminarGrupoVenta);

// Actualizar estado de venta
router.patch("/:id/estado", ventasCtrl.actualizarEstadoVenta);

router.get('/:id', ventasCtrl.obtenerVentaPorId);


module.exports = router;
