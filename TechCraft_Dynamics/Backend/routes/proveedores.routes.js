const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const proveedorController = require('../controllers/proveedor.controller');

router.get('/listar', proveedorController.listarProveedores);
router.get('/:id', proveedorController.obtenerProveedor);
router.post('/', upload.single('imagen_empresa'), proveedorController.crearProveedor);
router.put('/:id', upload.single('imagen_empresa'), proveedorController.actualizarProveedor);

module.exports = router;
