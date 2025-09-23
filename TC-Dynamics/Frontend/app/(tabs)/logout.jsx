import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

export default function LogoutScreen() {
  const { replaceWithLoading, goBackWithLoading } = useNavigationWithLoading();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión', 
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (Platform.OS === "web") {
                localStorage.removeItem("user");
                localStorage.removeItem("plainPassword");
              } else {
                await AsyncStorage.removeItem("user");
                await AsyncStorage.removeItem("plainPassword");
              }
              
              // Navegar al login
              replaceWithLoading("/login", "Cerrando sesión...");
            } catch (error) {
              console.error("Error cerrando sesión:", error);
              Alert.alert("Error", "No se pudo cerrar la sesión correctamente");
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    goBackWithLoading("Regresando...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Deseas cerrar sesión?</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
