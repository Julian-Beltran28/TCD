import { StyleSheet } from "react-native";

export const modificarUsuarioStyles = StyleSheet.create({
  // 📱 Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9", // Verde menta claro
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 🎯 Encabezado
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20", // Verde oscuro
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },

  // 📝 Contenedor del formulario (tarjeta blanca)
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // 🏷️ Etiqueta del campo
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32", // Verde medio
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.3,
  },

  // ✏️ Input de texto
  input: {
    backgroundColor: "#F1F8E9", // Verde muy claro
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#424242",
    marginBottom: 8,
  },

  // 🎯 Contenedor de botones
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  // 💾 Botón guardar
  saveButton: {
    flex: 1,
    backgroundColor: "#4CAF50", // Verde principal
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  // ❌ Botón cancelar
  cancelButton: {
    flex: 1,
    backgroundColor: "#9E9E9E", // Gris
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  // 📝 Texto de los botones
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // ℹ️ Texto informativo al final
  infoText: {
    backgroundColor: "#E3F2FD", // Azul claro
    color: "#1565C0", // Azul oscuro
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    lineHeight: 20,
  },
});