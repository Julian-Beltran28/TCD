const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const proveedorRoutes = require('./routes/proveedorRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas principales
app.use('/', proveedorRoutes);

app.get("/", (req, res) => {
  res.send("API de Proveedores funcionando correctamente");
});

app.listen(5000, () => {
  console.log('Servidor backend corriendo en http://localhost:5000');
});
