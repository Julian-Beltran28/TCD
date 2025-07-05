// src/models/conexion.js
const mysql = require('mysql2/promise'); 

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SAOanime37*',
  database: 'techCraft'
});

module.exports = db;
