import React, { useState, useCallback } from "react";
import { View, Text, Button, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import  styles  from "../styles/perfilStyles";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

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
            `http://10.134.206.192:8084/api/perfil/${parsedUser.id}`
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
        <Text style={styles.title}>Perfil</Text>

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
      </View>

      <Button
        title="Editar Perfil"
        onPress={() => router.push("/editarPerfil")}
      />
    </View>
  );
};

export default Perfil;
