// src/pages/Reportes/Reportes.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const Reportes = () => {
  const { navigateWithLoading, replaceWithLoading, goBackWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Reportes</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateWithLoading("/Pages/Reportes/ventas", 'Navegando...', 500)}
      >
        <Text style={styles.buttonText}>🛒 Ventas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateWithLoading("/Pages/Reportes/estadisticas", 'Navegando...', 500)}
      >
        <Text style={styles.buttonText}>📈 Estadísticas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateWithLoading("/Pages/Reportes/panelPrincipal", 'Navegando...', 500)}
      >
        <Text style={styles.buttonText}>🏠 Panel Principal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

export default Reportes;
