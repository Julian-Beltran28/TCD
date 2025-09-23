// src/pages/Ventas/ventasProveedores.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

const API_URL = "http://10.193.194.192:8084/api/proveedores";

const VentasProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({}); // cantidades por producto
  

  // Traer proveedores al inicio
  const fetchProveedores = async () => {
    try {
      showLoading("Cargando...");
      const res = await fetch(`${API_URL}/listar`);
      const data = await res.json();
      setProveedores(data.proveedores || []);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los proveedores");
    } finally {
      hideLoading();
    }
  };

  // Traer productos del proveedor seleccionado
  const fetchProductosProveedor = async (id) => {
    try {
      showLoading("Cargando...");
      const res = await fetch(`${API_URL}/productos/${id}`);
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Manejar selección de proveedor
  const handleProveedorSelect = (proveedor) => {
    setSelectedProveedor(proveedor);
    fetchProductosProveedor(proveedor.id);
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const cantidad = parseInt(cantidades[producto.id] || 0);
    if (!cantidad || cantidad <= 0) {
      Alert.alert("Cantidad inválida", "Debe ingresar un número mayor a 0");
      return;
    }

    const item = {
      id_proveedor: selectedProveedor.id,
      nombre_empresa: selectedProveedor.nombre_empresa,
      producto_id: producto.id,
      nombre_producto: producto.Nombre_producto,
      tipo: producto.tipo,
      stock: producto.stock || producto.Kilogramos || producto.Libras,
      cantidad,
    };

    setCarrito((prev) => [...prev, item]);
    setCantidades((prev) => ({ ...prev, [producto.id]: "" })); // limpiar input
    Alert.alert("Agregado", `${producto.Nombre_producto} agregado al carrito`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Ventas a Proveedores</Text>

      {/* Lista de proveedores */}
      <Text style={styles.subtitle}>Seleccione un proveedor:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={proveedores}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.proveedorBtn,
                selectedProveedor?.id === item.id && styles.proveedorBtnSelected,
              ]}
              onPress={() => handleProveedorSelect(item)}
            >
              <Text
                style={[
                  styles.proveedorBtnText,
                  selectedProveedor?.id === item.id && { color: "white" },
                ]}
              >
                {item.nombre_empresa}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Lista de productos */}
      {selectedProveedor && (
        <>
          <Text style={styles.subtitle}>
            Productos de {selectedProveedor.nombre_empresa}:
          </Text>
          <FlatList
            data={productos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>{item.Nombre_producto}</Text>
                <Text>Tipo: {item.tipo}</Text>
                <Text>
                  Stock: {item.stock || item.Kilogramos || item.Libras}
                </Text>
                <View style={styles.row}>
                  <TextInput
                    style={styles.input}
                    placeholder="Cantidad"
                    keyboardType="numeric"
                    value={cantidades[item.id] || ""}
                    onChangeText={(text) =>
                      setCantidades((prev) => ({ ...prev, [item.id]: text }))
                    }
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => agregarAlCarrito(item)}
                  >
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      {/* Carrito */}
      <Text style={styles.subtitle}>🛍️ Carrito ({carrito.length} items)</Text>
      <FlatList
        data={carrito}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.cartText}>
              {item.nombre_producto} ({item.cantidad}) - {item.nombre_empresa}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f4f8" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  proveedorBtn: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  proveedorBtnSelected: { backgroundColor: "#2196F3" },
  proveedorBtnText: { fontSize: 16, fontWeight: "500", color: "#333" },
  card: {
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: { color: "white", fontWeight: "600" },
  cartItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cartText: { fontSize: 15, color: "#333" },
});

export default VentasProveedores;
