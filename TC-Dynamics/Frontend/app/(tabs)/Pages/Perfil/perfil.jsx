import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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
  const { navigateWithLoading } = useNavigationWithLoading();
  const { user, isAuthenticated, logout } = useAuth();

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
          setErrorMsg(null);
        } catch (error) {
          console.error("❌ Error cargando perfil:", error);
          setErrorMsg("Error de red o servidor no disponible");
        }
      }, [user]);

  const handleLogout = () => {
    // Navegar a la pantalla de logout
    navigateWithLoading("/(tabs)/logout", "Cargando...");
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

          {/* Panel de depuración temporal */}
          <View style={{backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 5}}>
            <Text style={{fontSize: 12, color: '#666', fontWeight: 'bold'}}>🔍 Datos del usuario:</Text>
            <Text style={{fontSize: 10, color: '#888', fontFamily: 'monospace'}}>
              ID: {user?.id || 'N/A'}{'\n'}
              Nombre: {user?.Primer_Nombre || user?.nombre || 'N/A'}{'\n'}
              Email: {user?.Correo_empresarial || user?.correo || user?.email || 'N/A'}{'\n'}
              Autenticado: {isAuthenticated ? 'Sí' : 'No'}
            </Text>
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
              <Text style={styles.inputLabel}>Nombres:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Primer_Nombre || user.nombre || 'N/A'} {user.Segundo_Nombre || ''}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellidos:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Primer_Apellido || user.apellido || 'N/A'} {user.Segundo_Apellido || ''}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Documento:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Tipo_documento || 'N/A'} {user.Numero_documento || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Celular:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Numero_celular || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo personal:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Correo_personal || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo empresarial:</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputValue}>
                  {user.Correo_empresarial || user.correo || user.email || 'N/A'}
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
