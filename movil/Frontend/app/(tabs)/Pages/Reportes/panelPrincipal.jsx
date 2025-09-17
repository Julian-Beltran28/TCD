import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PanelPrincipal = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🖥️ Panel Principal</Text>
      <Text style={styles.subtitle}>Aquí se gestionan las funciones principales.</Text>
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

export default PanelPrincipal;
