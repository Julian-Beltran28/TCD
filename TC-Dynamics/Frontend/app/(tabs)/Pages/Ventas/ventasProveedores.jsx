// src/pages/Ventas/ventasProveedores.jsx
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
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';

// URLs
const API_PROVEEDORES = "https://tcd-production.up.railway.app/api/proveedores/listar";
const API_PRODUCTOS_PROVEEDOR = "https://tcd-production.up.railway.app/api/productos?proveedor=";
const BASE_URL = "https://tcd-production.up.railway.app";

const VentasProveedores = () => {
  const router = useRouter();
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalCarritoVisible, setModalCarritoVisible] = useState(false);
  const [busquedaProveedores, setBusquedaProveedores] = useState("");
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);

  // Cargar proveedores
  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_PROVEEDORES);
      if (!res.ok) throw new Error("Error al cargar proveedores");
      const data = await res.json();
      const lista = Array.isArray(data.proveedores) ? data.proveedores : [];
      setProveedores(lista);
      setProveedoresFiltrados(lista);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos por proveedor
  const fetchProductosPorProveedor = async (idProveedor) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_PRODUCTOS_PROVEEDOR}${idProveedor}`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      const productosArray = Array.isArray(data) ? data : [];
      setProductos(productosArray);
      setProductosFiltrados(productosArray);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudieron cargar los productos del proveedor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Filtrar productos por búsqueda
  useEffect(() => {
    if (!selectedProveedor) return;
    
    if (busqueda.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter((producto) => {
        const nombre = producto.Nombre_producto?.toLowerCase() || "";
        const codigo = producto.Codigo_de_barras?.toLowerCase() || "";
        const tipo = producto.tipo_producto?.toLowerCase() || "";
        const searchLower = busqueda.toLowerCase();
        return nombre.includes(searchLower) || codigo.includes(searchLower) || tipo.includes(searchLower);
      });
      setProductosFiltrados(filtrados);
    }
  }, [busqueda, productos, selectedProveedor]);

  // Filtrar proveedores por búsqueda
  useEffect(() => {
    if (busquedaProveedores.trim() === "") {
      setProveedoresFiltrados(proveedores);
    } else {
      const searchLower = busquedaProveedores.toLowerCase();
      const filtrados = proveedores.filter(proveedor =>
        (proveedor.nombre_empresa?.toLowerCase().includes(searchLower)) ||
        (proveedor.nombre_representante?.toLowerCase().includes(searchLower)) ||
        (proveedor.apellido_representante?.toLowerCase().includes(searchLower)) ||
        (proveedor.correo_empresarial?.toLowerCase().includes(searchLower)) ||
        (proveedor.numero_empresarial?.includes(searchLower))
      );
      setProveedoresFiltrados(filtrados);
    }
  }, [busquedaProveedores, proveedores]);

  // Función para obtener URL de imagen
  const getImageUrl = (producto) => {
    const imagenField = producto.Imagen_producto || producto.imagen || producto.Imagen || producto.image;
    if (!imagenField) return null;
    if (imagenField.startsWith('http')) return imagenField;
    if (imagenField.includes('/uploads/')) return `${BASE_URL}${imagenField}`;
    return `${BASE_URL}/uploads/${imagenField}`;
  };

  // Componente de imagen
  const ProductImage = ({ producto, size = 70 }) => {
    const imageUrl = getImageUrl(producto);
    const borderRadius = size / 2;

    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.productImage, { width: size, height: size, borderRadius }]}
          contentFit="cover"
          onError={(error) => console.log("Error imagen:", imageUrl)}
        />
      );
    }

    return (
      <View style={[styles.productImage, styles.placeholderImage, { width: size, height: size, borderRadius }]}>
        <Text style={styles.placeholderText}>📦</Text>
      </View>
    );
  };

  // Agregar al carrito
  const agregarAlCarrito = (producto) => {
    const cantidadStr = cantidades[producto.id] || "";
    const cantidad = parseInt(cantidadStr, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      Alert.alert("Cantidad inválida", "Debe ingresar un número mayor a 0");
      return;
    }

    const stock = producto.stock || producto.Kilogramos || producto.Libras || 0;
    if (cantidad > stock) {
      Alert.alert("Stock insuficiente", `Solo hay ${stock} unidades disponibles`);
      return;
    }

    const item = {
      id: producto.id,
      nombre: producto.Nombre_producto,
      tipo: producto.tipo_producto,
      codigo: producto.Codigo_de_barras || "N/A",
      imagen: producto.Imagen_producto || null,
      stock,
      cantidad,
      precio: producto.precio || producto.Precio_kilogramo || producto.Precio_libras || 0,
      descuento: 0,
      id_proveedor: selectedProveedor.id,
      nombre_empresa: selectedProveedor.nombre_empresa,
    };

    setCarrito((prev) => {
      const existe = prev.find(p => p.id === item.id);
      if (existe) {
        const nuevaCantidad = existe.cantidad + cantidad;
        if (nuevaCantidad > stock) {
          Alert.alert("Stock insuficiente", `Solo hay ${stock} unidades`);
          return prev;
        }
        return prev.map(p => p.id === item.id ? { ...p, cantidad: nuevaCantidad } : p);
      }
      return [...prev, item];
    });

    setCantidades(prev => ({ ...prev, [producto.id]: "" }));
    Alert.alert("✅ Agregado", `${item.nombre} al carrito`);
  };

  // Funciones del carrito
  const cambiarCantidad = (id, nuevaCantidadStr) => {
    const nuevaCantidad = parseInt(nuevaCantidadStr, 10) || 1;
    const item = carrito.find(p => p.id === id);
    if (item && nuevaCantidad > item.stock) {
      Alert.alert("Stock insuficiente", `Solo hay ${item.stock} unidades`);
      return;
    }
    setCarrito(prev => prev.map(p => p.id === id ? { ...p, cantidad: nuevaCantidad } : p));
  };

  const cambiarDescuento = (id, descuentoStr) => {
    const descuento = parseFloat(descuentoStr) || 0;
    setCarrito(prev => prev.map(p => p.id === id ? { ...p, descuento } : p));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, p) => {
      const subtotal = p.cantidad * p.precio;
      const descuento = (subtotal * p.descuento) / 100;
      return acc + (subtotal - descuento);
    }, 0);
  };

  const calcularTotalItems = () => {
    return carrito.reduce((acc, p) => acc + p.cantidad, 0);
  };

  // Función para obtener URL de imagen del proveedor
  const getProveedorImageUrl = (proveedor) => {
    const imagenField = proveedor.imagen_empresa || proveedor.imagen || null;
    if (!imagenField) return null;
    if (imagenField.startsWith('http')) return imagenField;
    if (imagenField.includes('/uploads/')) return `${BASE_URL}${imagenField}`;
    return `${BASE_URL}/uploads/${imagenField}`;
  };

  // Componente de imagen de proveedor
  const ProveedorImage = ({ proveedor, size = 60 }) => {
    const imageUrl = getProveedorImageUrl(proveedor);
    const borderRadius = size / 2;

    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.proveedorImage, { width: size, height: size, borderRadius }]}
          contentFit="cover"
          onError={(error) => console.log("Error cargando imagen de proveedor:", imageUrl)}
        />
      );
    }

    return (
      <View style={[
        styles.proveedorImage,
        styles.proveedorPlaceholderImage,
        { width: size, height: size, borderRadius }
      ]}>
        <Text style={styles.proveedorPlaceholderText}>🏢</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#ffffff", "#f0f9f4", "#c8e6c9"]} style={styles.container}>
      <Text style={styles.title}> Ventas a Proveedores</Text>

      {/* Botón para regresar a Ventas Cliente */}
      <TouchableOpacity
        style={styles.proveedoresButton}
        onPress={() => router.push('/Pages/Ventas/ventasCliente')}
      >
        <Text style={styles.proveedoresButtonText}> Ir a Ventas Clientes</Text>
      </TouchableOpacity>

      {/* Selección de proveedor */}
      {!selectedProveedor ? (
        <>
          <Text style={styles.subtitle}>Seleccione un proveedor:</Text>

          {/* Barra de búsqueda para proveedores */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Buscar proveedor..."
              value={busquedaProveedores}
              onChangeText={setBusquedaProveedores}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          ) : proveedores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay proveedores disponibles</Text>
            </View>
          ) : (
            <FlatList
              data={proveedoresFiltrados}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item: proveedor }) => (
                <TouchableOpacity
                  style={styles.proveedorItem}
                  onPress={() => {
                    setSelectedProveedor(proveedor);
                    fetchProductosPorProveedor(proveedor.id);
                  }}
                >
                  <ProveedorImage proveedor={proveedor} size={60} />
                  <View style={styles.proveedorInfoContainer}>
                    <Text style={styles.proveedorNombre}>{proveedor.nombre_empresa}</Text>
                    
                    <View style={styles.proveedorDetail}>
                      <Text style={styles.proveedorDetailIcon}>👤</Text>
                      <Text>{proveedor.nombre_representante} {proveedor.apellido_representante}</Text>
                    </View>
                    
                    <View style={styles.proveedorDetail}>
                      <Text style={styles.proveedorDetailIcon}>📞</Text>
                      <Text>{proveedor.numero_empresarial}</Text>
                    </View>
                    
                    <View style={styles.proveedorDetail}>
                      <Text style={styles.proveedorDetailIcon}>✉️</Text>
                      <Text numberOfLines={1} ellipsizeMode="tail">
                        {proveedor.correo_empresarial}
                      </Text>
                    </View>
                    
                    <View style={styles.proveedorDetail}>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </>
      ) : (
        <>
          {/* Mostrar proveedor seleccionado */}
          <View style={styles.selectedProveedorHeader}>
            <Text style={styles.selectedProveedorText}>
               Proveedor: <Text style={{ fontWeight: "bold" }}>{selectedProveedor.nombre_empresa}</Text>
            </Text>
            <TouchableOpacity onPress={() => setSelectedProveedor(null)}>
              <Text style={styles.cambiarProveedorBtn}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda de productos */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder=" Buscar productos..."
              value={busqueda}
              onChangeText={setBusqueda}
            />
          </View>

          {/* Botón carrito */}
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
                {busqueda ? "No se encontraron productos" : "No hay productos para este proveedor"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={productosFiltrados}
              keyExtractor={(item) => String(item.id || item.Codigo_de_barras || Math.random())}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.imageContainer}>
                      <ProductImage producto={item} size={70} />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.name}>{item.Nombre_producto}</Text>
                      <Text style={styles.infoText}>Tipo: {item.tipo_producto}</Text>
                      <Text style={styles.infoText}>Código: {item.Codigo_de_barras || "N/A"}</Text>
                      <Text style={styles.infoText}>
                        Stock: {item.stock || item.Kilogramos || item.Libras || 0}
                      </Text>
                      <Text style={styles.priceText}>
                        Precio: ${item.precio || item.Precio_kilogramo || item.Precio_libras || "N/A"}
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
                        setCantidades(prev => ({ ...prev, [item.id]: cleaned }));
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
        </>
      )}

      {/* Modal del Carrito */}
      <Modal
        animationType="slide"
        transparent
        visible={modalCarritoVisible}
        onRequestClose={() => setModalCarritoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🛍️ Carrito de Compras</Text>
              <TouchableOpacity onPress={() => setModalCarritoVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={carrito}
              keyExtractor={(item) => String(item.id)}
              style={styles.modalContent}
              renderItem={({ item }) => {
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
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.cartItemImage}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={[styles.cartItemImage, styles.placeholderImage]}>
                          <Text style={styles.placeholderTextSmall}>📦</Text>
                        </View>
                      )}
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartText}>{item.nombre}</Text>
                        <Text style={styles.cartSubtext}>
                          ${item.precio.toFixed(2)} c/u • {item.nombre_empresa}
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
              }}
            />

            <View style={styles.modalFooter}>
              <Text style={styles.totalText}>💰 Total: ${calcularTotal().toFixed(2)}</Text>
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

export default VentasProveedores;