import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Estadisticas = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Estadísticas</Text>
      <Text style={styles.subtitle}>Aquí se mostrarán los gráficos y métricas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#555" },
});

export default Estadisticas;
