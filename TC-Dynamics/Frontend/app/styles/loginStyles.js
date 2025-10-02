import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  loginCard: {
    backgroundColor: "#C8E6C9",
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#2E7D32",
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontSize: 15,
    color: "#424242",
  },

  passwordContainer: {
    position: "relative",
  },

  passwordInput: {
    paddingRight: 45,
  },

  eyeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },

  logoText: {
    color: "#A5D6A7",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});