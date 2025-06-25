const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'techcraft'
});
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});
module.exports = db;