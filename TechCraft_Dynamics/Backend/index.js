const express = require('express');
const cors = require('cors');

const ventasRoutes = require('./routes/ventas.routes');
const productosRoutes = require('./routes/productos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Montar rutas 
app.use('/api/ventas', ventasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);


app.listen(3000, () => {
    console.log('Servidor backend corriendo en http://localhost:3000');
});
