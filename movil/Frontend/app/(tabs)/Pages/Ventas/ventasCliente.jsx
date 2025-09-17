// src/pages/Ventas/VentasCliente.jsx
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

const API_URL = "http://192.168.20.31:8084/api/productos"; // 👈 ajusta tu IP

const VentasCliente = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [descuentos, setDescuentos] = useState({});
  const [loading, setLoading] = useState(false);

  // Traer todos los productos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setProductos(data || []);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Agregar al carrito
  const agregarAlCarrito = (producto) => {
    const cantidad = parseInt(cantidades[producto.id] || 0);
    if (!cantidad || cantidad <= 0) {
      Alert.alert("Cantidad inválida", "Debe ingresar un número mayor a 0");
      return;
    }

    // Precio según tipo
    const precioBase =
      producto.precio || producto.Precio_kilogramo || producto.Precio_libras || 0;

    const item = {
      id: producto.id,
      nombre: producto.Nombre_producto,
      tipo: producto.tipo_producto,
      codigo: producto.Codigo_de_barras || "N/A",
      stock: producto.stock || producto.Kilogramos || producto.Libras,
      cantidad,
      precio: precioBase,
      descuento: 0,
    };

    // Si ya está en el carrito, actualizamos cantidad
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === item.id);
      if (existe) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      }
      return [...prev, item];
    });

    setCantidades((prev) => ({ ...prev, [producto.id]: "" })); // limpiar input
  };

  // Cambiar cantidad en carrito
  const cambiarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: parseInt(nuevaCantidad) || 1 } : p
      )
    );
  };

  // Cambiar descuento
  const cambiarDescuento = (id, nuevoDescuento) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, descuento: parseFloat(nuevoDescuento) || 0 } : p
      )
    );
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((acc, p) => {
      const subtotal = p.cantidad * p.precio;
      const descuento = (subtotal * p.descuento) / 100;
      return acc + (subtotal - descuento);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Ventas Clientes</Text>

      {/* Lista de productos */}
      <Text style={styles.subtitle}>Productos disponibles:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.Nombre_producto}</Text>
              <Text>Tipo: {item.tipo_producto}</Text>
              <Text>Código: {item.Codigo_de_barras || "N/A"}</Text>
              <Text>
                Stock: {item.stock || item.Kilogramos || item.Libras || 0}
              </Text>
              <Text>Precio: ${item.precio || item.Precio_kilogramo || item.Precio_libras}</Text>

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
      )}

      {/* Carrito */}
      <Text style={styles.subtitle}>🛍️ Carrito ({carrito.length} items)</Text>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.cartText}>
              {item.nombre} ({item.cantidad}) - ${item.precio} c/u
            </Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={String(item.cantidad)}
                onChangeText={(text) => cambiarCantidad(item.id, text)}
              />
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                placeholder="% Desc."
                value={String(item.descuento)}
                onChangeText={(text) => cambiarDescuento(item.id, text)}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarDelCarrito(item.id)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Total */}
      <Text style={styles.total}>💰 Total: ${calcularTotal().toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f4f8" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
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
  inputSmall: {
    width: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 4,
    textAlign: "center",
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
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 6,
  },
  cartText: { fontSize: 15, color: "#333", marginBottom: 6 },
  deleteButton: {
    backgroundColor: "#e53935",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteButtonText: { color: "white", fontWeight: "600" },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 12, textAlign: "center" },
});

export default VentasCliente;
