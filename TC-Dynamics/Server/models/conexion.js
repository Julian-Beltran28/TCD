const mysql = require('mysql2/promise');

let pool;

if (process.env.MYSQL_URL) {
  // Railway entrega todo en una sola URL
  pool = mysql.createPool(process.env.MYSQL_URL);
} else {
  // Local usa las variables del .env
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'SAOanime37*',
    database: process.env.DB_NAME || 'techCraft',
    port: process.env.DB_PORT || 3306,
  });
}

module.exports = pool;
