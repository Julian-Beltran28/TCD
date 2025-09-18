import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from '@/components/BackButton';
import styles, { colors } from "../../../styles/perfilStyles";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { navigateWithLoading } = useNavigationWithLoading();

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

          if (!storedUser) {
            setUser(null);
            setErrorMsg("No se encontró sesión activa");
            return;
          }

          const parsedUser = JSON.parse(storedUser);

          const res = await fetch(
            `http://192.168.80.19:8084/api/perfil/${parsedUser.id}`
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
    <>
      <BackButton />
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
          onPress={() => navigateWithLoading("/(tabs)/Pages/Perfil/editarPerfil", "Cargando editor...")}
          style={{ marginTop: 20 }}
        >
          <View style={styles.buttonEditar}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

export default Perfil;
