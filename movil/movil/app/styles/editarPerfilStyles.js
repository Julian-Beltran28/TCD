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
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },

  header: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    borderColor: "#000",
    borderWidth: 2,
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
    backgroundColor: colors.verdeMedio,
    borderColor: colors.verdeOscuro,
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
});