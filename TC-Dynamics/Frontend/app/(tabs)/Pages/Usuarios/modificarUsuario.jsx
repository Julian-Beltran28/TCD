import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import BackButton from "@/components/BackButton";
import { modificarUsuarioStyles } from "../../../styles/modificarUsuarioStyles";
import { MaterialIcons } from "@expo/vector-icons";

const Editar = () => {
  const { id } = useLocalSearchParams();
  const { replaceWithLoading, hideLoading } = useNavigationWithLoading();

  //  Estados del formulario
  const [Nombres, setNombres] = useState("");
  const [Apellidos, setApellidos] = useState("");
  const [Correo_personal, setCorreo_personal] = useState("");
  const [Numero_celular, setNumero_celular] = useState("");
  const [id_Rol, setId_Rol] = useState("");

  //  Cargar datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`https://tcd-production.up.railway.app/api/usuarios/${id}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();

        setNombres(
          `${data.Primer_Nombre || ""} ${data.Segundo_Nombre || ""}`.trim()
        );
        setApellidos(
          `${data.Primer_Apellido || ""} ${data.Segundo_Apellido || ""}`.trim()
        );
        setCorreo_personal(data.Correo_personal || "");
        setNumero_celular(data.Numero_celular || "");
        setId_Rol(data.id_Rol?.toString() || "");
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el usuario");
      } finally {
        hideLoading();
      }
    };
    if (id) fetchUsuario();
  }, [id, hideLoading]);

  //  Guardar cambios
  const handleSubmit = async () => {
    try {
      // Dividir nombres y apellidos en partes si es necesario
      const [Primer_Nombre = "", Segundo_Nombre = ""] = Nombres.split(" ");
      const [Primer_Apellido = "", Segundo_Apellido = ""] = Apellidos.split(" ");

      const res = await fetch(`https://tcd-production.up.railway.app/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Primer_Nombre,
          Segundo_Nombre,
          Primer_Apellido,
          Segundo_Apellido,
          Correo_personal,
          Numero_celular,
          id_Rol,
        }),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      Alert.alert("✅ Éxito", "Usuario actualizado correctamente");
      replaceWithLoading("/(tabs)/Pages/Usuarios/listarUsuarios", "Redirigiendo...", 500);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario");
    }
  };

  //  Cancelar edición
  const handleCancel = () => {
    replaceWithLoading("/(tabs)/Pages/Usuarios/listarUsuarios", "Volviendo a la lista...", 300);
  };

  return (
    <>
      <BackButton />
      <View style={modificarUsuarioStyles.container}>
        <Text style={modificarUsuarioStyles.header}>Editar Usuario </Text>

        <View style={modificarUsuarioStyles.formContainer}>
          <Text style={modificarUsuarioStyles.label}>Nombres</Text>
          <TextInput
            value={Nombres}
            onChangeText={setNombres}
            placeholder="Ej: Juan Carlos"
            style={modificarUsuarioStyles.input}
          />

          <Text style={modificarUsuarioStyles.label}>Apellidos</Text>
          <TextInput
            value={Apellidos}
            onChangeText={setApellidos}
            placeholder="Ej: Pérez Ramírez"
            style={modificarUsuarioStyles.input}
          />

          <Text style={modificarUsuarioStyles.label}>Correo Personal</Text>
          <TextInput
            value={Correo_personal}
            onChangeText={setCorreo_personal}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            style={modificarUsuarioStyles.input}
          />

          <Text style={modificarUsuarioStyles.label}>Número de Celular</Text>
          <TextInput
            value={Numero_celular}
            onChangeText={setNumero_celular}
            placeholder="Ej: 3001234567"
            keyboardType="phone-pad"
            style={modificarUsuarioStyles.input}
          />

          <Text style={modificarUsuarioStyles.label}>Rol</Text>
          <TextInput
            value={id_Rol}
            onChangeText={setId_Rol}
            placeholder="ID del rol"
            keyboardType="numeric"
            style={modificarUsuarioStyles.input}
          />
        </View>

        {/* Botones de acción */}
        <View style={modificarUsuarioStyles.buttonContainer}>
          <TouchableOpacity style={modificarUsuarioStyles.saveButton} onPress={handleSubmit}>
            <MaterialIcons name="save" size={22} color="#fff" />
            <Text style={modificarUsuarioStyles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={modificarUsuarioStyles.cancelButton} onPress={handleCancel}>
            <MaterialIcons name="cancel" size={22} color="#fff" />
            <Text style={modificarUsuarioStyles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <Text style={modificarUsuarioStyles.infoText}>
          📝 Asegúrate de que la información sea correcta antes de guardar.
        </Text>
      </View>
    </>
  );
};

export default Editar;
