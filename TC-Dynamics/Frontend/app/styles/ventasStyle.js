// src/styles/ventasStyle.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#2e7d32",
  },

  // === Búsqueda ===
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    fontSize: 16,
  },

  // === Botones de navegación ===
  proveedoresButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  proveedoresButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },

  // === Carrito ===
  carritoButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  carritoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  // === Tarjetas de producto ===
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
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  placeholderImage: {
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 30,
  },
  placeholderTextSmall: {
    fontSize: 20,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1b5e20",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "white",
  },
  addButton: {
    backgroundColor: "#4CAF50", // ✅ Verde armonioso (solo una definición)
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // === Estados vacíos y carga ===
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  loader: {
    marginTop: 20,
  },

  // En src/styles/ventasStyle.js

  // === Selección de proveedor (MEJORADO) ===
  proveedorListContainer: {
    marginTop: 10,
  },
    // === Imagen de proveedor ===
  proveedorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#e0f2e9",
  },
  proveedorPlaceholderImage: {
    backgroundColor: "#f1f8e9",
    justifyContent: "center",
    alignItems: "center",
  },
  proveedorPlaceholderText: {
    fontSize: 24,
    color: "#81c784",
  },

  proveedorItem: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8f5e9",
  },

  proveedorIcon: {
    fontSize: 24,
    marginRight: 12,
    color: "#2e7d32",
  },
   proveedorInfoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  proveedorNombre: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 4,
  },
  selectedProveedorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  selectedProveedorText: {
    fontSize: 16,
    color: "#2e7d32",
    flex: 1,
  },
  cambiarProveedorBtn: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },

    proveedorDetail: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  proveedorDetailIcon: {
    marginRight: 6,
    fontSize: 14,
    color: "#4CAF50",
  },

  // === Modal del carrito ===
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f5f5f5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  modalContent: {
    padding: 16,
  },
  emptyCart: {
    padding: 40,
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 16,
    color: "#999",
  },
  cartItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cartItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  cartSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  cartItemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 12,
    marginRight: 4,
    color: "#666",
  },
  inputSmall: {
    width: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    borderRadius: 6,
    textAlign: "center",
    backgroundColor: "white",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  subtotalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "right",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f5f5f5",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#2e7d32",
  },
  finalizarButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  finalizarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});