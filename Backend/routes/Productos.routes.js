const express = require('express');
const router = express.Router();
const productoCtrl = require('../controllers/Productos.controller');
const multer = require('multer');

console.log('Archivo de rutas Categorias cargado');

// Multer para poder guardar de buena forma las imagenes.
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Rutas  para crear los productos de paquetes y gramajes.
router.post('/gramaje', upload.single('imagen'), productoCtrl.crearProductoGramaje);
router.post('/paquete', upload.single('imagen'), productoCtrl.crearProductoPaquetes);

// Rutas para enlistar los productos de paquetes y gramajes.
router.get('/gramaje', productoCtrl.listarProductosGramaje);
router.get('/paquete', productoCtrl.listarProductosPaquetes);

// Rutas para actualizar los productos de paquetes y gramaje.
router.put('/gramaje/:id', upload.single('imagen'), productoCtrl.actualizarProductosGramaje);
router.put('/paquete/:id', upload.single('imagen'), productoCtrl.actualizarProductosPaquetes);

// Rutas para eliminar los productos de paquetes y gramaje.
router.delete('/gramaje/:id', productoCtrl.eliminarProductosGramaje);
router.delete('/paquete/:id', productoCtrl.eliminarProductosPaquetes);

module.exports = router;