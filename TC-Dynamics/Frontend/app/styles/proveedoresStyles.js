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

    toggleButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  backgroundGradient: {
    flex: 1,
    width: "100%",
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
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
});

export default styles;