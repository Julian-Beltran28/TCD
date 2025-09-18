import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const API_URL = "http://192.168.80.19:8084/api/subcategorias";

export default function ModificarSubcategoria() {
  const { id } = useLocalSearchParams();
  const { replaceWithLoading, hideLoading } = useNavigationWithLoading();
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchSubcategoria = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Error al obtener subcategoría");
        const sub = await res.json();
        setNombre(sub.Nombre_subcategoria || sub.nombre || "");
        setDescripcion(sub.Descripcion || sub.descripcion || "");
      } catch (_error) {
        Alert.alert("Error", "No se pudo cargar la subcategoría");
      } finally {
        hideLoading();
      }
    };
    if (id) fetchSubcategoria();
  }, [id, hideLoading]);

  const handleModificar = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre_subcategoria: nombre, Descripcion: descripcion }),
      });
      if (!res.ok) throw new Error("Error al modificar subcategoría");
      Alert.alert("Éxito", "Subcategoría modificada");
      replaceWithLoading('/(tabs)/Pages/Categorias/Sub-Categorias/listarSubcategorias', 'Redirigiendo...', 500);
    } catch (_error) {
      Alert.alert("Error", "No se pudo modificar la subcategoría");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Subcategoría</Text>
      <TextInput style={styles.input} placeholder="Nombre de la subcategoría" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <Button title="Modificar" onPress={handleModificar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
