const express = require('express');
const router = express.Router();
const categoriasCtrl = require('../controllers/Categorias.controller'); 
const multer = require('multer');
const path = require('path');

console.log('Archivo de rutas Categorias cargado');

// Multer para poder guardar de buena forma las imagenes.
const storage = multer.diskStorage({
  destination: function(req, file, cb){
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
const upload = multer({ storage: storage });

// ruta para poder enlistar las categorias.
router.get('/', categoriasCtrl.listarCategorias); 

// ruta para poder crear las categorias y guardar las imagenes.
router.post('/', upload.single('imagen'), categoriasCtrl.crearCategorias); 

//Para traer por id las categorias
router.get('/:id', categoriasCtrl.obtenerCategoriaPorId);

// ruta que donde dependiendo del "id" va actualizar la categoria correspondiente.
router.put('/:id', upload.single('imagen'), categoriasCtrl.actualizarCategorias);

 // ruta que donde dependiendo del "id" va eliminar la categoria correspondiente.
router.delete('/delete/:id', categoriasCtrl.eliminarCategorias);


module.exports = router;