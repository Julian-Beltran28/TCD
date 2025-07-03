// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import SupervisorLayout from "./layouts/SupervisorLayout";
import StaffLayout from "./layouts/StaffLayout";

// Páginas principales
import Login from "./pages/Login";
import AdminPrincipal from "./pages/admin/AdminPrincipal";
import SupervisorPrincipal from "./pages/supervisor/SupervisorPrincipal";
import StaffPrincipal from "./pages/staff/StaffPrincipal";

// Subrutas admin
import Ventas from "./pages/admin/ventas/ventas";
import Compras from "./pages/admin/ventas/compras";

// Subrutas supervisor
import Reportes from "./pages/supervisor/Reportes";

// ✅ Componente que espera mientras carga el usuario
function RutasProtegidas({ rol, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

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

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <RutasProtegidas rol="admin">
                <AdminLayout />
              </RutasProtegidas>
            }
          >
            <Route index element={<AdminPrincipal />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="compras" element={<Compras />} />
          </Route>

          {/* Supervisor */}
          <Route
            path="/supervisor/*"
            element={
              <RutasProtegidas rol="supervisor">
                <SupervisorLayout />
              </RutasProtegidas>
            }
          >
            <Route index element={<SupervisorPrincipal />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>

          {/* Staff */}
          <Route
            path="/staff/*"
            element={
              <RutasProtegidas rol="staff">
                <StaffLayout />
              </RutasProtegidas>
            }
          >
            <Route index element={<StaffPrincipal />} />
            <Route path="perfil" element={<div>Perfil del staff</div>} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
