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
import { styles } from "../styles/editarPerfilStyles";

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Cargar datos del usuario actual
  useEffect(() => {
    const loadUser = async () => {
      try {
        let storedUser;
        if (Platform.OS === "web") {
          storedUser = localStorage.getItem("user");
        } else {
          storedUser = await AsyncStorage.getItem("user");
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };
    loadUser();
  }, []);

  // 🔹 Guardar cambios en storage
  const handleSave = async () => {
    try {
      const userString = JSON.stringify(user);
      if (Platform.OS === "web") {
        localStorage.setItem("user", userString);
      } else {
        await AsyncStorage.setItem("user", userString);
      }
      router.push("/perfil"); // 👈 vuelve al perfil
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

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