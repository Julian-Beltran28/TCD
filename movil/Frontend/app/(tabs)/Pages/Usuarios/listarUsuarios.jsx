
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import styles from "../../../styles/indexStyles";

export default function Index() {
  const [usuarios, setUsuarios] = useState([]);
  const router = useRouter();

  // 🔹 Cargar usuarios activos
  const fetchUsuarios = async () => {
    try {
            const response = await fetch("http://192.168.80.19:8084/api/usuarios");
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        const text = await response.text();
        console.warn("Respuesta inesperada del backend:", text);
        Alert.alert("Error", "El servidor no devolvió JSON");
      }
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [])
  );

  // 🔹 Eliminar usuario (soft delete)
  const eliminarUsuario = async (id) => {
    try {
            const response = await fetch(`http://192.168.80.19:8084/api/usuarios/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Alert.alert("Éxito", "Usuario eliminado correctamente");
        fetchUsuarios();
      } else {
        Alert.alert("Error", "No se pudo eliminar el usuario");
      }
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>{item.Primer_Nombre} {item.Segundo_Nombre} {item.Primer_Apellido} {item.Segundo_Apellido}</Text>
      <Text style={styles.subText}>Documento: {item.Tipo_documento} {item.Numero_documento}</Text>
      <Text style={styles.subText}>Correo personal: {item.Correo_personal}</Text>
      <Text style={styles.subText}>Correo empresarial: {item.Correo_empresarial}</Text>
      <Text style={styles.subText}>Celular: {item.Numero_celular}</Text>
      <Text style={styles.subText}>Rol: {item.id_Rol}</Text>
      <Text style={{ color: "green" }}>Activo ✅</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push({ pathname: "/(tabs)/Pages/Usuarios/modificarUsuario", params: { id: item.id } })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => eliminarUsuario(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios Activos 👥</Text>

  <TouchableOpacity style={styles.toggleButton} onPress={() => router.push('/(tabs)/Pages/Usuarios/registrarUsuario')}>
        <Text style={styles.toggleButtonText}>➕ Agregar Nuevo Usuario</Text>
      </TouchableOpacity>

      <FlatList
        data={[...usuarios].sort((a, b) => b.id - a.id)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
