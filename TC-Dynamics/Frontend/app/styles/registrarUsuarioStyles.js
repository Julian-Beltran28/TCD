import { StyleSheet } from "react-native";

export const registrarUsuarioStyles = StyleSheet.create({
  // 📱 Contenedor principal con scroll
  container: {
    flexGrow: 1,
    backgroundColor: "#E8F5E9", // Verde menta claro
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // 🎯 Título principal
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20", // Verde oscuro
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },

  // 🏷️ Etiqueta para pickers
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#424242",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // 🔽 Contenedor del Picker
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // ✅ Botón de registro
  button: {
    backgroundColor: "#4CAF50", // Verde principal
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // 📋 Sección del formulario (opcional para agrupar campos)
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#C8E6C9",
  },

  // ℹ️ Texto informativo
  infoText: {
    backgroundColor: "#E3F2FD",
    color: "#1565C0",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    lineHeight: 18,
  },

  // ⚠️ Texto de campo requerido
  requiredText: {
    color: "#EF5350",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
});