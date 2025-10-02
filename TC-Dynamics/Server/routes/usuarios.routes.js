const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const usuariosSimpleController = require('../controllers/usuarios_simple.controller');

router.get('/', usuariosController.getUsuarios);
router.get('/listar', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.getUsuarioPorId);
router.post('/', usuariosSimpleController.crearUsuario); // USANDO CONTROLADOR SIMPLE
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/delete/:id', usuariosController.eliminarUsuario);
router.put('/cambiar-contrasena/:id', usuariosController.cambiarContrasena);


module.exports = router;
