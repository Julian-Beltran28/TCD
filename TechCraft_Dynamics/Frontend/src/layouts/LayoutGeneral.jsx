// src/layouts/LayoutGeneral.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Footer from "../components/Footer";

export default function LayoutGeneral() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="app-container d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Sidebar dinámico con toggle */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} userRole={user?.rol || "admin"} />

      {/* Botón hamburguesa */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "1rem",
          left: isOpen ? "260px" : "1rem",
          zIndex: 1000,
          transition: "left 0.3s ease",
          backgroundColor: "#298B4EFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "0.5rem 1rem",
        }}
      >
        ☰
      </button>

      {/* Contenido principal que se adapta */}
      <div
        className="main-content"
        style={{
          marginLeft: isOpen ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          padding: "4rem 2rem 2rem 2rem",
          flexGrow: 1,
          overflow: "visible",
        }}
      >
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
