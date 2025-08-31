import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../config/api"; // ✅ usamos la instancia de Axios

export default function ListaProductos() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const rol = user?.rol;
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [descuentos, setDescuentos] = useState({});
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [loading, setLoading] = useState(true);

  const productosPorPagina = 5;

  // 🔹 Obtener productos desde el backend
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoading(true);
        console.log("📡 Usando API base:", api.defaults.baseURL);
        const res = await api.get("/productos");
        setProductos(res.data);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        Alert.alert("Error", "No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  // 🔹 Funciones carrito
  const agregarAlCarrito = (prod) => {
    setCarrito((prev) => {
      const existente = prev[prod.id];
      return {
        ...prev,
        [prod.id]: {
          cantidad: existente
            ? existente.cantidad + (prod.tipo_producto === "gramaje" ? 100 : 1)
            : prod.tipo_producto === "gramaje"
            ? 100
            : 1,
          tipo: prod.tipo_producto,
        },
      };
    });
  };

  const eliminarDelCarrito = (prod) => {
    setCarrito((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[prod.id]) return prev;
      const resta = nuevo[prod.id].tipo === "gramaje" ? 100 : 1;
      const nuevaCant = (nuevo[prod.id].cantidad || 0) - resta;
      if (nuevaCant > 0) nuevo[prod.id].cantidad = nuevaCant;
      else delete nuevo[prod.id];
      return nuevo;
    });
  };

  const setCantidadManual = (prod, rawValue) => {
    const val = Number(rawValue);
    if (Number.isNaN(val)) return;
    setCarrito((prev) => {
      const nuevo = { ...prev };
      if (!val || val <= 0) {
        delete nuevo[prod.id];
        return nuevo;
      }
      nuevo[prod.id] = {
        tipo: prod.tipo_producto,
        cantidad: val,
      };
      return nuevo;
    });
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => {
      const nuevo = { ...prev };
      delete nuevo[id];
      return nuevo;
    });
  };

  // 🔹 Formato precio
  const formatearPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);

  const obtenerPrecio = (p) => {
    if (p.tipo_producto === "paquete") {
      return Number(p.precio) || 0;
    } else if (p.tipo_producto === "gramaje") {
      return Number(p.Precio_kilogramo) || Number(p.Precio_libras) || 0;
    }
    return 0;
  };

  // 🔹 URL de imágenes
  const getImagenUrl = (nombreImagen) =>
    nombreImagen
      ? `${api.defaults.baseURL.replace("/api", "")}/uploads/${nombreImagen}`
      : "https://via.placeholder.com/50";

  // 🔹 Filtros y paginación
  const productosFiltrados = productos.filter(
    (p) =>
      (p.Nombre_producto &&
        p.Nombre_producto.toLowerCase().includes(search.toLowerCase())) ||
      (p.Codigo_de_barras && p.Codigo_de_barras.includes(search))
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // 🔹 Totales carrito
  const totalCarrito = Object.entries(carrito).reduce((total, [id, obj]) => {
    const prod = productos.find((p) => p.id === parseInt(id));
    if (!prod) return total;
    const precio = obtenerPrecio(prod);
    const desc = descuentos[id] || 0;
    return total + precio * obj.cantidad * (1 - desc / 100);
  }, 0);

  const totalDescuento = Object.entries(carrito).reduce((total, [id, obj]) => {
    const prod = productos.find((p) => p.id === parseInt(id));
    if (!prod) return total;
    const precio = obtenerPrecio(prod);
    const desc = descuentos[id] || 0;
    return total + precio * obj.cantidad * (desc / 100);
  }, 0);

  const irAPago = () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión antes de pagar.");
      navigation.navigate("Login");
      return;
    }

    if (Object.keys(carrito).length === 0) {
      Alert.alert("Error", "Debe agregar productos al carrito antes de continuar.");
      return;
    }

    const rolNormalizado = rol?.toLowerCase();
    let routeName = "";

    if (rolNormalizado === "personal") {
      routeName = "StaffPago";
    } else if (["staff", "supervisor", "admin"].includes(rolNormalizado)) {
      routeName =
        rolNormalizado.charAt(0).toUpperCase() + rolNormalizado.slice(1) + "Pago";
    } else {
      Alert.alert("Error", "Rol de usuario desconocido. No se puede proceder al pago.");
      return;
    }

    setCargandoPago(true);

    setTimeout(() => {
      setCargandoPago(false);
      navigation.navigate(routeName, {
        carrito,
        descuentos,
        total: totalCarrito,
        totalDescuento,
        productos,
      });
    }, 1500);
  };

  // 🔹 Renderizar un producto
  const renderProducto = ({ item: p, index }) => (
    <View style={styles.productCard}>
      <Text style={styles.productIndex}>
        {(paginaActual - 1) * productosPorPagina + index + 1}
      </Text>

      <Image style={styles.productImage} source={{ uri: getImagenUrl(p.Imagen_producto) }} />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{p.Nombre_producto}</Text>
        <Text style={styles.productCode}>{p.Codigo_de_barras || "N/A"}</Text>

        {/* Cantidad */}
        <View style={styles.typeBadge}>
          {p.tipo_producto === "gramaje" ? (
            <TextInput
              style={styles.quantityInput}
              value={carrito[p.id]?.cantidad?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(val) => setCantidadManual(p, val)}
            />
          ) : (
            <Text style={styles.quantity}>{carrito[p.id]?.cantidad || 0}</Text>
          )}
        </View>

        <Text style={styles.price}>{formatearPrecio(obtenerPrecio(p))}</Text>
        <View
          style={[
            styles.stockBadge,
            p.stock < 10 ? styles.stockLow : styles.stockGood,
          ]}
        >
          <Text style={styles.stockText}>{p.stock}</Text>
        </View>

        {/* Controles */}
        {carrito[p.id] ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => eliminarDelCarrito(p)}
            >
              <Text style={styles.quantityBtnText}>-</Text>
            </TouchableOpacity>

            {p.tipo_producto === "gramaje" ? (
              <TextInput
                style={styles.quantityInput}
                value={carrito[p.id]?.cantidad?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(val) => setCantidadManual(p, val)}
              />
            ) : (
              <Text style={styles.quantity}>{carrito[p.id]?.cantidad}</Text>
            )}

            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => agregarAlCarrito(p)}
            >
              <Text style={styles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => agregarAlCarrito(p)}
          >
            <Icon name="add" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Agregar</Text>
          </TouchableOpacity>
        )}

        {carrito[p.id] && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => eliminarProducto(p.id)}
          >
            <Text style={styles.removeBtnText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // 🔹 Renderizar un item del carrito
  const renderCarritoItem = (id, obj) => {
    const producto = productos.find((p) => p.id === parseInt(id));
    if (!producto) return null;

    return (
      <View key={id} style={styles.carritoItem}>
        <View style={styles.carritoInfo}>
          <Text style={styles.carritoProducto}>{producto.Nombre_producto}</Text>
          <Text style={styles.carritoCantidad}>Cantidad: {obj.cantidad}</Text>
          <Text style={styles.carritoSubtotal}>
            {formatearPrecio(
              obtenerPrecio(producto) *
                obj.cantidad *
                (1 - (descuentos[id] || 0) / 100)
            )}
          </Text>
        </View>

        <View style={styles.carritoDescuento}>
          <Text style={styles.descuentoLabel}>Desc. %:</Text>
          <TextInput
            style={styles.descuentoInput}
            value={descuentos[id]?.toString() || ""}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={(value) => {
              const num = Math.min(100, Math.max(0, parseInt(value) || 0));
              setDescuentos({
                ...descuentos,
                [id]: num,
              });
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.carritoEliminar}
          onPress={() => eliminarProducto(producto.id)}
        >
          <Icon name="delete" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    );
  };

  // 🔹 Loading / pago
  if (cargandoPago) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Procesando pago...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  // 🔹 UI final
  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="shopping-cart" size={24} color="#007bff" />
          <Text style={styles.headerTitle}>Lista de Productos - Veterinaria</Text>
        </View>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>
            {Object.values(carrito).reduce((a, b) => a + (b.cantidad || 0), 0)} items
          </Text>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o código de barras..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {/* Lista productos */}
      <View style={styles.productsList}>
        <Text style={styles.sectionTitle}>Inventario</Text>
        <FlatList
          data={productosPagina}
          renderItem={renderProducto}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          }
        />
      </View>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.paginationBtn,
              paginaActual === 1 && styles.paginationBtnDisabled,
            ]}
            onPress={() => paginaActual > 1 && setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <Text style={styles.paginationBtnText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.paginationInfo}>
            {paginaActual} de {totalPaginas}
          </Text>

          <TouchableOpacity
            style={[
              styles.paginationBtn,
              paginaActual === totalPaginas && styles.paginationBtnDisabled,
            ]}
            onPress={() => paginaActual < totalPaginas && setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            <Text style={styles.paginationBtnText}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Carrito */}
      {Object.keys(carrito).length > 0 && (
        <View style={styles.carritoContainer}>
          <View style={styles.carritoHeader}>
            <Icon name="shopping-cart" size={20} color="#28a745" />
            <Text style={styles.carritoTitle}>Resumen del Carrito</Text>
          </View>

          <View style={styles.carritoContent}>
            {Object.entries(carrito).map(([id, obj]) =>
              renderCarritoItem(id, obj)
            )}

            <View style={styles.carritoTotales}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Descuento total:</Text>
                <Text style={styles.totalDescuento}>
                  -{formatearPrecio(totalDescuento)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelFinal}>TOTAL:</Text>
                <Text style={styles.totalFinal}>{formatearPrecio(totalCarrito)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.pagoBtn} onPress={irAPago}>
              <Icon name="payment" size={20} color="#fff" />
              <Text style={styles.pagoBtnText}>Proceder al pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgb(241, 238, 238)",
    padding: 24, // 1.5rem aprox
    borderRadius: 13,
    marginTop: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  cartBadge: {
    backgroundColor: "#fd7e14",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Buscador
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingLeft: 8,
  },

  // Lista productos
  productsList: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
    productCard: {
  flexDirection: "row",   // 👉 ahora en fila
  alignItems: "center",
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
  backgroundColor: "#fff",
  borderRadius: 8,
  marginVertical: 6,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
},
productImage: {
  width: 70,
  height: 70,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#54a183",
  backgroundColor: "#7df1c4",
  marginRight: 12,   // 👉 espacio entre img y texto
},
productInfo: {
  flex: 1,   // 👉 ocupa todo el espacio restante
},
productName: {
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: 2,
},
productCode: {
  fontSize: 12,
  fontStyle: "italic",
  color: "#087e04",
  marginBottom: 4,
},
typeBadge: {
  alignSelf: "flex-start",
  backgroundColor: "#7df1c4",
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 6,
  marginBottom: 6,
},
price: {
  fontSize: 16,
  fontWeight: "700",
  color: "#28a745",
  marginBottom: 4,
},
stockBadge: {
  alignSelf: "flex-start",
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 12,
  marginBottom: 6,
},
addBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#349771",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 6,
  marginTop: 6,
  alignSelf: "flex-start",
},
removeBtn: {
  alignSelf: "flex-start",
  backgroundColor: "#dc3545",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  marginTop: 6,
},


  removeBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Carrito
  carritoContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carritoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  carritoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28a745",
    marginLeft: 8,
  },
  carritoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  carritoProducto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  carritoCantidad: {
    fontSize: 14,
    color: "#666",
  },
  carritoSubtotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007bff",
  },
  pagoBtn: {
    backgroundColor: "#349771",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  pagoBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },

  // 👉 Paginación
pagination: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 20,
},
paginationBtn: {
  backgroundColor: "#076104FF",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 6,
  marginHorizontal: 8,
  minWidth: 40,
  alignItems: "center",
},
paginationBtnDisabled: {
  backgroundColor: "#ccc",
},
paginationBtnText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
},
paginationInfo: {
  marginHorizontal: 10,
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},
quantityControls: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
},
quantityBtn: {
  backgroundColor: "#076104",
  width: 32,
  height: 32,
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
},
quantityBtnText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
},
quantity: {
  marginHorizontal: 10,
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},
quantityInput: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  paddingHorizontal: 8,
  marginHorizontal: 10,
  minWidth: 60,
  textAlign: "center",
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},

});


