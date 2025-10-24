import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  Platform, 
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { MaterialIcons } from "@expo/vector-icons";
import { loginStyles } from "./styles/loginStyles";

const API_BASE = "https://tcd-production.up.railway.app";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña");
      return;
    }
    
    showLoading("Iniciando sesión...");
    
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Guardar usuario según plataforma
        if (Platform.OS === "web") {
          localStorage.setItem("user", JSON.stringify(data.usuario));
        } else {
          await AsyncStorage.setItem("user", JSON.stringify(data.usuario));
        }

        // Navegar con loading
        await replaceWithLoading("(tabs)/Pages/Perfil/perfil", "Cargando perfil...", 500);
      } else {
        Alert.alert("Error", data.mensaje || "Credenciales incorrectas");
        hideLoading();
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error", "No se pudo iniciar sesión");
      hideLoading()

  return (
    <View style={loginStyles.container}>
      {/*  Card del login */}
      <View style={loginStyles.loginCard}>
        <Text style={loginStyles.title}>Inicio de sesión</Text>
        
        {/*  Input de correo */}
        <View style={loginStyles.inputGroup}>
          <Text style={loginStyles.label}>Correo electrónico</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Correo electrónico:"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/*  Input de contraseña */}
        <View style={loginStyles.inputGroup}>
          <Text style={loginStyles.label}>Contraseña</Text>
          <View style={loginStyles.passwordContainer}>
            <TextInput
              style={[loginStyles.input, loginStyles.passwordInput]}
              placeholder="Contraseña:"
              placeholderTextColor="#999"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              style={loginStyles.eyeButton}
            >
              <MaterialIcons 
                name={showPassword ? "visibility-off" : "visibility"} 
                size={24} 
                color="#2E7D32" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/*  Botón de login */}
        <TouchableOpacity 
          style={loginStyles.loginButton} 
          onPress={handleLogin}
        >
          <Text style={loginStyles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/*  Logo TECHCRAFT DYNAMICS */}
      <View style={loginStyles.logoContainer}>
        
        
        {/* Logo temporal con ícono */}
        <View style={{ alignItems: 'center' }}>
          <MaterialIcons name="code" size={60} color="#A5D6A7" />
          <Text style={loginStyles.logoText}>TECHCRAFT DYNAMICS</Text>
        </View>
      </View>
    </View>
  );
};

export default Login;