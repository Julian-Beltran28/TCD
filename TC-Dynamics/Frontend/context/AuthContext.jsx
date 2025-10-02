import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AppState } from 'react-native';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar sesión existente
  const checkExistingSession = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Verificando sesión existente...');
      
      let storedUser = null;
      
      if (Platform.OS === 'web') {
        const userData = localStorage.getItem('user');
        storedUser = userData ? JSON.parse(userData) : null;
      } else {
        const userData = await AsyncStorage.getItem('user');
        storedUser = userData ? JSON.parse(userData) : null;
      }

      if (storedUser) {
        console.log('✅ Sesión encontrada:', storedUser.nombre || storedUser.email);
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        console.log('❌ No se encontró sesión activa');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (userData, plainPassword = null) => {
    try {
      console.log('🔑 Guardando sesión de usuario:', userData.nombre || userData.email);
      
      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify(userData));
        if (plainPassword) localStorage.setItem('plainPassword', plainPassword);
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        if (plainPassword) await AsyncStorage.setItem('plainPassword', plainPassword);
      }

      setUser(userData);
      setIsAuthenticated(true);
      console.log('✅ Sesión guardada exitosamente');
    } catch (error) {
      console.error('❌ Error guardando sesión:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async (silent = false) => {
    try {
      if (!silent) console.log('🚪 Cerrando sesión...');
      
      if (Platform.OS === 'web') {
        localStorage.removeItem('user');
        localStorage.removeItem('plainPassword');
      } else {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('plainPassword');
      }

      setUser(null);
      setIsAuthenticated(false);
      if (!silent) console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      if (!silent) console.error('❌ Error cerrando sesión:', error);
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = async (updatedUserData) => {
    try {
      console.log('🔄 Actualizando datos de usuario...');
      
      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
      }

      setUser(updatedUserData);
      console.log('✅ Datos de usuario actualizados');
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      throw error;
    }
  };

  // Verificar sesión existente al iniciar la app
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔄 Inicializando app - verificando sesión...');
      await checkExistingSession();
    };
    
    initializeApp();
  }, []);

  // Escuchar cambios de estado de la app para cerrar sesión solo al cerrar completamente
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log('📱 Estado de la app cambió a:', nextAppState);
      
      // Solo cerrar sesión cuando la app se cierra completamente (no cuando va a segundo plano)
      // En React Native, 'background' puede ser temporal (cambio de app, notificación, etc.)
      // Mantenemos la sesión activa hasta que se cierre completamente
      if (nextAppState === 'background') {
        console.log('� App en segundo plano - manteniendo sesión activa');
      } else if (nextAppState === 'active') {
        console.log('📱 App activa - verificando sesión');
        checkExistingSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else {
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkExistingSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;