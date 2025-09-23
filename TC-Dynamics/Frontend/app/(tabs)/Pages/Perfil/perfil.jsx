import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import BackButton from '@/components/BackButton';
import styles, { gradients } from "../../../styles/perfilStyles";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { navigateWithLoading } = useNavigationWithLoading();

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
            `http://10.193.194.192:8084/api/perfil/${parsedUser.id}`
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

  const handleLogout = () => {
    // Navegar a la pantalla de logout
    navigateWithLoading("/(tabs)/logout", "Cargando...");
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  if (!user) {
    return (
      <LinearGradient
        colors={gradients.verdeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.error}>
            {errorMsg || "No se encontró usuario"}
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <BackButton />
      <LinearGradient
        colors={gradients.verdeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.gradient}>
              <Text style={styles.titleText}>Perfil del Usuario</Text>
            </View>
          </View>

          <View style={styles.card}>
            {/* Imagen de perfil */}
            <View style={styles.profileImageContainer}>
              {user.imagen ? (
                <Image
                  source={{ 
                    uri: `http://10.193.194.192:8084/uploads/${user.imagen}` 
                  }}
                  style={styles.profileImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>Sin imagen</Text>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombres:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Primer_Nombre} {user.Segundo_Nombre}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellidos:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Primer_Apellido} {user.Segundo_Apellido}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Documento:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Tipo_documento} {user.Numero_documento}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Celular:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Numero_celular}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo personal:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Correo_personal}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo empresarial:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Correo_empresarial}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rol:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Rol}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigateWithLoading("/(tabs)/Pages/Perfil/editarPerfil", "Cargando editor...")}
              style={{ marginTop: 20 }}
            >
              <View style={styles.buttonEditar}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginTop: 15 }}
            >
              <View style={styles.buttonCerrarSesion}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default Perfil;
