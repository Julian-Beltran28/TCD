import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "../../../styles/modificarProveedorStyles";

const API_URL = "http://10.1.214.182:8084/api/proveedores";

export default function ModificarProveedor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nombre_empresa, setNombreEmpresa] = useState("");
  const [tipo_exportacion, setTipoExportacion] = useState("");
  const [nombre_representante, setNombreRepresentante] = useState("");
  const [apellido_representante, setApellidoRepresentante] = useState("");
  const [numero_empresarial, setNumeroEmpresarial] = useState("");
  const [correo_empresarial, setCorreoEmpresarial] = useState("");

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Error al obtener proveedor");
        const data = await res.json();
        setNombreEmpresa(data.nombre_empresa || "");
        setTipoExportacion(data.tipo_exportacion || "");
        setNombreRepresentante(data.nombre_representante || "");
        setApellidoRepresentante(data.apellido_representante || "");
        setNumeroEmpresarial(data.numero_empresarial || "");
        setCorreoEmpresarial(data.correo_empresarial || "");
      } catch (_error) {
        Alert.alert("Error", "No se pudo cargar el proveedor");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProveedor();
  }, [id]);

  const handleModificar = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
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
      if (!res.ok) throw new Error("Error al modificar proveedor");
      Alert.alert("Éxito", "Proveedor modificado");
      router.replace({ pathname: '/(tabs)/proveedores', params: {
        refresh: Date.now().toString()
      }});
    } catch (_error) {
      Alert.alert("Error", "No se pudo modificar el proveedor");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando proveedor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Proveedor</Text>
      <TextInput style={styles.input} placeholder="Nombre empresa" value={nombre_empresa} onChangeText={setNombreEmpresa} />
      <TextInput style={styles.input} placeholder="Tipo exportación" value={tipo_exportacion} onChangeText={setTipoExportacion} />
      <TextInput style={styles.input} placeholder="Nombre representante" value={nombre_representante} onChangeText={setNombreRepresentante} />
      <TextInput style={styles.input} placeholder="Apellido representante" value={apellido_representante} onChangeText={setApellidoRepresentante} />
      <TextInput style={styles.input} placeholder="Número empresarial" value={numero_empresarial} onChangeText={setNumeroEmpresarial} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Correo empresarial" value={correo_empresarial} onChangeText={setCorreoEmpresarial} keyboardType="email-address" />
      <Button title="Modificar" onPress={handleModificar} />
    </View>
  );
}

