import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';
import { LinearGradient } from "expo-linear-gradient";
import BackButton from '@/components/BackButton';
import styles, { colors } from "../../../styles/editarPerfilStyles";

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [plainPassword, setPlainPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const { navigateWithLoading } = useNavigationWithLoading();

  useEffect(() => {
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
          setErrorMsg("No se encontró sesión activa");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setPlainPassword(storedPassword || "");

        const res = await fetch(
          `http://192.168.80.19:8084/api/perfil/${parsedUser.id}`
        );
        const data = await res.json();

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

  const handlePasswordChange = (text) => {
    setPlainPassword(text);
    setPasswordChanged(true);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const updatedUserData = { ...user };
      if (passwordChanged && plainPassword.trim() !== "") {
        updatedUserData.password = plainPassword;
      }

      const res = await fetch(
        `http://192.168.80.19:8084/api/perfil/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUserData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Error guardando cambios");
        return;
      }

      const userForStorage = { ...updatedUserData };
      delete userForStorage.password;

      const userString = JSON.stringify(userForStorage);
      if (Platform.OS === "web") {
        localStorage.setItem("user", userString);
        if (passwordChanged) localStorage.setItem("plainPassword", plainPassword);
      } else {
        await AsyncStorage.setItem("user", userString);
        if (passwordChanged) await AsyncStorage.setItem("plainPassword", plainPassword);
      }

      alert("Perfil actualizado correctamente");
      navigateWithLoading('/Pages/Perfil/perfil', 'Navegando...', 500);
    } catch (error) {
      console.error("Error guardando usuario:", error);
      setErrorMsg("Error de red o servidor no disponible");
    }
  };

  if (errorMsg) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.error}>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <LinearGradient
                colors={[colors.verdeClaro, colors.verdeMedio]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={styles.titleText}>Editar Perfil</Text>
              </LinearGradient>
            </View>

          {Object.entries(user).map(([key, value]) => {
            if (
              key.toLowerCase() === "password" ||
              key.toLowerCase() === "contrasena" ||
              key === "id"
            )
              return null;

            return (
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
            );
          })}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={plainPassword}
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
              placeholder="Ingrese nueva contraseña"
            />
            {passwordChanged && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.verdeMedio,
                  marginTop: 5,
                }}
              >
                La contraseña será actualizada
              </Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.buttonGuardar, { backgroundColor: "transparent" }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonTextGuardar}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonCancelar}
              onPress={() => navigateWithLoading('/Pages/Perfil/perfil', 'Navegando...', 500)}
            >
              <Text style={styles.buttonTextCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
};

export default EditarPerfil;
