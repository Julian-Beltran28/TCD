// src/models/conexion.js
require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('🔧 Configurando conexión a MySQL...');

// Configuración de conexión local con mejores opciones
const localConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'SAOanime37*',
  database: process.env.DB_NAME || 'techCraft',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Usamos la URL si existe (Railway), sino configuración local
const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool(localConfig);

// Función para probar la conexión
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexión a MySQL exitosa');
    return true;
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    console.log('📝 Verifica que:');
    console.log('   - MySQL esté corriendo');
    console.log('   - La base de datos "techCraft" exista');
    console.log('   - Las credenciales en .env sean correctas');
    return false;
  }
}

// Probar conexión al cargar el módulo
testConnection();

module.exports = pool;
