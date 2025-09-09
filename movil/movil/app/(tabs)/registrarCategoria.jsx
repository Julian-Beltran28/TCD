import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://10.174.105.192:8084/api/categorias";

export default function RegistrarCategoria() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  // Imagen eliminada
  const router = useRouter();

  useEffect(() => {
    setNombre("");
    setDescripcion("");
  // Imagen eliminada
  }, [params.from]);

  const handleRegistrar = async () => {
    if (!nombre || !descripcion) {
      Alert.alert("Faltan datos", "Por favor, completa todos los campos.");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre_categoria: nombre, Descripcion: descripcion }),
      });
      if (!response.ok) throw new Error();
      Alert.alert("¡Registro exitoso!", "La categoría fue registrada correctamente.");
      if (params.from === 'categorias') {
        router.replace({ pathname: '/(tabs)/categorias', params: { refresh: Date.now().toString() } });
      } else {
        router.replace('/(tabs)/categorias');
      }
    } catch (_error) {
      Alert.alert("No se pudo registrar", "Ocurrió un problema al guardar la categoría. Por favor, revisa tu conexión o intenta más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Categoría</Text>
      <TextInput style={styles.input} placeholder="Nombre de la categoría" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
  {/* Imagen eliminada, solo campos de texto */}
      <Button title="Registrar" onPress={handleRegistrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
