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
import Proveedores from "./pages/admin/Proveedores/Proveedores";

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
            <Route path="proveedores" element={<Proveedores />} />
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

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
