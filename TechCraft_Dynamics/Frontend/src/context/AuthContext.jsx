// src/context/AuthContext.jsx
// Importaciones necesarias
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Trae al Usuario
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  // ✅ Ahora recibe al usuario real
  const login = (usuario) => {
    setUser(usuario);
    localStorage.setItem("user", JSON.stringify(usuario));
  };

  // Cierra la sesión y no se puede regresar
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
