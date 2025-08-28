import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://192.168.80.14:8081/api/productos/paquete";

export default function RegistrarProducto() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [stock, setStock] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const router = useRouter();
  const subcategoriaId = params.subcategoriaId;

  const handleRegistrar = async () => {
    if (!nombre || !descripcion || !precio || !subcategoriaId) {
      Alert.alert("Faltan datos", "Por favor, completa todos los campos y asegúrate de estar agregando el producto desde una subcategoría.");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre_producto: nombre,
          Descripcion: descripcion,
          Precio: precio,
          Codigo_de_barras: codigoBarras,
          Stock: stock,
          id_SubCategorias: subcategoriaId,
          id_Proveedor: idProveedor
        }),
      });
      if (!response.ok) throw new Error();
      Alert.alert("¡Registro exitoso!", "El producto fue registrado correctamente.");
      router.replace({ pathname: '/(tabs)/productos', params: { subcategoriaId, refresh: Date.now().toString() } });
    } catch (_error) {
      Alert.alert("No se pudo registrar", "Ocurrió un problema al guardar el producto. Por favor, revisa tu conexión o intenta más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Producto</Text>
  <TextInput style={styles.input} placeholder="Nombre del producto" value={nombre} onChangeText={setNombre} />
  <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
  <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
  <TextInput style={styles.input} placeholder="Código de barras" value={codigoBarras} onChangeText={setCodigoBarras} />
  <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
  <TextInput style={styles.input} placeholder="ID Proveedor" value={idProveedor} onChangeText={setIdProveedor} keyboardType="numeric" />
  <Button title="Registrar" onPress={handleRegistrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
