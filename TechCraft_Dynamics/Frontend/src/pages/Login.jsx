import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "../css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Usuarios simulados
  const usuariosSimulados = [
    { email: "admin@admin.com", password: "admin123", rol: "admin" },
    { email: "super@admin.com", password: "super123", rol: "supervisor" },
    { email: "staff@admin.com", password: "staff123", rol: "staff" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const usuarioEncontrado = usuariosSimulados.find(
        (u) => u.email === email && u.password === pass
      );

      if (!usuarioEncontrado) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "¡Uy!",
          text: "Correo o contraseña incorrectos",
          confirmButtonColor: "#3498db",
        });
        return;
      }

      login(usuarioEncontrado);
      navigate(`/${usuarioEncontrado.rol}`);
    }, 1500); // Simula una carga de 1.5 segundos
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Validando..." : "Iniciar sesión"}
        </button>

        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </form>
    </div>
  );
}
