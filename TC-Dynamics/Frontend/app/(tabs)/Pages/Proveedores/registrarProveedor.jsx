import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';
import styles from "../../../styles/registrarProveedorStyles";

const API_URL = "http://192.168.80.19:8084/api/proveedores";

export default function RegistrarProveedor() {
  const params = useLocalSearchParams();
  const [nombre_empresa, setNombreEmpresa] = useState("");
  const [tipo_exportacion, setTipoExportacion] = useState("");
  const [nombre_representante, setNombreRepresentante] = useState("");
  const [apellido_representante, setApellidoRepresentante] = useState("");
  const [numero_empresarial, setNumeroEmpresarial] = useState("");
  const [correo_empresarial, setCorreoEmpresarial] = useState("");

  // Limpiar campos al entrar a la pantalla
  useEffect(() => {
    setNombreEmpresa("");
    setTipoExportacion("");
    setNombreRepresentante("");
    setApellidoRepresentante("");
    setNumeroEmpresarial("");
    setCorreoEmpresarial("");
  }, [params.from]);
  const { replaceWithLoading } = useNavigationWithLoading();

  const handleRegistrar = async () => {
    if (!nombre_empresa || !tipo_exportacion || !nombre_representante || !apellido_representante || !numero_empresarial || !correo_empresarial) {
  Alert.alert("Faltan datos", "Por favor, completa todos los campos para registrar un proveedor.");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_empresa,
          tipo_exportacion,
          nombre_representante,
          apellido_representante,
          numero_empresarial,
          correo_empresarial,
        }),
      });
  if (!response.ok) throw new Error();
  Alert.alert("¡Registro exitoso!", "El proveedor fue registrado correctamente.");
      // Si viene de proveedores, regresa y refresca; si no, solo navega
      if (params.from === 'proveedores') {
        replaceWithLoading('/(tabs)/Pages/Proveedores/listarProveedores', 'Redirigiendo...', 500);
      } else {
        replaceWithLoading('/(tabs)/Pages/Proveedores/listarProveedores', 'Redirigiendo...', 500);
      }
    } catch (_error) {
  Alert.alert("No se pudo registrar", "Ocurrió un problema al guardar el proveedor. Por favor, revisa tu conexión o intenta más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Proveedor</Text>
      <TextInput style={styles.input} placeholder="Nombre empresa" value={nombre_empresa} onChangeText={setNombreEmpresa} />
      <TextInput style={styles.input} placeholder="Tipo exportación" value={tipo_exportacion} onChangeText={setTipoExportacion} />
      <TextInput style={styles.input} placeholder="Nombre representante" value={nombre_representante} onChangeText={setNombreRepresentante} />
      <TextInput style={styles.input} placeholder="Apellido representante" value={apellido_representante} onChangeText={setApellidoRepresentante} />
      <TextInput style={styles.input} placeholder="Número empresarial" value={numero_empresarial} onChangeText={setNumeroEmpresarial} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Correo empresarial" value={correo_empresarial} onChangeText={setCorreoEmpresarial} keyboardType="email-address" />
      <Button title="Registrar" onPress={handleRegistrar} />
    </View>
  );
}
