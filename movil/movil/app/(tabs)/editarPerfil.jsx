import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "../styles/editarPerfilStyles";

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  // 🔹 Cargar datos del usuario actual desde el backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        let storedUser;
        if (Platform.OS === "web") {
          storedUser = localStorage.getItem("user");
        } else {
          storedUser = await AsyncStorage.getItem("user");
        }

        if (!storedUser) {
          setErrorMsg("No se encontró sesión activa");
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        const res = await fetch(
          `http://10.134.206.192:8084/api/perfil/${parsedUser.id}`
        );

        let data;
        try {
          data = await res.json();
        } catch (_e) {
          const text = await res.text();
          console.error("Respuesta no JSON:", text);
          setErrorMsg("El servidor no devolvió JSON válido");
          return;
        }

        if (!res.ok) {
          setErrorMsg(data.error || "Error cargando perfil");
          return;
        }

        setUser(data);
        setErrorMsg(null);
      } catch (error) {
        console.error("Error cargando usuario:", error);
        setErrorMsg("Error de red o servidor no disponible");
      }
    };

    loadUser();
  }, []);

  // 🔹 Guardar cambios en el backend
  const handleSave = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `http://10.134.206.192:8084/api/perfil/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al guardar en backend:", data);
        setErrorMsg(data.error || "Error guardando cambios");
        return;
      }

      // 🔹 Actualizar AsyncStorage solo si el backend confirma
      const userString = JSON.stringify(user);
      if (Platform.OS === "web") {
        localStorage.setItem("user", userString);
      } else {
        await AsyncStorage.setItem("user", userString);
      }

      router.push("/perfil");
    } catch (error) {
      console.error("Error guardando usuario:", error);
      setErrorMsg("Error de red o servidor no disponible");
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Perfil</Text>

        {Object.entries(user).map(([key, value]) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.label}>{key}</Text>
            <TextInput
              style={styles.input}
              value={String(value || "")}
              onChangeText={(text) =>
                setUser((prev) => ({ ...prev, [key]: text }))
              }
            />
          </View>
        ))}

        <Button title="Guardar Cambios" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

export default EditarPerfil;
