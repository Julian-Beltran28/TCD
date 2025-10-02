import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  TouchableOpacity 
} from "react-native";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { useAuth } from "@/context/AuthContext";


const API_BASE = "https://tcd-production.up.railway.app";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();
  const { login, isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      replaceWithLoading("(tabs)/Pages/Perfil/perfil", "Accediendo...", 500);
    }
  }, [isAuthenticated, replaceWithLoading]);



  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña");
      return;
    }
    
    console.log('🔑 Iniciando proceso de login...');
    console.log('📧 Correo:', correo);
    console.log('🔐 Contraseña length:', contrasena.length);
    
    showLoading("Iniciando sesión...");
    
    try {
      console.log('🌐 Conectando a:', `${API_BASE}/api/login`);
      
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      console.log('📡 Status de respuesta:', response.status);
      const data = await response.json();
      console.log('📦 Datos recibidos:', data);

      if (response.ok && data.token) {
        console.log('✅ Login exitoso, guardando sesión...');
        // Usar el contexto de autenticación para guardar la sesión
        await login(data.usuario, contrasena);

        // Navegar con loading
        console.log('🚀 Navegando a perfil...');
        await replaceWithLoading("(tabs)/Pages/Perfil/perfil", "Cargando perfil...", 500);
      } else {
        console.log('❌ Error en login:', data.mensaje);
        Alert.alert("Error", data.mensaje || "Credenciales incorrectas");
        hideLoading();
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
      hideLoading();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {showPassword ? "🙈" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  toggleButton: {
    padding: 6,
  },
  toggleText: {
    fontSize: 18,
  },
});
