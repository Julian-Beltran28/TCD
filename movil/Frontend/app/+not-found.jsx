import { Text, View } from 'react-native';
import React from 'react';

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Página no encontrada</Text>
      <Text style={{ marginTop: 8 }}>La ruta solicitada no existe.</Text>
    </View>
  );
}
