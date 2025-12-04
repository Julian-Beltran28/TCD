const express = require('express');
const router = express.Router();
const { loginUsuario } = require('../controllers/auth.controller');

router.post('/login', loginUsuario);

module.exports = router;

