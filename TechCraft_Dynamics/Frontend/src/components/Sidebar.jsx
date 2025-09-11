import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Sidebar.css';
import icono from '../assets/IconoTech.png';
import { useEffect, useState } from 'react';
import Axios from 'axios';

// ✅ Función para normalizar roles (igual que en App.jsx)
function normalizeRole(role) {
  const normalizedRole = role?.toLowerCase();
  // Mapear "personal" a "staff" para consistencia
  return normalizedRole === 'personal' ? 'staff' : normalizedRole;
}

export default function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();
  
  // ✅ Usar la función de normalización
  const normalizedUserRole = normalizeRole(user?.rol) || 'admin';
  const baseRoute = `/${normalizedUserRole}`;

  const [perfil, setPerfil] = useState(null);
  // URL base API
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  useEffect(() => {
    if (user?.id) {
      Axios.get(`${API_URL}/api/perfil/${user.id}`)
        .then(res => setPerfil(res.data))
        .catch(err => console.error("Error cargando perfil en Sidebar", err));
    }
  }, [user?.id]);

  const nombreCompleto = perfil
    ? `${perfil.Primer_Nombre || ''} ${perfil.Primer_Apellido || ''}`
    : 'Cargando...';

  const imagenPerfil = perfil?.imagen
    ? `${API_URL}/uploads/${perfil.imagen}`
    : "https://via.placeholder.com/150";

  const menuItems = [
    {
      label: 'Perfil',
      path: 'perfil',
      roles: ['admin', 'supervisor', 'staff'], // ✅ Simplificado - solo "staff"
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed">
          <path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z" />
        </svg>
      ),
    },
    {
      label: 'Ventas',
      path: 'ventas',
      roles: ['admin', 'supervisor', 'staff'], // ✅ Simplificado
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed">
          <path d="M856-390L570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
        </svg>
      ),
    },
    {
      label: 'Usuarios',
      path: 'usuarios',
      roles: ['admin', 'supervisor'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      label: 'Categorías',
      path: 'Categorias',
      roles: ['admin', 'supervisor'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed">
          <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
        </svg>
      ),
    },
    {
      label: 'Proveedores',
      path: 'proveedores',
      roles: ['admin', 'supervisor'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      label: 'Reportes',
      path: 'reportes',
      roles: ['admin','supervisor', 'staff'], // ✅ Simplificado
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed">
          <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-content">
        {/* Sección de perfil */}
        <div className="profile-section">
          <div className="circle-placeholder">
            <img
              src={imagenPerfil}
              alt="foto perfil"
              className="f-Perfil"
            />
          </div>
          <h6 className="mt-2">{user?.rol?.toUpperCase()}</h6>
          <h6 className="mt-1">{nombreCompleto}</h6>
        </div>

        {/* Navegación */}
        <ul className="nav flex-column mt-3">
          {menuItems
            .filter(item => item.roles.includes(normalizedUserRole)) // ✅ Usar rol normalizado
            .map((item, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={`${baseRoute}/${item.path}`}>
                  <div className="link-content">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            ))}

          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={logout}>
              <div className="link-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
                  <path d="M10 17l5-5-5-5v10zM4 4h2v16H4V4zm16 0h-6v2h6v12h-6v2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                </svg>
                <span>Cerrar sesión</span>
              </div>
            </Link>
          </li>
        </ul>

        {/* Branding */}
        <div className="branding mt-auto">
          <div className="logo-placeholder mt-3 mb-2">
            <img src={icono} alt="Logo TCD" className="L-tech" />
          </div>
          <p><strong>TECHCRAFT DYNAMICS</strong></p>
        </div>
      </div>
    </div>
  );
}