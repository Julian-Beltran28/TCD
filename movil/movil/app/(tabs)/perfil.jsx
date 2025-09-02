import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});
