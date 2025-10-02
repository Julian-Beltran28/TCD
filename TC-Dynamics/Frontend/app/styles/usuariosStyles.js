import { StyleSheet } from "react-native";

export const usuariosStyles = StyleSheet.create({
  // 📱 Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9", // Verde menta claro como en la referencia
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 🎯 Encabezado
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20", // Verde oscuro
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  // ➕ Botón agregar nuevo usuario
  newUserButton: {
    backgroundColor: "#4CAF50", // Verde principal
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  newUserText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // 🎴 Tarjeta de usuario
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50", // Borde verde como detalle
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // 👤 Información del usuario
  userInfo: {
    marginBottom: 15,
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  userEmail: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 5,
    paddingLeft: 5,
  },

  userRole: {
    fontSize: 14,
    color: "#2E7D32", // Verde medio
    fontWeight: "600",
    marginTop: 8,
    paddingLeft: 5,
  },

  // ✅ Badge de estado
  statusBadge: {
    backgroundColor: "#C8E6C9", // Verde menta
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },

  statusText: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "600",
  },

  // 🎯 Contenedor de acciones
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  // 🔘 Botones base
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ✏️ Botón editar
  editButton: {
    backgroundColor: "#4CAF50", // Verde principal
  },

  // 🗑️ Botón eliminar
  deleteButton: {
    backgroundColor: "#EF5350", // Rojo suave
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // 🔍 Input de búsqueda
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    color: "#424242",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // 😕 Mensaje cuando no hay resultados
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 30,
    fontStyle: "italic",
  },
});