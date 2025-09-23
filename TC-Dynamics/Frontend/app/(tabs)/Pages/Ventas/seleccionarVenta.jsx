import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';
import styles from "../../../styles/ventasStyle"; // ahora importa el nuevo archivo

const Ventas = () => {
  const { navigateWithLoading, replaceWithLoading, goBackWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Ventas</Text>

      {/* Botón Ventas Clientes */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateWithLoading("/(tabs, 'Navegando...', 500)/Pages/Ventas/ventasCliente")}
      >
        <Text style={styles.buttonText}> Ventas Clientes</Text>
      </TouchableOpacity>

      {/* Botón Ventas Proveedores */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateWithLoading("/(tabs, 'Navegando...', 500)/Pages/Ventas/ventasProveedores")}
      >
        <Text style={styles.buttonText}> Ventas Proveedores</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Ventas;
