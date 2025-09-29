import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';
import BackButton from '@/components/BackButton';

const Editar = () => {
  const { id } = useLocalSearchParams();
  const { replaceWithLoading, hideLoading } = useNavigationWithLoading();

  const [Primer_Nombre, setPrimer_Nombre] = useState("");
  const [Correo_personal, setCorreo_personal] = useState("");
  

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
          const res = await fetch(`http://192.168.20.31:8084/api/usuarios/${id}`);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const data = await res.json();
        setPrimer_Nombre(data.Primer_Nombre || "");
        setCorreo_personal(data.Correo_personal || "");
      } catch (_error) {
        Alert.alert("Error", "No se pudo cargar el usuario");
      } finally {
        hideLoading();
      }
    };
    if (id) fetchUsuario();
  }, [id, hideLoading]);

  // Guardar cambios
  const handleSubmit = async () => {
    try {
  const res = await fetch(`http://10.193.194.192:8084/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Primer_Nombre, Correo_personal }),
      });
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      Alert.alert("Éxito", "Usuario actualizado correctamente");
      replaceWithLoading('/(tabs)/Pages/Usuarios/listarUsuarios', 'Redirigiendo...', 500);
    } catch (_error) {
      Alert.alert("Error", "No se pudo actualizar el usuario");
    }
  };

  return (
    <>
      <BackButton />
      <View style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>
      <TextInput
        value={Primer_Nombre}
        onChangeText={setPrimer_Nombre}
        placeholder="Nombre"
        style={styles.input}
      />
      <TextInput
        value={Correo_personal}
        onChangeText={setCorreo_personal}
        placeholder="Correo"
        keyboardType="email-address"
        style={styles.input}
      />
      <Button title="Guardar cambios" onPress={handleSubmit} />
    </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
});

export default Editar;
