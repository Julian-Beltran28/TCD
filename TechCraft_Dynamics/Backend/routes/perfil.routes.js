// routes/perfil.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const perfilController = require('../controllers/perfil.controller');

// Configuración multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
  // Obtener la extensión del archivo original
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Generar un nombre único SIN caracteres especiales
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  
  // Reemplazar cualquier carácter no alfanumérico en el nombre original (opcional, para mantener parte del nombre)
  const cleanName = path.basename(file.originalname, ext)
    .replace(/[^a-zA-Z0-9]/g, '_') // Reemplaza todo lo que no sea letra/número por guion bajo
    .substring(0, 50); // Limitar longitud

  // Nombre final: cleanName + uniqueSuffix + extensión
  const finalName = `${cleanName}_${uniqueSuffix}${ext}`;
  
  cb(null, finalName);
}
});
const upload = multer({ storage });

// Ruta: GET perfil
router.get('/:id', perfilController.obtenerPerfil);

// Ruta: PUT perfil con imagen
router.put('/:id', upload.single('imagen'), perfilController.actualizarPerfil);

// Cambiar contraseña
router.put('/:id/password', perfilController.cambiarPassword);

module.exports = router;
