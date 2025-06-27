// app/db.js
import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1099544210',
  database: 'techCraft'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

export default connection;
