// src/models/conexion.js
const mysql = require('mysql2/promise'); 

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', // La idea es que siempre quede sin llenar para poder solo colocar la clave.
  database: 'techCraft'
});

module.exports = db;
