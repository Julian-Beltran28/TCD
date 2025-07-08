// constante donde declaramos que "mysql" va ser el proipio "mysql2"
const mysql = require('mysql2')

// Creamos la conecion al mysql con la base de datos 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'techCraft'
});


// Control de errores en la conexion de base de datos.
db.connect((err) =>{
    if(err){
        console.error('Error de conexion a MYSQL: ', err); // Error por si falla la conexion.
    } else {
        console.log('Conectado a al base de datos MYSQL.'); // Mensaje exitoso con la conexion.
    }
})


// Exportacion 
module.exports = db;