// src/models/conexion.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config({ path: "./.env" });

const isProd = process.env.NODE_ENV === "production";

let pool;

if (isProd) {
  // Parseamos la MYSQL_URL para pasarla como objeto
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
  // Configuración local
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

export default pool;
