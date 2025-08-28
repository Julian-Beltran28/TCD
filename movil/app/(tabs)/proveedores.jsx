import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

const API_URL = "http://192.168.80.14:8081/api/proveedores";


const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/listar`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProveedores(data.proveedores || []);
    } catch (_error) {
  Alert.alert("No se pudo cargar la lista", "Ocurrió un problema al obtener los proveedores. Por favor, revisa tu conexión o intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProveedores();
    }, [])
  );

  const eliminarProveedor = async (id) => {
    Alert.alert(
      "Eliminar proveedor",
      "¿Estás seguro de que deseas eliminar este proveedor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}/${id}/soft-delete`, { method: "PUT" });
              if (!response.ok) throw new Error();
          Alert.alert("Proveedor eliminado", "El proveedor se eliminó correctamente de la lista.");
              await fetchProveedores();
            } catch (_error) {
          Alert.alert("No se pudo eliminar", "Ocurrió un problema al eliminar el proveedor. Intenta nuevamente más tarde.");
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
        <Text>Cargando proveedores...</Text>
      </View>
    );
  }

  if (!proveedores.length) {
    return (
      <View style={styles.centered}>
        <Text>No hay proveedores registrados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Proveedores</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => router.push({ pathname: '/(tabs)/registrarProveedor', params: { from: 'proveedores' } })}
      >
        <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Proveedor</Text>
      </TouchableOpacity>
      <FlatList
        data={proveedores}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre_empresa}</Text>
            <Text>Representante: {item.nombre_representante} {item.apellido_representante}</Text>
            <Text>Correo: {item.correo_empresarial}</Text>
            <Text>Teléfono: {item.numero_empresarial}</Text>
            <Text>Tipo: {item.tipo_exportacion}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push({ pathname: '/(tabs)/modificarProveedor', params: { id: item.id } })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarProveedor(item.id)}
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

export default Proveedores;

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
