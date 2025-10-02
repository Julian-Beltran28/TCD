import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const API_URL = "https://tcd-production.up.railway.app/api/subcategorias";

export default function RegistrarSubcategoria() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const { replaceWithLoading } = useNavigationWithLoading();
  const categoriaId = params.categoriaId;

  const handleRegistrar = async () => {
    if (!nombre || !descripcion) {
      Alert.alert("Faltan datos", "Por favor, completa todos los campos.");
      return;
    }
    if (!categoriaId) {
      Alert.alert("Error", "No se encontró la categoría asociada. Intenta de nuevo desde la pantalla de categorías.");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre_Subcategoria: nombre, Descripcion: descripcion, id_Categorias: categoriaId }),
      });
      if (!response.ok) throw new Error();
      Alert.alert("¡Registro exitoso!", "La subcategoría fue registrada correctamente.");
      if (params.from === 'subcategorias') {
        replaceWithLoading('/(tabs)/Pages/Categorias/Sub-Categorias/listarSubcategorias', 'Redirigiendo...', 500);
      } else {
        replaceWithLoading('/(tabs)/Pages/Categorias/Sub-Categorias/listarSubcategorias', 'Redirigiendo...', 500);
      }
    } catch (_error) {
      Alert.alert("No se pudo registrar", "Ocurrió un problema al guardar la subcategoría. Por favor, revisa tu conexión o intenta más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Subcategoría</Text>
      {params.nombreCategoria && (
        <Text style={{ textAlign: 'center', color: '#2196F3', marginBottom: 8 }}>
          Categoría: {params.nombreCategoria}
        </Text>
      )}
      <TextInput style={styles.input} placeholder="Nombre de la subcategoría" placeholderTextColor="#999" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" placeholderTextColor="#999" value={descripcion} onChangeText={setDescripcion} />
      <Button title="Registrar" onPress={handleRegistrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
