// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "../css/Login.css";
import axios from "axios";
import ToastNotification from "../components/ToastNotification";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados para el toast o alerta del inicio de sesión
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        correo: email,
        contrasena: pass,
      });

      const { token, usuario } = res.data;

      login(usuario);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      showToast("Inicio de sesión exitoso", "success");

      setTimeout(() => {
        navigate(`/${usuario.rol}`);
      }, 1000);
    } catch (err) {
      console.error(err);

      showToast(
        err.response?.data?.mensaje || "Error en el servidor",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Toast notificación */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div className="form-container">
          <div className="login-icon">
            <i className="bi bi-person-fill"></i>
          </div>
          <h1 className="text-center mb-3">Iniciar Sesión</h1>
          <p className="text-muted text-center mb-4">Bienvenido a TechCraft</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group-custom">
              <span className="input-icon">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control-custom"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group-custom">
              <span className="input-icon">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control-custom"
                placeholder="Contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-custom w-100" disabled={loading}>
              {loading ? "Validando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
