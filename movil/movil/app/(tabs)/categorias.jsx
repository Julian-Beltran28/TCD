import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

const API_URL = "http://10.174.105.192:8084/api/categorias";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
  const response = await fetch(`${API_URL}/`);
      if (!response.ok) throw new Error();
      const data = await response.json();
  setCategorias(Array.isArray(data) ? data : data.categorias || []);
    } catch (_error) {
      Alert.alert("No se pudo cargar la lista", "Ocurrió un problema al obtener las categorías. Por favor, revisa tu conexión o intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategorias();
    }, [])
  );


  // DeleteSoft de las categorias.

  const eliminarCategoria = async (id) => {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro de que deseas eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
              if (!response.ok) throw new Error();
              Alert.alert("Categoría eliminada", "La categoría se eliminó correctamente de la lista.");
              await fetchCategorias();
            } catch (_error) {
              Alert.alert("No se pudo eliminar", "Ocurrió un problema al eliminar la categoría. Intenta nuevamente más tarde.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };



  // Proceso de carga para las categorias.

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Categorías</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => router.push({ pathname: '/(tabs)/registrarCategoria', params: { from: 'categorias' } })}
      >
        <Text style={styles.toggleButtonText}>➕ Agregar Nueva Categoría</Text>
      </TouchableOpacity>
      <FlatList
        data={categorias}
        keyExtractor={(item) => (item.id || item.ID || item.Id || item.id_categoria || Math.random()).toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.Nombre_categoria || item.nombre || item.Nombre || 'Sin nombre'}</Text>
            {item.Descripcion || item.descripcion ? (
              <Text style={{ marginBottom: 4 }}>Descripción: {item.Descripcion || item.descripcion}</Text>
            ) : null}
            {/* Imagen eliminada, solo se muestran los demás datos */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push({ pathname: '/(tabs)/modificarCategoria', params: { id: item.id || item.ID || item.Id || item.id_categoria } })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarCategoria(item.id || item.ID || item.Id || item.id_categoria)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subButton}
                onPress={() => router.push({ pathname: '/(tabs)/subcategorias', params: { categoriaId: item.id || item.ID || item.Id || item.id_categoria, nombre: item.Nombre_categoria || item.nombre || item.Nombre } })}
              >
                <Text style={styles.buttonText}>Subcat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Categorias;


// Estilos.

const styles = StyleSheet.create({
  toggleButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6,
  },
  subButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
