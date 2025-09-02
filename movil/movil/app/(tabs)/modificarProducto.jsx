
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_URL = "http://10.241.69.192:8084/api/productos/paquete";


// Campos de los datos de los productos al modicarlos.

export default function ModificarProducto() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [stock, setStock] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const subcategoriaId = params.subcategoriaId;


  // Muestra los datos que ya tenga el producto en su respectivo campo.

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/${params.id}`);
        if (!res.ok) throw new Error("Error al obtener producto");
        const prod = await res.json();
        setNombre(prod.Nombre_producto || prod.nombre || "");
        setDescripcion(prod.Descripcion || prod.descripcion || "");
        setPrecio(prod.Precio || prod.precio || "");
        setCodigoBarras(prod.Codigo_de_barras || "");
        setStock(prod.Stock || "");
        setIdProveedor(prod.id_Proveedor || "");
      } catch (_error) {
        Alert.alert("Error", "No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProducto();
  }, [params.id]);

  const handleModificar = async () => {
    if (!nombre || !descripcion || !precio || !subcategoriaId) {
      Alert.alert("Faltan datos", "Por favor, completa todos los campos y asegúrate de estar editando el producto desde una subcategoría.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${params.id}`, {
        method: "PUT",
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
      Alert.alert("¡Modificación exitosa!", "El producto fue modificado correctamente.");
      router.replace({ pathname: '/(tabs)/productos', params: { subcategoriaId, refresh: Date.now().toString() } });
    } catch (_error) {
      Alert.alert("No se pudo modificar", "Ocurrió un problema al modificar el producto. Por favor, revisa tu conexión o intenta más tarde.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando producto...</Text>
      </View>
    );
  }


// Actuliza los datos del producto.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Producto</Text>
      <TextInput style={styles.input} placeholder="Nombre del producto" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Código de barras" value={codigoBarras} onChangeText={setCodigoBarras} />
      <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="ID Proveedor" value={idProveedor} onChangeText={setIdProveedor} keyboardType="numeric" />
      <Button title="Modificar" onPress={handleModificar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 4 },
});
