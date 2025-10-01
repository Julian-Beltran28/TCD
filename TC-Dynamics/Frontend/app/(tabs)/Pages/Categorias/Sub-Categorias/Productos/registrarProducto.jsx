import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const API_URL = "https://tcd-production.up.railway.app/api/productos/paquete";

export default function RegistrarProducto() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [stock, setStock] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      fetch("https://tcd-production.up.railway.app/api/proveedores/listar?limit=100")
        .then(res => res.json())
        .then(data => { if (isActive) setProveedores(data.proveedores || []); })
        .catch(() => { if (isActive) setProveedores([]); });
      return () => { isActive = false; };
    }, [])
  );
  const { replaceWithLoading } = useNavigationWithLoading();
  const subcategoriaId = params.subcategoriaId;

  const handleRegistrar = async () => {
    if (!nombre || !descripcion || !precio || !codigoBarras || !stock || !idProveedor || !subcategoriaId) {
      Alert.alert("Faltan datos", "Por favor, completa todos los campos y asegúrate de estar agregando el producto desde una subcategoría.");
      return;
    }
    // Validar que el proveedor seleccionado existe en la lista
    const proveedorValido = proveedores.some((prov) => prov.id.toString() === idProveedor);
    if (!proveedorValido) {
      Alert.alert("Proveedor inválido", "Debes seleccionar un proveedor válido de la lista.");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre_producto: nombre,
          descripcion: descripcion,
          precio: Number(precio),
          Codigo_de_barras: codigoBarras,
          stock: Number(stock),
          id_SubCategorias: Number(subcategoriaId),
          id_Proveedor: Number(idProveedor)
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData?.error || "Ocurrió un problema al guardar el producto. Por favor, revisa tu conexión o intenta más tarde.";
        throw new Error(msg);
      }
      Alert.alert("¡Registro exitoso!", "El producto fue registrado correctamente.");
      replaceWithLoading('/(tabs)/Pages/Categorias/Sub-Categorias/Productos/listarProductos', 'Redirigiendo...', 500);
    } catch (_error) {
      Alert.alert("No se pudo registrar", _error.message);
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
  <Text style={{marginBottom: 4}}>Proveedor:</Text>
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={idProveedor}
      onValueChange={setIdProveedor}
      style={{height: 40}}
    >
      <Picker.Item label="Selecciona un proveedor" value="" />
      {proveedores.map((prov) => (
        <Picker.Item key={prov.id} label={prov.nombre_empresa} value={prov.id.toString()} />
      ))}
    </Picker>
  </View>
  <Button title="Registrar" onPress={handleRegistrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, marginBottom: 12, justifyContent: 'center' },
});
