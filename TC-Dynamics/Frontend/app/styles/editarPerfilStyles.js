import { StyleSheet } from "react-native";

// 🎨 Colores
export const colors = {
  verdeClaro: "#45c690",
  blanco: "#ffffff", 
  blancoMedio: "#ffffff",
  blancoHover: "#fbfffd",
  grisClaro: "#f3f4f6",
  grisBorde: "#d1d5db",
  rojo: "#c62828",
};

export const gradients = {
  verdeGradient: [colors.blanco, colors.blancoMedio, colors.verdeClaro],
  suaveGradient: ["#f8f9fa", "#e9ecef", "#dee2e6"],
  modernoGradient: ["#667eea", "#764ba2"],
  perfilGradient: [colors.verdeClaro, colors.blancoMedio],
};

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
    borderColor: "#000",
    borderWidth: 1,
  },

  header: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },

  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: 12,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 14,
    color: "#111",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 45,
  },
  inputValue: {
    fontSize: 16,
    color: "#333",
  },

  // Estilos para la lista desplegable.
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    minHeight: 45,
    justifyContent: "center",
  },
  picker: {
    fontSize: 16,
    color: "#333",
  },

  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },

  buttonGuardar: {
    backgroundColor: colors.verdeClaro,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
  },

  buttonCancelar: {
    backgroundColor: "transparent",
    borderColor: colors.rojo,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
  },

  buttonTextGuardar: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonTextCancelar: {
    color: colors.rojo,
    fontWeight: "bold",
    fontSize: 16,
  },

  // Estilos para imagen de perfil
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.verdeClaro,
    backgroundColor: "#f0f0f0",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.verdeClaro,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  imagePickerButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.verdeClaro,
    borderRadius: 20,
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});