import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import BackButton from '@/components/BackButton';
import styles from "../../../styles/proveedoresStyles";

// Ip de la configuración del Backend y el llamado a la base de datos.
const API_URL = "http://10.193.194.192:8084/api/proveedores";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const fetchProveedores = useCallback(async () => {
    showLoading("Cargando proveedores...");
    try {
      const response = await fetch(`${API_URL}/listar`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProveedores(data.proveedores || []);
    } catch (_error) {
      Alert.alert("No se pudo cargar la lista", "Ocurrió un problema al obtener los proveedores. Por favor, revisa tu conexión o intenta más tarde.");
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useFocusEffect(
    useCallback(() => {
      fetchProveedores();
    }, [fetchProveedores])
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
            showLoading("Eliminando proveedor...");
            try {
              const response = await fetch(`${API_URL}/${id}/soft-delete`, { method: "PUT" });
              if (!response.ok) throw new Error();
          Alert.alert("Proveedor eliminado", "El proveedor se eliminó correctamente de la lista.");
              await fetchProveedores();
            } catch (_error) {
          Alert.alert("No se pudo eliminar", "Ocurrió un problema al eliminar el proveedor. Intenta nuevamente más tarde.");
              hideLoading();
            }
          },
        },
      ]
    );
  };

  if (!proveedores.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Proveedores</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Proveedores/registrarProveedor', params: { from: 'proveedores' } }, "Cargando formulario...")}
        >
          <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Proveedor</Text>
        </TouchableOpacity>
        <Text style={{textAlign:'center', marginTop: 32, color: '#888'}}>No hay proveedores registrados.</Text>
      </View>
    );
  }

  return (
    <>
      <BackButton />
      <View style={styles.container}>
      <Text style={styles.title}>Lista de Proveedores</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Proveedores/registrarProveedor', params: { from: 'proveedores' } }, "Cargando formulario...")}
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
                onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Proveedores/modificarProveedor', params: { id: item.id } }, "Cargando editor...")}
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
    </>
  );
};

export default Proveedores;

