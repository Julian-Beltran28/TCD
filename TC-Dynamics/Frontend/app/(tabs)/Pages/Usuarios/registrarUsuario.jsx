import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import BackButton from '@/components/BackButton';
import { registrarUsuarioStyles } from "../../../styles/registrarUsuarioStyles";
import bcrypt from 'bcryptjs';

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
  const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = async () => {
    // Validación básica
    if (!form.Primer_Nombre || !form.Primer_Apellido || !form.Tipo_documento || !form.Numero_documento || !form.Numero_celular || !form.Correo_personal || !form.id_Rol || !form.Contrasena) {
      Alert.alert("❌ Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validar longitud de contraseña
    if (form.Contrasena.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validar que id_Rol no esté vacío
    if (!form.id_Rol || form.id_Rol === "") {
      Alert.alert("Error", "Por favor, selecciona un rol.");
      return;
    }

    showLoading("Registrando usuario...");
    try {
      // Encriptar la contraseña antes de enviarla
      console.log('🔐 Encriptando contraseña...');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(form.Contrasena, saltRounds);
      console.log('✅ Contraseña encriptada exitosamente');

      // Crear objeto con la contraseña encriptada
      const formWithHashedPassword = {
        ...form,
        Contrasena: hashedPassword
      };

      console.log('📤 Enviando datos al servidor:', {
        ...formWithHashedPassword,
        Contrasena: '[ENCRYPTED]' // No mostrar la contraseña en logs
      });

      const response = await fetch("https://tcd-production.up.railway.app/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWithHashedPassword)
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
          value={form.Primer_Nombre} 
          onChangeText={v => handleChange("Primer_Nombre", v)} 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Segundo Nombre" 
          value={form.Segundo_Nombre} 
          onChangeText={v => handleChange("Segundo_Nombre", v)} 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Primer Apellido*" 
          value={form.Primer_Apellido} 
          onChangeText={v => handleChange("Primer_Apellido", v)} 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Segundo Apellido" 
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
          value={form.Numero_documento} 
          onChangeText={v => handleChange("Numero_documento", v)} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Número de Celular*" 
          value={form.Numero_celular} 
          onChangeText={v => handleChange("Numero_celular", v)} 
          keyboardType="phone-pad" 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Correo Personal*" 
          value={form.Correo_personal} 
          onChangeText={v => handleChange("Correo_personal", v)} 
          keyboardType="email-address" 
        />
        <TextInput 
          style={registrarUsuarioStyles.input} 
          placeholder="Correo Empresarial" 
          value={form.Correo_empresarial} 
          onChangeText={v => handleChange("Correo_empresarial", v)} 
          keyboardType="email-address" 
        />
        
        {/* Campo de contraseña con estilos mejorados */}
        <Text style={registrarUsuarioStyles.label}>🔐 Contraseña*</Text>
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Contraseña (mín. 6 caracteres)" 
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
        <Text style={styles.helpText}>* Mínimo 6 caracteres</Text>

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
    marginBottom: 12,
    paddingLeft: 5,
  },
});

export default Register;