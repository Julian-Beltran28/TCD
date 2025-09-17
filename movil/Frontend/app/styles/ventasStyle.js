import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centra vertical
    alignItems: "center", // centra horizontal
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#1a1a1a",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginVertical: 20,
    width: "85%", // ancho grande para que sean rectangulares
    alignItems: "center",
    elevation: 5, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
});
