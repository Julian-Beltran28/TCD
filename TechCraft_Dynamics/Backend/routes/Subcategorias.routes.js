const express = require('express');
const router = express.Router();
const subcategoriaCtrl = require('../controllers/Subcategorias.controller');
const multer = require('multer');

const upload = multer();

// Ruta para en listar las subcategorias existentes
router.get('/', subcategoriaCtrl.listarSubcategorias); 

// Ruta para crear una subcategoira nueva
router.post('/', upload.none(), subcategoriaCtrl.crearSubcategorias); 

// Ruta para obtener una unica subcategoria por su ID
router.get('/:id', subcategoriaCtrl.obtenerSubcategoriaPorId);

// Ruta para actualizar las subcategorias
router.put('/:id', upload.none(), subcategoriaCtrl.actualizarSubcategorias);

// Ruta para eliminar la subcategoria 
router.delete('/delete/:id', subcategoriaCtrl.eliminarSubcategorias); 

module.exports = router;