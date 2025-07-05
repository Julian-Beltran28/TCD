// perfil.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const perfilController = require('../controllers/perfil.controller');

// Configuración de almacenamiento para imágenes de perfil
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Obtener perfil de usuario por ID
router.get('/:id', perfilController.obtenerPerfil);

// Actualizar perfil de usuario (con imagen)
router.put('/:id', upload.single('imagen'), perfilController.actualizarPerfil);

module.exports = router;