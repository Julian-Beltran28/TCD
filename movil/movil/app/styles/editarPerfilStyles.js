import { StyleSheet } from "react-native";

// 🎨 Colores
export const colors = {
  verdeOscuro: "#1b4332",
  verdeClaro: "#7df1c4",
  verdeMedio: "#46886f",
  rojo: "#c62828",
};

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },

  error: {
    fontSize: 16,
    color: "red",
  },

  // 🔹 Botones estilo Perfil.jsx
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  buttonGuardar: {
    backgroundColor: "transparent",
    borderColor: colors.verdeOscuro,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10, // espacio entre botones
    alignItems: "center",
  },

  buttonCancelar: {
    backgroundColor: "transparent",
    borderColor: colors.rojo,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  buttonTextGuardar: {
    color: colors.verdeOscuro,
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonTextCancelar: {
    color: colors.rojo,
    fontWeight: "bold",
    fontSize: 16,
  },
});
