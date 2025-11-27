// src/models/conexion.js
require('dotenv').config({ path: './.env' });
const mysql = require('mysql2/promise');

const isProd = process.env.NODE_ENV === "production";

const pool = isProd
  ? mysql.createPool(process.env.MYSQL_URL) // usa Railway
  : mysql.createPool({                     // usa local
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

module.exports = pool;
