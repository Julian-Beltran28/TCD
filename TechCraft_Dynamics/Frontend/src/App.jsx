// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LayoutGeneral from "./layouts/LayoutGeneral";

// Páginas principales
import Login from "./pages/Login";
import AdminPrincipal from "./pages/admin/AdminPrincipal";
import SupervisorPrincipal from "./pages/supervisor/SupervisorPrincipal";
import StaffPrincipal from "./pages/staff/StaffPrincipal";

// Módulos del admin
import Ventas from "./pages/admin/ventas/Ventas";
import Compras from "./pages/admin/ventas/Compras";
import ReportesAdmin from "./pages/admin/reportes/Reportes";

// Módulos del supervisor
import ReportesSupervisor from "./pages/supervisor/Reportes";

// Proveedores compartidos
import Proveedores from "./pages/admin/Proveedores/Proveedores";
import ListarProveedores from "./components/Proveedores/ListarProveedores";
import CrearProveedor from "./components/Proveedores/CrearProveedor";
import ActualizarProveedor from "./components/Proveedores/ActualizarProveedor";


// Reportes
import Proyeccion from "./pages/admin/reportes/Proyeccion";
import VentasReportes from "./pages/admin/reportes/Ventas";

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
          {/* Ruta pública */}
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
            <Route path="proveedores" element={<Proveedores />} />

            <Route path="reportes/proyeccion" element={<Proyeccion />} />
            <Route path="reportes/ventas" element={<VentasReportes />} />

            <Route path="proveedores/registrar" element={<CrearProveedor />} />
            <Route path="proveedores/actualizar/:id" element={<ActualizarProveedor />} />
            <Route path="proveedores/listar" element={<ListarProveedores />} />
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
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="proveedores/registrar" element={<CrearProveedor />} />
            <Route path="proveedores/actualizar/:id" element={<ActualizarProveedor />} />
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
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="proveedores/registrar" element={<CrearProveedor />} />
            <Route path="proveedores/actualizar/:id" element={<ActualizarProveedor />} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}