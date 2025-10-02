import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import BackButton from "@/components/BackButton";
import { usuariosStyles } from "../../../styles/usuariosStyles"; 
import { MaterialIcons } from "@expo/vector-icons";

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Estado para el buscador
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  // 🌐 URL base del backend local
  const API_BASE = "http://192.168.40.8:8084"; // 👈 CAMBIA AQUÍ si tu IP es diferente

  // 📥 Cargar usuarios activos
  const fetchUsuarios = useCallback(async () => {
    showLoading("Cargando usuarios...");
    try {
      const response = await fetch(`${API_BASE}/api/usuarios`);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.warn("Respuesta inesperada del backend");
        Alert.alert("Error", "El servidor no devolvió JSON");
      }
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [fetchUsuarios])
  );

  // 🗑️ Eliminar usuario
  const eliminarUsuario = async (id) => {
    showLoading("Eliminando usuario...");
    try {
      const response = await fetch(`${API_BASE}/api/usuarios/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Alert.alert("✅ Éxito", "Usuario eliminado correctamente");
        fetchUsuarios();
      } else {
        Alert.alert("Error", "No se pudo eliminar el usuario");
      }
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    } finally {
      hideLoading();
    }
  };

  // 🔎 Filtrar usuarios según la búsqueda
  const usuariosFiltrados = usuarios.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.Primer_Nombre?.toLowerCase().includes(query) ||
      user.Primer_Apellido?.toLowerCase().includes(query) ||
      user.Correo_personal?.toLowerCase().includes(query) ||
      user.Correo_empresarial?.toLowerCase().includes(query) ||
      user.Numero_documento?.toString().includes(query)
    );
  });

  const renderItem = ({ item }) => (
    <View style={usuariosStyles.userCard}>
      <View style={usuariosStyles.userInfo}>
        <Text style={usuariosStyles.userName}>
          {item.Primer_Nombre} {item.Segundo_Nombre} {item.Primer_Apellido} {item.Segundo_Apellido}
        </Text>
        <Text style={usuariosStyles.userEmail}>📄 Documento: {item.Tipo_documento} {item.Numero_documento}</Text>
        <Text style={usuariosStyles.userEmail}>📧 Personal: {item.Correo_personal}</Text>
        <Text style={usuariosStyles.userEmail}>🏢 Empresarial: {item.Correo_empresarial}</Text>
        <Text style={usuariosStyles.userEmail}>📱 Celular: {item.Numero_celular}</Text>
        <Text style={usuariosStyles.userRole}>Rol: {item.id_Rol}</Text>
        <View style={usuariosStyles.statusBadge}>
          <Text style={usuariosStyles.statusText}>Activo ✅</Text>
        </View>
      </View>

      <View style={usuariosStyles.actions}>
        <TouchableOpacity
          style={[usuariosStyles.button, usuariosStyles.editButton]}
          onPress={() =>
            navigateWithLoading(
              { pathname: "/(tabs)/Pages/Usuarios/modificarUsuario", params: { id: item.id } },
              "Cargando editor..."
            )
          }
        >
          <MaterialIcons name="edit" size={20} color="#fff" /> 
          <Text style={usuariosStyles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[usuariosStyles.button, usuariosStyles.deleteButton]}
          onPress={() => eliminarUsuario(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="#fff" /> 
          <Text style={usuariosStyles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <BackButton />
      <View style={usuariosStyles.container}>
        <Text style={usuariosStyles.header}>Lista de Usuarios Activos </Text>

        {/* 🔍 Campo de búsqueda */}
        <TextInput
          style={usuariosStyles.searchInput}
          placeholder="🔍 Buscar por nombre"
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={usuariosStyles.newUserButton}
          onPress={() =>
            navigateWithLoading(
              "/(tabs)/Pages/Usuarios/registrarUsuario",
              "Cargando formulario..."
            )
          }
        >
          <Text style={usuariosStyles.newUserText}> Agregar Nuevo Usuario</Text>
        </TouchableOpacity>

        <FlatList
          data={[...usuariosFiltrados].sort((a, b) => b.id - a.id)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={<Text style={usuariosStyles.emptyText}>😕 No se encontraron usuarios</Text>}
        />
      </View>
    </>
  );
}
