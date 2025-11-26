const express = require("express");
const router = express.Router();
const ventasCtrl = require("../controllers/ventas.controller");

// ==========================================
// 🚀 RUTAS SIN PARÁMETROS (deben ir primero)
// ==========================================

// Crear venta
router.post("/", ventasCtrl.crearVenta);

// Listar todas las ventas
router.get("/", ventasCtrl.listarVentas);

// Listar ventas activas (activo=1)
router.get("/activas", (req, res) => {
  req.query.activo = "1";
  ventasCtrl.listarVentas(req, res);
});

// Listar ventas pendientes (activo=0)
router.get("/pendientes", (req, res) => {
  req.query.activo = "0";
  ventasCtrl.listarVentas(req, res);
});

// Total de ventas por mes
router.get("/total-mes/:anio/:mes", ventasCtrl.ventasMes);

// Comparativa de ventas por producto en un mes
router.post("/comparativa-mes/:anio/:mes", ventasCtrl.comparativaMes);

// Eliminar todas las ventas (solo desarrollo)
router.delete("/", ventasCtrl.eliminarGrupoVenta);

// ==========================================
// 🚀 RUTAS CON PARÁMETROS (van al final)
// ==========================================

// Obtener venta por ID
router.get("/:id", ventasCtrl.obtenerVentaPorId);

// Actualizar estado de venta
router.patch("/:id/estado", ventasCtrl.actualizarEstadoVenta);

// Eliminar una venta
router.delete("/:id", ventasCtrl.eliminarVenta);

module.exports = router;
