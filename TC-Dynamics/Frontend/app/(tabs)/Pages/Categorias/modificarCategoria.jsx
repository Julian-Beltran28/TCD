import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const API_URL = "https://tcd-production.up.railway.app/api/categorias";

export default function ModificarCategoria() {
  const { id } = useLocalSearchParams();
  const { replaceWithLoading, hideLoading } = useNavigationWithLoading();
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  // Imagen eliminada

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener categoría");
  const cat = await res.json();
  setNombre(cat.Nombre_categoria || cat.nombre || "");
  setDescripcion(cat.Descripcion || cat.descripcion || "");
  // Imagen eliminada
      } catch (_error) {
        Alert.alert("Error", "No se pudo cargar la categoría");
      } finally {
        hideLoading();
      }
    };
    if (id) fetchCategoria();
  }, [id, hideLoading]);

  // Imagen eliminada

  const handleModificar = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre_categoria: nombre, Descripcion: descripcion }),
      });
      if (!res.ok) throw new Error("Error al modificar categoría");
      Alert.alert("Éxito", "Categoría modificada");
      replaceWithLoading('/(tabs)/Pages/Categorias/listarCategorias', 'Redirigiendo...', 500);
    } catch (_error) {
      Alert.alert("Error", "No se pudo modificar la categoría");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Categoría</Text>
      <TextInput style={styles.input} placeholder="Nombre de la categoría" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
  {/* Imagen eliminada, solo campos de texto */}
      <Button title="Modificar" onPress={handleModificar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
