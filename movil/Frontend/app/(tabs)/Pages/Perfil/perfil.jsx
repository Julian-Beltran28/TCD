import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles, { colors } from "../../../styles/perfilStyles";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [plainPassword, setPlainPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          let storedUser;
          let storedPassword;

          if (Platform.OS === "web") {
            storedUser = localStorage.getItem("user");
            storedPassword = localStorage.getItem("plainPassword");
          } else {
            storedUser = await AsyncStorage.getItem("user");
            storedPassword = await AsyncStorage.getItem("plainPassword");
          }

          if (!storedUser) {
            setUser(null);
            setErrorMsg("No se encontró sesión activa");
            return;
          }

          setPlainPassword(storedPassword || "");

          const parsedUser = JSON.parse(storedUser);

          const res = await fetch(
            `http://192.168.20.31:8084/api/perfil/${parsedUser.id}`
          );

          let data;
          try {
            data = await res.json();
          } catch (_e) {
            const text = await res.text();
            console.error("Respuesta no JSON del servidor:", text);
            setErrorMsg("El servidor no devolvió JSON válido");
            setUser(null);
            return;
          }

          if (!res.ok) {
            setErrorMsg(data.error || "Error consultando perfil");
            setUser(null);
            return;
          }

          setUser(data);
          setErrorMsg(null);
        } catch (error) {
          console.error("Error cargando perfil:", error);
          setErrorMsg("Error de red o servidor no disponible");
          setUser(null);
        }
      };

      loadUser();
    }, [])
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          {errorMsg || "No se encontró usuario"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.verdeClaro, colors.verdeMedio]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.titleText}>Perfil del Usuario</Text>
          </LinearGradient>
        </View>

        <Text style={styles.text}>
          <Text style={styles.label}>Nombre: </Text>
          {user.Primer_Nombre} {user.Segundo_Nombre}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Apellidos: </Text>
          {user.Primer_Apellido} {user.Segundo_Apellido}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Documento: </Text>
          {user.Tipo_documento} {user.Numero_documento}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Celular: </Text>
          {user.Numero_celular}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Correo personal: </Text>
          {user.Correo_personal}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Correo empresarial: </Text>
          {user.Correo_empresarial}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Rol: </Text>
          {user.Rol}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Pages/Perfil/editarPerfil")}
          style={{ marginTop: 20 }}
        >
          <View style={styles.buttonEditar}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Perfil;
