import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles, { colors } from "../styles/editarPerfilStyles";

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [plainPassword, setPlainPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const router = useRouter();

  // Cargar datos del usuario
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

  // Manejar cambio de contraseña
  const handlePasswordChange = (text) => {
    setPlainPassword(text);
    setPasswordChanged(true);
  };

  // Guardar cambios en backend
  const handleSave = async () => {
    if (!user) return;

    try {
      // Crear objeto con los datos a actualizar
      const updatedUserData = { ...user };
      
      // Solo incluir la contraseña si ha sido modificada
      if (passwordChanged && plainPassword.trim() !== "") {
        updatedUserData.password = plainPassword;
      }

      // LOGS DE DEPURACIÓN
      console.log("=== DATOS A ENVIAR ===");
      console.log("passwordChanged:", passwordChanged);
      console.log("plainPassword:", plainPassword);
      console.log("updatedUserData:", updatedUserData);

      const res = await fetch(
        `http://192.168.80.19:8084/api/perfil/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al guardar:", data);
        setErrorMsg(data.error || "Error guardando cambios");
        return;
      }

      // Actualizar el almacenamiento local con los nuevos datos
      const userForStorage = { ...updatedUserData };
      delete userForStorage.password; // No almacenar la contraseña hasheada
      
      const userString = JSON.stringify(userForStorage);
      if (Platform.OS === "web") {
        localStorage.setItem("user", userString);
        if (passwordChanged) {
          localStorage.setItem("plainPassword", plainPassword);
        }
      } else {
        await AsyncStorage.setItem("user", userString);
        if (passwordChanged) {
          await AsyncStorage.setItem("plainPassword", plainPassword);
        }
      }

      // Mostrar mensaje de éxito
      alert("Perfil actualizado correctamente");
      
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

        {/* Campos del usuario */}
        {Object.entries(user).map(([key, value]) => {
          // Excluir campos que no deben mostrarse o editarse
          if (key.toLowerCase() === "password" || 
              key.toLowerCase() === "contrasena" || 
              key === "id") return null;

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

        {/* Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={plainPassword}
              secureTextEntry={!showPassword}
              onChangeText={handlePasswordChange}
              placeholder="Ingrese nueva contraseña"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                marginLeft: 10,
                padding: 10,
                backgroundColor: colors.verdeMedio,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </TouchableOpacity>
          </View>
          {passwordChanged && (
            <Text style={{ fontSize: 12, color: colors.verdeMedio, marginTop: 5 }}>
              La contraseña será actualizada
            </Text>
          )}
        </View>

        {/* Botones */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonGuardar} onPress={handleSave}>
            <Text style={styles.buttonTextGuardar}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonCancelar}
            onPress={() => router.push("/perfil")}
          >
            <Text style={styles.buttonTextCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditarPerfil;