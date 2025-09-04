import React, { useState } from "react";
import { View, Text, Platform, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { styles } from "../styles/perfilStyles";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Recarga datos cada vez que el perfil sea visible
  useFocusEffect(
    useCallback(() => {
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
          console.error("Error cargando perfil:", error);
        }
      };
      loadUser();
    }, [])
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se encontró usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil</Text>
        {Object.entries(user).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            <Text style={styles.label}>{key}: </Text>
            {String(value)}
          </Text>
        ))}
      </View>

      <Button
        title="Editar Perfil"
        onPress={() => router.push("/editarPerfil")}
      />
    </View>
  );
};

export default Perfil;