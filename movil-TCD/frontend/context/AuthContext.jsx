// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const usuarioGuardado = await AsyncStorage.getItem('user');
        if (usuarioGuardado) {
          setUser(JSON.parse(usuarioGuardado));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  // ✅ Login con persistencia
  const login = async (usuario) => {
    try {
      setUser(usuario);
      await AsyncStorage.setItem('user', JSON.stringify(usuario));
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  // ✅ Logout limpiando datos
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token'); // Si guardas token por separado
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // ✅ Función extra para guardar token
  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error('Error al guardar token:', error);
    }
  };

  // ✅ Función para obtener token
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        loading, 
        saveToken, 
        getToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};