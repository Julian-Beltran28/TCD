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

// Obtener venta por ID
router.get("/:id", ventasCtrl.obtenerVentaPorId);

// Total de ventas por mes
router.get("/total-mes/:anio/:mes", ventasCtrl.ventasMes);

// Actualizar estado de venta
router.patch("/:id/estado", ventasCtrl.actualizarEstadoVenta);

// Eliminar una venta
router.delete("/:id", ventasCtrl.eliminarVenta);

// Eliminar todas las ventas
router.delete("/", ventasCtrl.eliminarGrupoVenta);

module.exports = router;
