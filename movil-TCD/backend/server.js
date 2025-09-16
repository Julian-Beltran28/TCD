const express = require("express");
const cors = require("cors");
const path = require("path");

const ventasRoutes = require("./routes/ventas.routes");
// const comprasRoutes = require('./routes/compras.routes');
const productosRoutes = require("./routes/productos.routes");
const proveedoresRoutes = require("./routes/proveedores.routes");
const authRoutes = require("./routes/auth.routes");
const perfilRoutes = require("./routes/perfil.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const categoriasRoutes = require("./routes/Categorias.routes");
const subcategoriasRoutes = require("./routes/Subcategorias.routes");

const app = express();
const PORT = 3000; // puedes cambiarlo si quieres

app.use(cors());
app.use(express.json());

// ======================= RUTAS =======================
app.use("/api/ventas", ventasRoutes);
// app.use("/api/compras", comprasRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/login", authRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/subcategorias", subcategoriasRoutes);
app.use("/api/productos", productosRoutes);

// ======================= IMÁGENES =======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================= SERVIDOR =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🌐 Accede desde otro dispositivo: http://192.168.80.19:${PORT}`);
});
