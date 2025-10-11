const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 Configurando base de datos local MySQL...\n');
  
  // Conexión sin especificar base de datos para crearla
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'SAOanime37*',
    multipleStatements: true
  });

  try {
    console.log('✅ Conectado a MySQL');
    
    // Leer archivo SQL
    const sqlPath = path.join(__dirname, '..', 'Base de datos techCraft.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Archivo SQL no encontrado en:', sqlPath);
      return;
    }
    
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    console.log('📄 Archivo SQL leído correctamente');
    
    // Ejecutar script SQL
    console.log('🔄 Ejecutando script de base de datos...');
    await connection.query(sqlScript);
    
    console.log('✅ Base de datos "techCraft" creada exitosamente');
    console.log('✅ Tablas creadas correctamente');
    console.log('✅ Datos iniciales insertados');
    
    // Verificar que la base de datos existe
    const [databases] = await connection.query('SHOW DATABASES LIKE "techCraft"');
    if (databases.length > 0) {
      console.log('✅ Verificación exitosa: Base de datos techCraft existe');
      
      // Cambiar a la base de datos y mostrar tablas
      await connection.query('USE techCraft');
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`📊 Tablas creadas (${tables.length}):`);
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }
    
    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('💡 Ahora puedes ejecutar: npm run dev');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Soluciones posibles:');
      console.log('   1. Verifica que MySQL esté corriendo');
      console.log('   2. Revisa las credenciales en el archivo .env');
      console.log('   3. Asegúrate que el puerto 3306 esté disponible');
    }
  } finally {
    await connection.end();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = setupDatabase;