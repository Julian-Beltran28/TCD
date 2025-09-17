import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../../styles/ventasStyle"; // ahora importa el nuevo archivo

const Ventas = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Ventas</Text>

      {/* Botón Ventas Clientes */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Pages/Ventas/ventasCliente")}
      >
        <Text style={styles.buttonText}> Ventas Clientes</Text>
      </TouchableOpacity>

      {/* Botón Ventas Proveedores */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Pages/Ventas/ventasProveedores")}
      >
        <Text style={styles.buttonText}> Ventas Proveedores</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Ventas;
