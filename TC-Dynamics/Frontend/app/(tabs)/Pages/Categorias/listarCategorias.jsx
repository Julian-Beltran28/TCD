import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

const API_URL = "http://192.168.80.19:8084/api/categorias";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const fetchCategorias = useCallback(async () => {
    showLoading("Cargando categorías...");
    try {
  const response = await fetch(`${API_URL}/`);
      if (!response.ok) throw new Error();
      const data = await response.json();
  setCategorias(Array.isArray(data) ? data : data.categorias || []);
    } catch (_error) {
      Alert.alert("No se pudo cargar la lista", "Ocurrió un problema al obtener las categorías. Por favor, revisa tu conexión o intenta más tarde.");
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useFocusEffect(
    useCallback(() => {
      fetchCategorias();
    }, [fetchCategorias])
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
            showLoading("Eliminando categoría...");
            try {
              const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
              if (!response.ok) throw new Error();
              Alert.alert("Categoría eliminada", "La categoría se eliminó correctamente de la lista.");
              await fetchCategorias();
            } catch (_error) {
              Alert.alert("No se pudo eliminar", "Ocurrió un problema al eliminar la categoría. Intenta nuevamente más tarde.");
              hideLoading();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Categorías</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Categorias/registrarCategoria', params: { from: 'categorias' } }, "Cargando formulario...")}
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
                onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Categorias/modificarCategoria', params: { id: item.id || item.ID || item.Id || item.id_categoria } }, "Cargando editor...")}
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
                onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Categorias/Sub-Categorias/listarSubcategorias', params: { categoriaId: item.id || item.ID || item.Id || item.id_categoria, nombre: item.Nombre_categoria || item.nombre || item.Nombre } }, "Cargando subcategorías...")}
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
