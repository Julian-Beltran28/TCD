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
import CredentialsHelper from "@/components/CredentialsHelper";


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

  // Función para usar credenciales de prueba
  const handleSelectCredentials = (email, password) => {
    setCorreo(email);
    setContrasena(password);
    Alert.alert("Credenciales Cargadas", `Email: ${email}\nContraseña: ${password}\n\n¡Ahora puedes hacer clic en "Entrar"!`);
  };

  // Función para probar conectividad
  const testConnectivity = async () => {
    Alert.alert("Probando Conectividad", "Verificando conexión al servidor...");
    try {
      console.log('🌐 Probando conectividad a:', API_BASE);
      const response = await fetch(`${API_BASE}/api/usuarios`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('📡 Respuesta del servidor:', response.status);
      if (response.ok) {
        Alert.alert("✅ Conectividad OK", "El servidor está funcionando correctamente.");
      } else {
        Alert.alert("⚠️ Problema de Servidor", `Código de respuesta: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error de conectividad:', error);
      Alert.alert("❌ Sin Conexión", `No se pudo conectar al servidor.\n\nError: ${error.message}\n\nVerifica tu conexión a internet.`);
    }
  };

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
        console.log('📊 Status:', response.status);
        
        let errorMessage = "Credenciales incorrectas";
        if (data.mensaje) {
          errorMessage = data.mensaje;
        } else if (response.status === 404) {
          errorMessage = "Usuario no encontrado. Verifica tu correo.";
        } else if (response.status === 401) {
          errorMessage = "Contraseña incorrecta. Verifica tus credenciales.";
        }
        
        Alert.alert("Error de Autenticación", `${errorMessage}\n\nUsuarios de prueba:\n• admin@admin.com / admin123\n• super@admin.com / super123\n• staff@admin.com / staff123`);
        hideLoading();
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      Alert.alert("Error de Conexión", `No se pudo conectar al servidor.\n\nDetalles: ${error.message}\n\nVerifica tu conexión a internet.`);
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

      <CredentialsHelper onSelectCredentials={handleSelectCredentials} />

      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} />
      </View>
      
      <TouchableOpacity style={styles.testButton} onPress={testConnectivity}>
        <Text style={styles.testButtonText}>🌐 Probar Conexión al Servidor</Text>
      </TouchableOpacity>
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
  buttonContainer: {
    marginVertical: 10,
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
