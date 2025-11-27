// src/models/conexion.js
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const { URL } = require("url");

dotenv.config({ path: "./.env" });

const isProd = process.env.NODE_ENV === "production";

let pool;

if (isProd) {
  if (!process.env.MYSQL_URL) {
    throw new Error("No se encontró MYSQL_URL en el entorno de producción");
  }

  const dbUrl = new URL(process.env.MYSQL_URL);

  pool = mysql.createPool({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace("/", ""),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

module.exports = pool;
