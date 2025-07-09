// src/models/conexion.js
const mysql = require('mysql2/promise'); 

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'techCraft'
});

module.exports = db;
