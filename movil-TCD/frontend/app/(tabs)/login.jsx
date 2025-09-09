    import React, { useState } from "react";
    import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
    import AsyncStorage from "@react-native-async-storage/async-storage";
    import { useRouter } from "expo-router";
    

    // ⚠️ Usa tu IP local si pruebas en dispositivo físico
    const API_URL = "http://10.174.105.127:3000/api/login";

    export default function LoginScreen() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const router = useRouter(); // navegación de expo-router

    const handleLogin = async () => {
        if (!correo || !contrasena) {
        Alert.alert("Error", "Por favor ingresa correo y contraseña");
        return;
        }

        try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contrasena }),
        });

        const data = await response.json();

        if (response.ok) {
            //  Guardamos token en AsyncStorage
            await AsyncStorage.setItem("token", data.token);

            Alert.alert("Bienvenido", data.usuario.nombre);

            //  Navegamos al tab de Ventas
            router.push("/ventas");
        } else {
            Alert.alert("Error", data.mensaje || "Credenciales inválidas");
        }
        } catch (error) {
        Alert.alert("Error de conexión", error.message);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
            style={styles.input}
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
        />

        <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        </View>
    );
    }

    // 🎨 Estilos
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    });
