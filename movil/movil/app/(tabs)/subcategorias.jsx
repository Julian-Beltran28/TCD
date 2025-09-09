import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
// Import duplicado eliminado

const API_URL = "http://10.174.105.192:8084/api/subcategorias";

const Subcategorias = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const router = useRouter();
  const categoriaId = params.categoriaId;

  const fetchSubcategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      // Filtrar por categoriaId si está presente
      let lista = Array.isArray(data) ? data : data.subcategorias || [];
      if (categoriaId) {
        lista = lista.filter((sub) => String(sub.id_Categorias) === String(categoriaId));
      }
      setSubcategorias(lista);
    } catch (_error) {
      Alert.alert("No se pudo cargar la lista", "Ocurrió un problema al obtener las subcategorías. Por favor, revisa tu conexión o intenta más tarde.");
    } finally {
      setLoading(false);
    }
  }, [categoriaId]);

  useFocusEffect(
    useCallback(() => {
      fetchSubcategorias();
    }, [fetchSubcategorias])
  );

  const eliminarSubcategoria = async (id) => {
    Alert.alert(
      "Eliminar subcategoría",
      "¿Estás seguro de que deseas eliminar esta subcategoría?",
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
              Alert.alert("Subcategoría eliminada", "La subcategoría se eliminó correctamente de la lista.");
              await fetchSubcategorias();
            } catch (_error) {
              Alert.alert("No se pudo eliminar", "Ocurrió un problema al eliminar la subcategoría. Intenta nuevamente más tarde.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Cargando subcategorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Subcategorías</Text>
      {params.nombre && (
        <Text style={{ textAlign: 'center', color: '#2196F3', marginBottom: 8 }}>
          Categoría: {params.nombre}
        </Text>
      )}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => router.push({ pathname: '/(tabs)/registrarSubcategoria', params: { from: 'subcategorias', categoriaId: params.categoriaId, nombreCategoria: params.nombre } })}
      >
        <Text style={styles.toggleButtonText}>➕ Agregar Nueva Subcategoría</Text>
      </TouchableOpacity>
      <FlatList
        data={subcategorias}
        keyExtractor={(item) => (item.id || item.ID || item.Id || item.id_subcategoria || Math.random()).toString()}
        renderItem={({ item }) => {
          console.log('Subcategoría item:', item);
          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.Nombre_Subcategoria || item.Nombre_subcategoria || item.nombre || item.Nombre || 'Sin nombre'}</Text>
              {item.Descripcion || item.descripcion ? (
                <Text style={{ marginBottom: 4 }}>Descripción: {item.Descripcion || item.descripcion}</Text>
              ) : null}
              {/* Imagen eliminada, solo se muestran los demás datos */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push({ pathname: '/(tabs)/modificarSubcategoria', params: { id: item.id || item.ID || item.Id || item.id_subcategoria } })}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => eliminarSubcategoria(item.id || item.ID || item.Id || item.id_subcategoria)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: '#2196F3', marginLeft: 6 }]}
                  onPress={() => router.push({ pathname: '/(tabs)/productos', params: { subcategoriaId: item.id || item.ID || item.Id || item.id_subcategoria, nombre: item.Nombre_Subcategoria || item.Nombre_subcategoria || item.nombre || item.Nombre } })}
                >
                  <Text style={styles.buttonText}>Ver Productos</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Subcategorias;

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
