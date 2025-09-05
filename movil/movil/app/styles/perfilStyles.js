import { StyleSheet } from "react-native";

export const colors = {
  verdeOscuro: "#1b4332",
  verdeClaro: "#7df1c4",
  verdeMedio: "#46886f",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
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
  // Botón Editar
  buttonEditar: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.verdeOscuro,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.verdeOscuro,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
