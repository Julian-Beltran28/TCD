const express = require('express')
const router = express.Router()

router.get('/usuarios', (req, res) => {
  res.json({ mensaje: 'Ruta de usuarios funcionando' })
})

module.exports = router
