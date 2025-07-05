// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LayoutGeneral from "./layouts/LayoutGeneral";

// Páginas
import Login from "./pages/Login";
import AdminPrincipal from "./pages/admin/AdminPrincipal";
import SupervisorPrincipal from "./pages/supervisor/SupervisorPrincipal";
import StaffPrincipal from "./pages/staff/StaffPrincipal";
import Ventas from "./pages/admin/ventas/Ventas";
import Compras from "./pages/admin/ventas/Compras";
import ReportesAdmin from "./pages/admin/reportes/Reportes";
import ReportesSupervisor from "./pages/supervisor/Reportes";

// Proveedores y Categorías
import CrearProveedor from "./components/Proveedores/CrearProveedor";
import ActualizarProveedor from "./components/Proveedores/ActualizarProveedor";
import ListarProveedores from "./components/Proveedores/ListarProveedores";
import Categorias from "./components/Categorias/Categorias";
import ListarCategorias from "./components/Categorias/ListarCategorias";// Asegúrate de tener este archivo CSS para estilos

// Rutas protegidas
function RutasProtegidas({ rol, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.rol !== rol) return <Navigate to={`/${user.rol}`} />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rutas Admin */}
          <Route
            path="/admin/*"
            element={
              <RutasProtegidas rol="admin">
                <LayoutGeneral />
              </RutasProtegidas>
            }
          >
            <Route index element={<AdminPrincipal />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="compras" element={<Compras />} />
            <Route path="reportes" element={<ReportesAdmin />} />
          </Route>

          {/* Rutas Supervisor */}
          <Route
            path="/supervisor/*"
            element={
              <RutasProtegidas rol="supervisor">
                <LayoutGeneral />
              </RutasProtegidas>
            }
          >
            <Route index element={<SupervisorPrincipal />} />
            <Route path="reportes" element={<ReportesSupervisor />} />
          </Route>

          {/* Rutas Staff */}
          <Route
            path="/staff/*"
            element={
              <RutasProtegidas rol="staff">
                <LayoutGeneral />
              </RutasProtegidas>
            }
          >
            <Route index element={<StaffPrincipal />} />
            <Route path="perfil" element={<div>Perfil del Staff</div>} />
          </Route>

          {/* RUTAS DE PROVEEDORES Y CATEGORÍAS */}
          <Route path="/registrar" element={<CrearProveedor />} />
          <Route path="/actualizar/:id" element={<ActualizarProveedor />} />
          <Route path="/admin/proveedores" element={<ListarProveedores />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/listado" element={<ListarCategorias />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}