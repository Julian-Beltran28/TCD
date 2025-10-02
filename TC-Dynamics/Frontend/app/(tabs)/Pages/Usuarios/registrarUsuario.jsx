import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import BackButton from '@/components/BackButton';
import { registrarUsuarioStyles } from "../../../styles/registrarUsuarioStyles";

const Register = () => {
  const [form, setForm] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Tipo_documento: "",
    Numero_documento: "",
    Numero_celular: "",
    Correo_personal: "",
    Correo_empresarial: "",
    id_Rol: "",
    Contrasena: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });
  const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const handleChange = (name, value) => {
    console.log(`🔄 Cambiando ${name}:`, value, 'Tipo:', typeof value);
    setForm({ ...form, [name]: value });
    
    // Actualizar validación de contraseña en tiempo real
    if (name === 'Contrasena') {
      setPasswordValidation({
        length: value.length >= 8,
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      });
    }
  };

  // Función para validar contraseña segura
  const validarContrasenaSegura = (password) => {
    if (!password || password.length < 8) {
      return {
        valida: false,
        mensaje: "La contraseña debe tener al menos 8 caracteres."
      };
    }

    const tieneMinuscula = /[a-z]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const criteriosFaltantes = [];
    if (!tieneMinuscula) criteriosFaltantes.push("una letra minúscula");
    if (!tieneMayuscula) criteriosFaltantes.push("una letra mayúscula");
    if (!tieneNumero) criteriosFaltantes.push("un número");
    if (!tieneEspecial) criteriosFaltantes.push("un carácter especial (!@#$%^&*)");

    if (criteriosFaltantes.length > 0) {
      return {
        valida: false,
        mensaje: `La contraseña debe incluir: ${criteriosFaltantes.join(", ")}.`
      };
    }

    return { valida: true, mensaje: "Contraseña válida" };
  };

  const handleSubmit = async () => {
    // Debug: Ver el estado del formulario
    console.log('🔍 Estado del formulario completo:', form);
    console.log('🔍 Contraseña específica:', form.Contrasena, 'Tipo:', typeof form.Contrasena);

    // Validación básica
    if (!form.Primer_Nombre || !form.Primer_Apellido || !form.Tipo_documento || !form.Numero_documento || !form.Numero_celular || !form.Correo_personal || !form.id_Rol || !form.Contrasena) {
      Alert.alert("❌ Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validar contraseña segura
    const validacionPassword = validarContrasenaSegura(form.Contrasena);
    if (!validacionPassword.valida) {
      Alert.alert("Error", validacionPassword.mensaje);
      return;
    }

    // Validar que id_Rol no esté vacío
    if (!form.id_Rol || form.id_Rol === "") {
      Alert.alert("Error", "Por favor, selecciona un rol.");
      return;
    }

    showLoading("Registrando usuario...");
    try {
      // Validar que la contraseña sea un string válido antes de encriptar
      const password = form.Contrasena;
      if (!password || typeof password !== 'string' || password.trim() === '') {
        console.error('❌ Contraseña inválida:', password, 'Tipo:', typeof password);
        Alert.alert("Error", "La contraseña no es válida. Por favor, ingresa una contraseña.");
        hideLoading();
        return;
      }

      // Limpiar y validar la contraseña
      const cleanPassword = password.trim();
      const validacionFinal = validarContrasenaSegura(cleanPassword);
      if (!validacionFinal.valida) {
        Alert.alert("Error", validacionFinal.mensaje);
        hideLoading();
        return;
      }

      // Preparar datos para enviar (el backend encriptará la contraseña)
      console.log('� Preparando datos para enviar al servidor...');
      
      const formData = {
        ...form,
        Contrasena: cleanPassword // Enviar contraseña limpia, el backend la encripta de forma segura
      };

      console.log('📤 Enviando datos al servidor:', {
        ...formData,
        Contrasena: '[HIDDEN]' // No mostrar la contraseña en logs
      });

      const response = await fetch("https://tcd-production.up.railway.app/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      console.log('📨 Respuesta del servidor - Status:', response.status);
      console.log('📨 Respuesta del servidor - OK:', response.ok);

      if (response.ok) {
        console.log('✅ Usuario registrado exitosamente');
        Alert.alert("✅ Éxito", "Usuario registrado correctamente");
        await replaceWithLoading("(tabs)/Pages/Usuarios/listarUsuarios", "Cargando lista...", 500);
      } else {
        console.log('❌ Error en el servidor, status:', response.status);
        let errorMessage = "No se pudo registrar el usuario";
        
        try {
          const data = await response.json();
          console.log('❌ Datos del error:', data);
          errorMessage = data.error || data.message || errorMessage;
        } catch (jsonError) {
          console.log('❌ No se pudo parsear la respuesta de error:', jsonError);
          const textResponse = await response.text();
          console.log('❌ Respuesta como texto:', textResponse);
          errorMessage = `Error del servidor (${response.status}): ${textResponse}`;
        }
        
        Alert.alert("Error", errorMessage);
        hideLoading();
      }
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Mensaje del error:', error.message);
      console.error('❌ Stack del error:', error.stack);
      Alert.alert("Error", `No se pudo conectar con el servidor: ${error.message}`);
      hideLoading();
    }
  };

  return (
    <>
      <BackButton />
      <ScrollView contentContainerStyle={registrarUsuarioStyles.container}>
        <Text style={registrarUsuarioStyles.title}>📝 Registrar Nuevo Usuario</Text>

        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Primer Nombre*" 
          placeholderTextColor="#999"
          value={form.Primer_Nombre} 
          onChangeText={v => handleChange("Primer_Nombre", v)} 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Segundo Nombre" 
          placeholderTextColor="#999"
          value={form.Segundo_Nombre} 
          onChangeText={v => handleChange("Segundo_Nombre", v)} 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Primer Apellido*" 
          placeholderTextColor="#999"
          value={form.Primer_Apellido} 
          onChangeText={v => handleChange("Primer_Apellido", v)} 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Segundo Apellido" 
          placeholderTextColor="#999"
          value={form.Segundo_Apellido} 
          onChangeText={v => handleChange("Segundo_Apellido", v)} 
        />

        <Text style={registrarUsuarioStyles.label}>📄 Tipo de Documento*</Text>
        <View style={registrarUsuarioStyles.pickerContainer}>
          <Picker selectedValue={form.Tipo_documento} onValueChange={v => handleChange("Tipo_documento", v)}>
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="C.C" value="C.C" />
            <Picker.Item label="T.I" value="T.I" />
            <Picker.Item label="P.E" value="P.E" />
          </Picker>
        </View>

        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Número de Documento*" 
          placeholderTextColor="#999"
          value={form.Numero_documento} 
          onChangeText={v => handleChange("Numero_documento", v)} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Número de Celular*" 
          placeholderTextColor="#999"
          value={form.Numero_celular} 
          onChangeText={v => handleChange("Numero_celular", v)} 
          keyboardType="phone-pad" 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Correo Personal*" 
          placeholderTextColor="#999"
          value={form.Correo_personal} 
          onChangeText={v => handleChange("Correo_personal", v)} 
          keyboardType="email-address" 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Correo Empresarial" 
          placeholderTextColor="#999"
          value={form.Correo_empresarial} 
          onChangeText={v => handleChange("Correo_empresarial", v)} 
          keyboardType="email-address" 
        />
        
        {/* Campo de contraseña con estilos mejorados */}
        <Text style={registrarUsuarioStyles.label}>🔐 Contraseña*</Text>
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Contraseña segura (8+ caracteres)" 
            value={form.Contrasena} 
            onChangeText={v => handleChange("Contrasena", v)} 
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
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
        <Text style={styles.helpText}>
          * Requisitos de contraseña segura:
        </Text>
        
        {/* Indicadores de validación de contraseña */}
        <View style={styles.validationContainer}>
          <Text style={[styles.validationItem, passwordValidation.length && styles.validationValid]}>
            {passwordValidation.length ? "✅" : "❌"} Mínimo 8 caracteres
          </Text>
          <Text style={[styles.validationItem, passwordValidation.lowercase && styles.validationValid]}>
            {passwordValidation.lowercase ? "✅" : "❌"} Una letra minúscula (a-z)
          </Text>
          <Text style={[styles.validationItem, passwordValidation.uppercase && styles.validationValid]}>
            {passwordValidation.uppercase ? "✅" : "❌"} Una letra mayúscula (A-Z)
          </Text>
          <Text style={[styles.validationItem, passwordValidation.number && styles.validationValid]}>
            {passwordValidation.number ? "✅" : "❌"} Un número (0-9)
          </Text>
          <Text style={[styles.validationItem, passwordValidation.special && styles.validationValid]}>
            {passwordValidation.special ? "✅" : "❌"} Un carácter especial (!@#$%^&*)
          </Text>
        </View>

        <Text style={registrarUsuarioStyles.label}>👤 Rol*</Text>
        <View style={registrarUsuarioStyles.pickerContainer}>
          <Picker selectedValue={form.id_Rol} onValueChange={v => handleChange("id_Rol", v)}>
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="Administrador" value="1" />
            <Picker.Item label="Supervisor" value="2" />
            <Picker.Item label="Personal" value="3" />
          </Picker>
        </View>

        <TouchableOpacity style={registrarUsuarioStyles.button} onPress={handleSubmit}>
          <Text style={registrarUsuarioStyles.buttonText}>✅ Registrar Usuario</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 12,
    marginBottom: 8,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#424242",
  },
  toggleButton: {
    padding: 6,
  },
  toggleText: {
    fontSize: 18,
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    paddingLeft: 5,
  },
  validationContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginHorizontal: 5,
  },
  validationItem: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    paddingLeft: 5,
  },
  validationValid: {
    color: "#4CAF50",
    fontWeight: "600",
  },
});

export default Register;