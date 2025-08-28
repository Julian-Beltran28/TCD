
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

export default function Index() {
  const [usuarios, setUsuarios] = useState([]);
  const router = useRouter();

  // 🔹 Cargar usuarios activos
  const fetchUsuarios = async () => {
    try {
            const response = await fetch("http://192.168.80.14:8081/api/usuarios");
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
            const response = await fetch(`http://192.168.80.14:8081/api/usuarios/delete/${id}`, {
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
        {/* Botón Editar */}
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push({ pathname: "/editar", params: { id: item.id } })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        {/* Botón Eliminar */}
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

  <TouchableOpacity style={styles.toggleButton} onPress={() => router.push('/(tabs)/register')}>
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

const styles = StyleSheet.create({
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
  toggleButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});