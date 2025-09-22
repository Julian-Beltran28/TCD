import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import BackButton from '@/components/BackButton';
import styles, { colors, gradients } from "../../../styles/editarPerfilStyles";

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [plainPassword, setPlainPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { navigateWithLoading } = useNavigationWithLoading();

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Error al seleccionar la imagen');
    }
  };

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
          `http://10.193.194.192:8084/api/perfil/${parsedUser.id}`
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

      // Si hay una imagen seleccionada, usar FormData
      if (selectedImage) {
        const formData = new FormData();
        
        // Agregar todos los campos del usuario
        Object.keys(updatedUserData).forEach(key => {
          if (updatedUserData[key] !== null && updatedUserData[key] !== undefined) {
            formData.append(key, updatedUserData[key]);
          }
        });

        // Agregar la imagen
        formData.append('imagen', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: `profile_${user.id}.jpg`,
        });

        const res = await fetch(
          `http://10.193.194.192:8084/api/perfil/${user.id}`,
          {
            method: "PUT",
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "Error guardando cambios");
          return;
        }
      } else {
        // Si no hay imagen, usar JSON como antes
        const res = await fetch(
          `http://10.193.194.192:8084/api/perfil/${user.id}`,
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

      Alert.alert("Éxito", "Perfil actualizado correctamente");
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
      <LinearGradient
        colors={gradients.verdeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.header}>
            <View style={styles.gradient}>
              <Text style={styles.titleText}>Editar Perfil</Text>
            </View>
          </View>

          <View style={styles.card}>
            {/* Imagen de perfil */}
            <View style={styles.profileImageContainer}>
              {selectedImage || user.imagen ? (
                <Image
                  source={{ 
                    uri: selectedImage || `http://10.193.194.192:8084/uploads/${user.imagen}` 
                  }}
                  style={styles.profileImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>Sin imagen</Text>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <Text style={styles.imagePickerButtonText}>
                  Cambiar imagen
                </Text>
              </TouchableOpacity>
            </View>

          {Object.entries(user).map(([key, value]) => {
            if (
              key.toLowerCase() === "password" ||
              key.toLowerCase() === "contrasena" ||
              key === "id" ||
              key === "imagen"
            )
              return null;

            // Caso especial para Tipo_documento - usar picker
            if (key === "Tipo_documento") {
              return (
                <View key={key} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tipo de Documento</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value || "C.C"}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setUser((prev) => ({ ...prev, [key]: itemValue }))
                      }
                    >
                      <Picker.Item label="Cédula de Ciudadanía" value="C.C" />
                      <Picker.Item label="Tarjeta de Identidad" value="T.I" />
                      <Picker.Item label="Cédula de Extranjería" value="C.E" />
                    </Picker>
                  </View>
                </View>
              );
            }

            // Para otros campos, usar TextInput normal
            return (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{key}</Text>
                <TextInput
                  style={styles.inputField}
                  value={String(value || "")}
                  onChangeText={(text) =>
                    setUser((prev) => ({ ...prev, [key]: text }))
                  }
                />
              </View>
            );
          })}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.inputField}
              value={plainPassword}
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
              placeholder="Ingrese nueva contraseña"
            />
            {passwordChanged && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.verdeClaro,
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
    </LinearGradient>
    </>
  );
};

export default EditarPerfil;
