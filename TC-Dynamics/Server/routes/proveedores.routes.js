const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const proveedorController = require('../controllers/proveedores.controller');

// Configuración de almacenamiento de imágenes con multer
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

// ===================== RUTAS DE PROVEEDORES ===================== //
router.get('/listar', proveedorController.ListarProveedores);
router.get('/:id', proveedorController.ObtenerProveedor);
router.post('/', upload.single('imagen_empresa'), proveedorController.CrearProveedor);
router.put('/:id', upload.single('imagen_empresa'), proveedorController.ActualizarProveedor);
router.put('/:id/soft-delete', proveedorController.SoftDeleteProveedor); // <-- ESTA ES LA QUE FALLABA

// ===================== RUTAS ADICIONALES ===================== //
router.get('/productos/:id', proveedorController.ListarProductosPorProveedor);
router.post('/comprar', proveedorController.ComprarProductos);

module.exports = router;
