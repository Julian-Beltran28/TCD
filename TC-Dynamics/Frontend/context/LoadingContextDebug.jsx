import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const LoadingContext = createContext();

// Proveedor del contexto
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');

  const showLoading = (text = 'Cargando...') => {
    console.log('🔄 Showing loading:', text); // Debug
    setLoadingText(text);
    setLoading(true);
  };

  const hideLoading = () => {
    console.log('✅ Hiding loading'); // Debug
    setLoading(false);
  };

  const value = {
    loading,
    loadingText,
    showLoading,
    hideLoading,
  };

  console.log('📱 LoadingContext state:', { loading, loadingText }); // Debug

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe ser usado dentro de un LoadingProvider');
  }
  return context;
};

export default LoadingContext;