import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const LoadingTestScreen = () => {
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const testSimpleLoading = () => {
    showLoading("Probando loading simple...");
    setTimeout(() => {
      hideLoading();
      Alert.alert("Test completado", "Loading simple funcionó correctamente");
    }, 2000);
  };

  const testNavigationLoading = () => {
    navigateWithLoading('/(tabs)/Pages/Usuarios/listarUsuarios', 'Navegando a usuarios...', 1000);
  };

  const testLongOperation = async () => {
    showLoading("Operación larga...");
    try {
      // Simular operación larga
      for (let i = 1; i <= 3; i++) {
        showLoading(`Paso ${i} de 3...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      Alert.alert("Éxito", "Operación completada");
    } finally {
      hideLoading();
    }
  };

  const testErrorHandling = async () => {
    showLoading("Probando manejo de errores...");
    try {
      await new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Test error")), 1500)
      );
    } catch (_error) {
      Alert.alert("Error manejado", "El loading se ocultó correctamente");
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Test del Sistema de Loading</Text>
      
      <TouchableOpacity style={styles.button} onPress={testSimpleLoading}>
        <Text style={styles.buttonText}>🔄 Test Loading Simple (2s)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testNavigationLoading}>
        <Text style={styles.buttonText}>🚀 Test Navegación con Loading</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testLongOperation}>
        <Text style={styles.buttonText}>⏳ Test Operación Larga</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testErrorHandling}>
        <Text style={styles.buttonText}>❌ Test Manejo de Errores</Text>
      </TouchableOpacity>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Si todos los tests funcionan correctamente, el sistema de loading está operativo.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2f95dc',
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default LoadingTestScreen;