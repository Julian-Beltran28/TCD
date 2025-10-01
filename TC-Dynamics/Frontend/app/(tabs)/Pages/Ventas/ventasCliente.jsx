// src/pages/Ventas/VentasCliente.jsx
import React, { useState, useEffect } from "react";
import { styles } from "../../../styles/ventasStyle";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';

const API_URL = "https://tcd-production.up.railway.app/api/productos";
const BASE_URL = "https://tcd-production.up.railway.app";

const VentasCliente = () => {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalCarritoVisible, setModalCarritoVisible] = useState(false);
  

  // Traer todos los productos
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await res.json();
      console.log("Productos recibidos:", data); // Para debug
      const productosArray = Array.isArray(data) ? data : [];
      setProductos(productosArray);
      setProductosFiltrados(productosArray);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      Alert.alert("Error", "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrar productos por búsqueda
  useEffect(() => {
    if (busqueda.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter((producto) => {
        const nombre = producto.Nombre_producto?.toLowerCase() || "";
        const codigo = producto.Codigo_de_barras?.toLowerCase() || "";
        const tipo = producto.tipo_producto?.toLowerCase() || "";
        const searchLower = busqueda.toLowerCase();
        
        return (
          nombre.includes(searchLower) ||
          codigo.includes(searchLower) ||
          tipo.includes(searchLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
  }, [busqueda, productos]);

  // Función para obtener la URL de la imagen
  const getImageUrl = (producto) => {
    // El campo en la BD es Imagen_producto
    const imagenField = producto.Imagen_producto || producto.imagen || producto.Imagen || producto.image;
    
    if (!imagenField) {
      console.log("No hay imagen para:", producto.Nombre_producto);
      return null;
    }
    
    // Si ya tiene la ruta completa
    if (imagenField.startsWith('http')) {
      return imagenField;
    }
    
    // Si tiene /uploads/ en la ruta
    if (imagenField.includes('/uploads/')) {
      return `${BASE_URL}${imagenField}`;
    }
    
    // Si solo tiene el nombre del archivo
    const imageUrl = `${BASE_URL}/uploads/${imagenField}`;
    console.log("URL de imagen:", imageUrl, "para producto:", producto.Nombre_producto);
    return imageUrl;
  };

  // Agregar al carrito
  const agregarAlCarrito = (producto) => {
    const cantidadStr = cantidades[producto.id] || "";
    const cantidad = parseInt(cantidadStr, 10);

    if (isNaN(cantidad) || cantidad <= 0) {
      Alert.alert("Cantidad inválida", "Debe ingresar un número mayor a 0");
      return;
    }

    const precioBase =
      producto.precio ||
      producto.Precio_kilogramo ||
      producto.Precio_libras ||
      0;

    const stock =
      producto.stock ||
      producto.Kilogramos ||
      producto.Libras ||
      0;

    if (cantidad > stock) {
      Alert.alert("Stock insuficiente", `Solo hay ${stock} unidades disponibles`);
      return;
    }

    const item = {
      id: producto.id,
      nombre: producto.Nombre_producto,
      tipo: producto.tipo_producto,
      codigo: producto.Codigo_de_barras || "N/A",
      imagen: producto.Imagen_producto || producto.imagen || null,
      stock,
      cantidad,
      precio: precioBase,
      descuento: 0,
    };

    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === item.id);
      if (existe) {
        const nuevaCantidad = existe.cantidad + cantidad;
        if (nuevaCantidad > stock) {
          Alert.alert("Stock insuficiente", `Solo hay ${stock} unidades disponibles`);
          return prev;
        }
        return prev.map((p) =>
          p.id === item.id ? { ...p, cantidad: nuevaCantidad } : p
        );
      }
      return [...prev, item];
    });

    setCantidades((prev) => ({ ...prev, [producto.id]: "" }));
    Alert.alert("✅ Producto agregado", `${item.nombre} se agregó al carrito`);
  };

  // Cambiar cantidad en carrito
  const cambiarCantidad = (id, nuevaCantidadStr) => {
    const nuevaCantidad = parseInt(nuevaCantidadStr, 10) || 1;
    const productoCarrito = carrito.find((p) => p.id === id);
    if (productoCarrito && nuevaCantidad > productoCarrito.stock) {
      Alert.alert("Stock insuficiente", `Solo hay ${productoCarrito.stock} unidades disponibles`);
      return;
    }
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: nuevaCantidad } : p))
    );
  };

  // Cambiar descuento
  const cambiarDescuento = (id, nuevoDescuentoStr) => {
    const nuevoDescuento = parseFloat(nuevoDescuentoStr) || 0;
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, descuento: nuevoDescuento } : p))
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

  // Calcular cantidad total de items
  const calcularTotalItems = () => {
    return carrito.reduce((acc, p) => acc + p.cantidad, 0);
  };

  // Componente de imagen de producto
  const ProductImage = ({ producto, size = 70 }) => {
    const imageUrl = getImageUrl(producto);
    const borderRadius = size / 2;

    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.productImage,
            { width: size, height: size, borderRadius }
          ]}
          contentFit="cover"
          onError={(error) => {
            console.log("Error cargando imagen:", imageUrl, error);
          }}
        />
      );
    }

    return (
      <View style={[
        styles.productImage,
        styles.placeholderImage,
        { width: size, height: size, borderRadius }
      ]}>
        <Text style={styles.placeholderText}>📦</Text>
      </View>
    );
  };
    
      return (
    <LinearGradient
      colors={["#ffffff", "#f0f9f4", "#c8e6c9"]}
      style={styles.container}
    >
      <Text style={styles.title}>Ventas Clientes</Text>

      {/* Botón para ir a Ventas Proveedores */}
      <TouchableOpacity
        style={styles.proveedoresButton}
        onPress={() => router.push('/Pages/Ventas/ventasProveedores')}
      >
        <Text style={styles.proveedoresButtonText}> Ir a Ventas Proveedores</Text>
      </TouchableOpacity>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder=" Buscar productos..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Botón para abrir carrito */}
      <TouchableOpacity
        style={styles.carritoButton}
        onPress={() => setModalCarritoVisible(true)}
      >
        <Text style={styles.carritoButtonText}>
           Ver Carrito ({calcularTotalItems()})
        </Text>
        {carrito.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{carrito.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Lista de productos */}
      <Text style={styles.subtitle}>Productos disponibles:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : productosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {busqueda ? "No se encontraron productos" : "No hay productos disponibles"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => String(item.id || item.Codigo_de_barras || Math.random())}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                {/* Imagen del producto */}
                <View style={styles.imageContainer}>
                  <ProductImage producto={item} size={70} />
                </View>

                {/* Información del producto */}
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{item.Nombre_producto}</Text>
                  <Text style={styles.infoText}>Tipo: {item.tipo_producto}</Text>
                  <Text style={styles.infoText}>Código: {item.Codigo_de_barras || "N/A"}</Text>
                  <Text style={styles.infoText}>
                    Stock: {item.stock || item.Kilogramos || item.Libras || 0}
                  </Text>
                  <Text style={styles.priceText}>
                    Precio: $
                    {item.precio ||
                      item.Precio_kilogramo ||
                      item.Precio_libras ||
                      "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                  value={cantidades[item.id] || ""}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setCantidades((prev) => ({ ...prev, [item.id]: cleaned }));
                  }}
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

      {/* Modal del Carrito */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCarritoVisible}
        onRequestClose={() => setModalCarritoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}> Carrito de Compras</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalCarritoVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {carrito.length === 0 ? (
                <View style={styles.emptyCart}>
                  <Text style={styles.emptyCartText}>El carrito está vacío</Text>
                </View>
              ) : (
                carrito.map((item) => {
                  const imageUrl = item.imagen 
                    ? (item.imagen.startsWith('http') 
                        ? item.imagen 
                        : item.imagen.includes('/uploads/')
                          ? `${BASE_URL}${item.imagen}`
                          : `${BASE_URL}/uploads/${item.imagen}`)
                    : null;

                  return (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={styles.cartItemHeader}>
                        {/* Imagen pequeña en carrito */}
                        {imageUrl ? (
                          <Image
                            source={{ uri: imageUrl }}
                            style={styles.cartItemImage}
                            contentFit="cover"
                            onError={(error) => {
                              console.log("Error cargando imagen en carrito:", imageUrl);
                            }}
                          />
                        ) : (
                          <View style={[styles.cartItemImage, styles.placeholderImage]}>
                            <Text style={styles.placeholderTextSmall}>📦</Text>
                          </View>
                        )}
                        <View style={styles.cartItemInfo}>
                          <Text style={styles.cartText}>{item.nombre}</Text>
                          <Text style={styles.cartSubtext}>
                            ${item.precio.toFixed(2)} c/u
                          </Text>
                        </View>
                      </View>

                      <View style={styles.cartItemActions}>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Cant:</Text>
                          <TextInput
                            style={styles.inputSmall}
                            keyboardType="numeric"
                            value={String(item.cantidad)}
                            onChangeText={(text) => {
                              const cleaned = text.replace(/[^0-9]/g, '');
                              cambiarCantidad(item.id, cleaned);
                            }}
                          />
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Desc %:</Text>
                          <TextInput
                            style={styles.inputSmall}
                            keyboardType="numeric"
                            placeholder="0"
                            value={String(item.descuento)}
                            onChangeText={(text) => {
                              const cleaned = text.replace(/[^0-9.]/g, '');
                              cambiarDescuento(item.id, cleaned);
                            }}
                          />
                        </View>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => eliminarDelCarrito(item.id)}
                        >
                          <Text style={styles.deleteButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.subtotalText}>
                        Subtotal: ${((item.cantidad * item.precio) * (1 - item.descuento / 100)).toFixed(2)}
                      </Text>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.totalText}>
                 Total: ${calcularTotal().toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.finalizarButton}
                onPress={() => {
                  Alert.alert("Compra finalizada", `Total: $${calcularTotal().toFixed(2)}`);
                  setModalCarritoVisible(false);
                }}
              >
                <Text style={styles.finalizarButtonText}>Finalizar Compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default VentasCliente;