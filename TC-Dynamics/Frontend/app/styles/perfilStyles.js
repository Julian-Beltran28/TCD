import { StyleSheet } from "react-native";

export const colors = {
  verdeClaro: "#45c690",
  blanco: "#ffffff",
  blancoMedio: "#ffffff",
  blancoHover: "#fbfffd",
  grisClaro: "#f3f4f6",
  grisBorde: "#d1d5db",
};

export const gradients = {

  verdeGradient: [colors.blanco, colors.blancoMedio, colors.verdeClaro],
  suaveGradient: ["#f8f9fa", "#e9ecef", "#dee2e6"],
  modernoGradient: ["#667eea", "#764ba2"],
  perfilGradient: [colors.verdeClaro, colors.blancoMedio],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  backgroundGradient: {
    flex: 1,
    width: "100%",
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
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    color: "#111",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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

  // Estilos para la imagen del perfil.
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#45c690",
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
    backgroundColor: "#45c690",
    borderRadius: 20,
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  buttonEditar: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000ff",
    backgroundColor: "#2eca3eff",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  buttonCerrarSesion: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000ff",
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  buttonText: {
    color: "#000000ff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;