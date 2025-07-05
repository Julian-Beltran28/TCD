// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
