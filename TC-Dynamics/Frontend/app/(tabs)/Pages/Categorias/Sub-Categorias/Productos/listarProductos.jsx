import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const API_URL = "https://tcd-production.up.railway.app/api/productos";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();
  const params = useLocalSearchParams();
  const subcategoriaId = params.subcategoriaId;

  const fetchProductos = useCallback(async () => {
    try {
      showLoading("Cargando...");
      const response = await fetch(`${API_URL}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      let lista = Array.isArray(data) ? data : data.productos || [];
      if (subcategoriaId) {
        lista = lista.filter((prod) => String(prod.id_SubCategorias) === String(subcategoriaId));
      }
      setProductos(lista);
    } catch (_error) {
      Alert.alert("No se pudo cargar la lista", "Ocurrió un problema al obtener los productos. Por favor, revisa tu conexión o intenta más tarde.");
    } finally {
      hideLoading();
    }
  }, [subcategoriaId, showLoading, hideLoading]);

  useFocusEffect(
    useCallback(() => {
      fetchProductos();
    }, [fetchProductos])
  );

  const eliminarProducto = async (id) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              showLoading("Cargando...");
              const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
              if (!response.ok) throw new Error();
              Alert.alert("Producto eliminado", "El producto se eliminó correctamente de la lista.");
              await fetchProductos();
            } catch (_error) {
              Alert.alert("No se pudo eliminar", "Ocurrió un problema al eliminar el producto. Intenta nuevamente más tarde.");
            } finally {
              hideLoading();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Productos</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Categorias/Sub-Categorias/Productos/registrarProducto', params: { from: 'productos', subcategoriaId } }, 'Navegando...', 500)}
      >
        <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Producto</Text>
      </TouchableOpacity>
      <FlatList
        data={productos}
        keyExtractor={(item) => (item.id || item.ID || item.Id || item.id_producto || Math.random()).toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.Nombre_producto || item.nombre || item.Nombre || 'Sin nombre'}</Text>
            {item.Descripcion || item.descripcion ? (
              <Text style={{ marginBottom: 4 }}>Descripción: {item.Descripcion || item.descripcion}</Text>
            ) : null}
            {item.Precio || item.precio ? (
              <Text style={{ marginBottom: 4 }}>Precio: ${item.Precio || item.precio}</Text>
            ) : null}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Categorias/Sub-Categorias/Productos/modificarProducto', params: { id: item.id || item.ID || item.Id || item.id_producto } }, 'Navegando...', 500)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarProducto(item.id || item.ID || item.Id || item.id_producto)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Productos;

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
