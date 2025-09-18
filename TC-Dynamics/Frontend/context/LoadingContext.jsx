import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// Crear el contexto
const LoadingContext = createContext();

// Proveedor del contexto
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const isLoadingRef = useRef(false);
  const debounceRef = useRef(null);

  const showLoading = useCallback((text = 'Cargando...') => {
    // Evitar llamadas duplicadas
    if (isLoadingRef.current && loadingText === text) {
      return;
    }
    
    // Limpiar debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Solo log si cambia realmente
    if (!isLoadingRef.current) {
      console.log('🔄 Showing loading:', text);
    }
    setLoadingText(text);
    setLoading(true);
    isLoadingRef.current = true;
  }, [loadingText]);

  const hideLoading = useCallback(() => {
    // Evitar ocultar si ya está oculto
    if (!isLoadingRef.current) {
      return;
    }

    // Debounce para evitar hide/show rápidos
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (isLoadingRef.current) { // Solo log si realmente se oculta
        console.log('✅ Hiding loading');
      }
      setLoading(false);
      isLoadingRef.current = false;
    }, 100); // 100ms de delay
  }, []);

  // Método para forzar hide inmediato (para cleanup)
  const forceHideLoading = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setLoading(false);
    isLoadingRef.current = false;
    console.log('⚡ Force hiding loading'); // Debug
  }, []);

  // Cleanup al desmontar
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const value = {
    loading,
    loadingText,
    showLoading,
    hideLoading,
    forceHideLoading,
  };

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