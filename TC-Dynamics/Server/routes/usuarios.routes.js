const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.getUsuarios);
router.get('/listar', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.getUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/delete/:id', usuariosController.eliminarUsuario);
router.put('/cambiar-contrasena/:id', usuariosController.cambiarContrasena);


module.exports = router;
