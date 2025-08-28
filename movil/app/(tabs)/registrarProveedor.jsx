import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://192.168.80.14:8081/api/proveedores";

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
  const router = useRouter();

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
        router.replace({ pathname: '/(tabs)/proveedores', params: { refresh: Date.now().toString() } });
      } else {
        router.replace('/(tabs)/proveedores');
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
