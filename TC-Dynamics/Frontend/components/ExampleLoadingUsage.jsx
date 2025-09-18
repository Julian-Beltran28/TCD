// Ejemplo de cómo usar el sistema de loading en cualquier componente

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const ExampleComponent = () => {
  const { navigateWithLoading, goBackWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  // Ejemplo 1: Navegación simple con loading
  const handleNavigateToUsers = () => {
    navigateWithLoading('(tabs)/Pages/Usuarios/listarUsuarios', 'Cargando usuarios...');
  };

  // Ejemplo 2: Navegación con procesamiento de datos
  const handleNavigateWithDataProcessing = async () => {
    showLoading('Procesando datos...');
    
    try {
      // Simular una operación asíncrona (API call, procesamiento, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navegar después del procesamiento
      await navigateWithLoading('(tabs)/Pages/Perfil/perfil', 'Navegando al perfil...');
    } catch (error) {
      hideLoading();
      console.error('Error:', error);
    }
  };

  // Ejemplo 3: Regresar con loading
  const handleGoBack = () => {
    goBackWithLoading('Regresando...');
  };

  // Ejemplo 4: Loading manual para operaciones largas
  const handleLongOperation = async () => {
    showLoading('Realizando operación...');
    
    try {
      // Simular operación larga
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      hideLoading();
      alert('Operación completada!');
    } catch (_error) {
      hideLoading();
      alert('Error en la operación');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplos de Loading</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleNavigateToUsers}>
        <Text style={styles.buttonText}>Ir a Usuarios (con loading)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleNavigateWithDataProcessing}>
        <Text style={styles.buttonText}>Procesar y Navegar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Regresar (con loading)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleLongOperation}>
        <Text style={styles.buttonText}>Operación Larga</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ExampleComponent;