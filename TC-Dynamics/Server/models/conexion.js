const mysql = require('mysql2/promise');

let pool;

if (process.env.MYSQL_URL) {
  // Railway entrega todo en una sola URL
  pool = mysql.createPool(process.env.MYSQL_URL);
} else {
  // Local usa las variables del .env
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
}

module.exports = pool;
