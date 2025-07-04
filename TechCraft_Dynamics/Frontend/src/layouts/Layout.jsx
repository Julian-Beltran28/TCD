// src/layouts/Layout.jsx
import { Outlet } from "react-router-dom";
import Proveedores from "../pages/Proveedores/Proveedores";
import ListarProveedores from "../components/Proveedores/ListarProveedores";

export default function Layout() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Panel Principal</h1>
      <ListarProveedores />
    </div>
  );
}
