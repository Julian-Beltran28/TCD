const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const usuariosController = require('../controllers/usuarios.controller');

// Listamos todos los usuarios
router.get('/', usuariosController.getUsuarios);
router.get('/listar', usuariosController.listarUsuarios);

// Buscamos al usuario por su ID
router.get('/:id', usuariosController.getUsuarioPorId);

// Creamos al usuario (multipart/form-data)
router.post('/', upload.none(), usuariosController.crearUsuario);

// Actualizamos al usuario
router.put('/:id', upload.none(), usuariosController.actualizarUsuario);

// Eliminamos al usuario
router.delete('/delete/:id', usuariosController.eliminarUsuario);

// Cambiamos la contraseña del usuario
router.put('/cambiar-contrasena/:id', usuariosController.cambiarContrasena);

module.exports = router;
