import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DetallesProducto() {
  const params = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Detalles del Producto</Text>
      <Text>ID: {params.id || params.Id || params.ID || "-"}</Text>
      {/* Aquí puedes mostrar más detalles usando los params o hacer un fetch por ID */}
    </View>
  );
}
