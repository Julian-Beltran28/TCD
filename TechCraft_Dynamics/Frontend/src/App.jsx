import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import SupervisorLayout from "./layouts/SupervisorLayout";
import StaffLayout from "./layouts/StaffLayout";
import Layout from "./layouts/Layout";

// Páginas principales
import Login from "./pages/Login";
import AdminPrincipal from "./pages/admin/AdminPrincipal";
import SupervisorPrincipal from "./pages/supervisor/SupervisorPrincipal";
import StaffPrincipal from "./pages/staff/StaffPrincipal";
import Categorias from "./components/Categorias/Categorias";
import ListarCategorias from "./components/Categorias/ListarCategorias";

// Subrutas admin
import Ventas from "./pages/admin/ventas/ventas";
import Compras from "./pages/admin/ventas/compras";
import CrearProveedor from "./components/Proveedores/CrearProveedor";
import ActualizarProveedor from "./components/Proveedores/ActualizarProveedor";
import ListarProveedores from "./components/Proveedores/ListarProveedores";

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
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas sin autenticación */}
          <Route path="/registrar" element={<CrearProveedor />} />
          <Route path="/actualizar/:id" element={<ActualizarProveedor />} />

          {/* Layout general (home) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<ListarProveedores />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="categorias/listado" element={<ListarCategorias />} />
          </Route>

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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}