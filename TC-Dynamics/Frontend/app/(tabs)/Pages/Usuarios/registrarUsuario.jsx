import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
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
    id_Rol: ""
  });

  const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = async () => {
    if (!form.Primer_Nombre || !form.Primer_Apellido || !form.Tipo_documento || !form.Numero_documento || !form.Numero_celular || !form.Correo_personal || !form.id_Rol) {
      Alert.alert("❌ Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    showLoading("Registrando usuario...");
    try {
      const response = await fetch("https://tcd-production.up.railway.app/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        Alert.alert("✅ Éxito", "Usuario registrado correctamente");
        await replaceWithLoading("(tabs)/Pages/Usuarios/listarUsuarios", "Cargando lista...", 500);
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "No se pudo registrar el usuario");
      }
    } catch (_error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <BackButton />
      <ScrollView contentContainerStyle={registrarUsuarioStyles.container}>
        <Text style={registrarUsuarioStyles.title}>📝 Registrar Nuevo Usuario</Text>

        <TextInput style={registrarUsuarioStyles.input} placeholder="Primer Nombre*" value={form.Primer_Nombre} onChangeText={v => handleChange("Primer_Nombre", v)} />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Segundo Nombre" value={form.Segundo_Nombre} onChangeText={v => handleChange("Segundo_Nombre", v)} />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Primer Apellido*" value={form.Primer_Apellido} onChangeText={v => handleChange("Primer_Apellido", v)} />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Segundo Apellido" value={form.Segundo_Apellido} onChangeText={v => handleChange("Segundo_Apellido", v)} />

        <Text style={registrarUsuarioStyles.label}>📄 Tipo de Documento*</Text>
        <View style={registrarUsuarioStyles.pickerContainer}>
          <Picker selectedValue={form.Tipo_documento} onValueChange={v => handleChange("Tipo_documento", v)}>
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="C.C" value="C.C" />
            <Picker.Item label="T.I" value="T.I" />
            <Picker.Item label="P.E" value="P.E" />
          </Picker>
        </View>

        <TextInput style={registrarUsuarioStyles.input} placeholder="Número de Documento*" value={form.Numero_documento} onChangeText={v => handleChange("Numero_documento", v)} keyboardType="numeric" />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Número de Celular*" value={form.Numero_celular} onChangeText={v => handleChange("Numero_celular", v)} keyboardType="phone-pad" />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Correo Personal*" value={form.Correo_personal} onChangeText={v => handleChange("Correo_personal", v)} keyboardType="email-address" />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Correo Empresarial" value={form.Correo_empresarial} onChangeText={v => handleChange("Correo_empresarial", v)} keyboardType="email-address" />

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
          <Text style={registrarUsuarioStyles.buttonText}>Registrar Usuario</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Register;
