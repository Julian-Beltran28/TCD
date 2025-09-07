const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/', authCtrl.loginUsuario);

module.exports = router;
