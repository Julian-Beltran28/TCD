const mysql = require('mysql2/promise');

// Railway expone la conexión en variables de entorno
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'SAOanime37*',
  database: process.env.MYSQLDATABASE || 'techCraft',
  port: process.env.MYSQLPORT || 3306,
  ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: true } : false
});

module.exports = pool;
