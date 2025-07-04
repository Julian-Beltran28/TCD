// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ nuevo estado

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
    setLoading(false); // ✅ terminamos de cargar
  }, []);

  const login = () => {
    const datosUsuario = {
      nombre: "Daniel Admin",
      correo: "admin@techcraft.com",
      rol: "admin",
    };
    setUser(datosUsuario);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
