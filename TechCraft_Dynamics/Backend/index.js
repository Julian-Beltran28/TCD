const express = require('express');
const cors = require('cors');
const ventasRoutes = require('./routes/ventas.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', ventasRoutes);

app.listen(3000, () => {
    console.log('Servidor backend en http://localhost:3000');
});