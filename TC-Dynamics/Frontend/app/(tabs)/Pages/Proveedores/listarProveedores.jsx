import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from '@/components/BackButton';
import styles, { gradients } from "../../../styles/proveedoresStyles";

// Ip de la configuración del Backend y el llamado a la base de datos.
const API_URL = "https://tcd-production.up.railway.app/api/proveedores";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [searchText, setSearchText] = useState("");
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

  // Función para filtrar proveedores
  const filteredProveedores = proveedores.filter(proveedor => {
    const searchLower = searchText.toLowerCase();
    return (
      proveedor.nombre_empresa?.toLowerCase().includes(searchLower) ||
      proveedor.nombre_representante?.toLowerCase().includes(searchLower) ||
      proveedor.apellido_representante?.toLowerCase().includes(searchLower) ||
      proveedor.correo_empresarial?.toLowerCase().includes(searchLower) ||
      proveedor.tipo_exportacion?.toLowerCase().includes(searchLower)
    );
  });

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
      <LinearGradient 
        colors={gradients.verdeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.container}>
          {/* Header con gradiente */}
          <View style={styles.header}>
            <LinearGradient colors={gradients.verdeGradient} style={styles.gradient}>
              <Text style={styles.titleText}>Lista de Proveedores</Text>
            </LinearGradient>
          </View>
          
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Proveedores/registrarProveedor', params: { from: 'proveedores' } }, "Cargando formulario...")}
          >
            <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Proveedor</Text>
          </TouchableOpacity>
          <Text style={{textAlign:'center', marginTop: 32, color: '#888'}}>No hay proveedores registrados.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <BackButton />
      <LinearGradient 
        colors={gradients.verdeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.container}>
          {/* Header con gradiente */}
          <View style={styles.header}>
            <LinearGradient colors={gradients.verdeGradient} style={styles.gradient}>
              <Text style={styles.titleText}>Lista de Proveedores</Text>
            </LinearGradient>
          </View>
          
          {/* Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar proveedores..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#888"
            />
          </View>
          
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => navigateWithLoading({ pathname: '/(tabs)/Pages/Proveedores/registrarProveedor', params: { from: 'proveedores' } }, "Cargando formulario...")}
          >
            <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Proveedor</Text>
          </TouchableOpacity>
        
        {filteredProveedores.length === 0 ? (
          <Text style={{textAlign:'center', marginTop: 32, color: '#888'}}>
            {searchText ? 'No se encontraron proveedores que coincidan con la búsqueda.' : 'No hay proveedores registrados.'}
          </Text>
        ) : (
          <FlatList
            data={filteredProveedores}
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
        )}
        </View>
      </LinearGradient>
    </>
  );
};

export default Proveedores;

