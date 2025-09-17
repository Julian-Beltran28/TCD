import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import styles from "../../../styles/proveedoresStyles";


// Ip de la configuración del Backend y el llamado a la base de datos.

const API_URL = "http://192.168.20.31:8084/api/proveedores";


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
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Proveedores</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => router.push({ pathname: '/(tabs)/Pages/Proveedores/registrarProveedor', params: { from: 'proveedores' } })}
        >
          <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Proveedor</Text>
        </TouchableOpacity>
        <Text style={{textAlign:'center', marginTop: 32, color: '#888'}}>No hay proveedores registrados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Proveedores</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => router.push({ pathname: '/(tabs)/Pages/Proveedores/registrarProveedor', params: { from: 'proveedores' } })}
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
                onPress={() => router.push({ pathname: '/(tabs)/Pages/Proveedores/modificarProveedor', params: { id: item.id } })}
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

