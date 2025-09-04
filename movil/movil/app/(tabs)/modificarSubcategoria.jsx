import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_URL = "http://10.134.206.192:8084/api/subcategorias";

export default function ModificarSubcategoria() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    };
    if (id) fetchSubcategoria();
  }, [id]);

  const handleModificar = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre_subcategoria: nombre, Descripcion: descripcion }),
      });
      if (!res.ok) throw new Error("Error al modificar subcategoría");
      Alert.alert("Éxito", "Subcategoría modificada");
      router.replace({ pathname: '/(tabs)/subcategorias', params: { refresh: Date.now().toString() } });
    } catch (_error) {
      Alert.alert("Error", "No se pudo modificar la subcategoría");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando subcategoría...</Text>
      </View>
    );
  }

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
