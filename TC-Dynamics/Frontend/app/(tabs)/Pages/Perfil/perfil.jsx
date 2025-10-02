import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { useAuth } from "@/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import BackButton from '@/components/BackButton';
import styles, { gradients } from "../../../styles/perfilStyles";

const Perfil = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  const { navigateWithLoading } = useNavigationWithLoading();
  const { user, logout, updateUser } = useAuth();

  const loadUser = useCallback(async () => {
        try {
          console.log('🔍 Cargando datos del usuario:', user);
          
          if (!user || !user.id) {
            console.log('❌ No hay usuario o ID en el contexto');
            setErrorMsg("No se encontró sesión activa");
            return;
          }

          console.log('📡 Consultando perfil para usuario ID:', user.id);
          const res = await fetch(
            `https://tcd-production.up.railway.app/api/perfil/${user.id}`
          );

          let data;
          try {
            data = await res.json();
            console.log('📦 Datos recibidos del servidor:', data);
          } catch (_e) {
            const text = await res.text();
            console.error("Respuesta no JSON del servidor:", text);
            setErrorMsg("El servidor no devolvió JSON válido");
            return;
          }

          if (!res.ok) {
            console.log('❌ Error del servidor:', data.error);
            setErrorMsg(data.error || "Error consultando perfil");
            return;
          }

          console.log('✅ Perfil cargado correctamente');
          // Inicializar campos editables con los datos del usuario
          setEditableUser({
            Primer_Nombre: user?.Primer_Nombre || user?.nombre || '',
            Segundo_Nombre: user?.Segundo_Nombre || '',
            Primer_Apellido: user?.Primer_Apellido || user?.apellido || '',
            Segundo_Apellido: user?.Segundo_Apellido || '',
            Tipo_documento: user?.Tipo_documento || '',
            Numero_documento: user?.Numero_documento || '',
            Numero_celular: user?.Numero_celular || '',
            Correo_personal: user?.Correo_personal || '',
            Correo_empresarial: user?.Correo_empresarial || user?.correo || user?.email || ''
          });
          setErrorMsg(null);
        } catch (error) {
          console.error("❌ Error cargando perfil:", error);
          setErrorMsg("Error de red o servidor no disponible");
        }
      }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigateWithLoading("/login", "Cerrando sesión...");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigateWithLoading("/login", "Cerrando sesión...");
    }
  };

  const handleInputChange = (field, value) => {
    setEditableUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      console.log('💾 Guardando cambios del perfil...');
      
      const response = await fetch(`https://tcd-production.up.railway.app/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableUser)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        await updateUser(updatedUser);
        Alert.alert('✅ Éxito', 'Perfil actualizado correctamente');
        console.log('✅ Perfil actualizado exitosamente');
      } else {
        const errorData = await response.json();
        Alert.alert('❌ Error', errorData.error || 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      Alert.alert('❌ Error', 'No se pudo conectar con el servidor');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
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
                    uri: `https://tcd-production.up.railway.app/uploads/${user.imagen}` 
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
              <Text style={styles.inputLabel}>Primer Nombre:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Primer_Nombre || ''}
                onChangeText={(value) => handleInputChange('Primer_Nombre', value)}
                placeholder="Primer nombre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Segundo Nombre:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Segundo_Nombre || ''}
                onChangeText={(value) => handleInputChange('Segundo_Nombre', value)}
                placeholder="Segundo nombre (opcional)"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Primer Apellido:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Primer_Apellido || ''}
                onChangeText={(value) => handleInputChange('Primer_Apellido', value)}
                placeholder="Primer apellido"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Segundo Apellido:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Segundo_Apellido || ''}
                onChangeText={(value) => handleInputChange('Segundo_Apellido', value)}
                placeholder="Segundo apellido (opcional)"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo de Documento:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Tipo_documento || ''}
                onChangeText={(value) => handleInputChange('Tipo_documento', value)}
                placeholder="C.C, T.I, PE, etc."
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Número de Documento:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Numero_documento || ''}
                onChangeText={(value) => handleInputChange('Numero_documento', value)}
                placeholder="Número de documento"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Celular:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Numero_celular || ''}
                onChangeText={(value) => handleInputChange('Numero_celular', value)}
                placeholder="Número de celular"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo personal:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Correo_personal || ''}
                onChangeText={(value) => handleInputChange('Correo_personal', value)}
                placeholder="correo@personal.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo empresarial:</Text>
              <TextInput
                style={styles.editableInput}
                value={editableUser.Correo_empresarial || ''}
                onChangeText={(value) => handleInputChange('Correo_empresarial', value)}
                placeholder="correo@empresa.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
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
              onPress={handleSaveChanges}
              style={{ marginTop: 15 }}
            >
              <View style={styles.buttonEditar}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
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
