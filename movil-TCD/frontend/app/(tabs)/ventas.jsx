
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ListaProductos from '../../components/ventas/Lista_Productos';
import IngresoVentas from '../../components/ventas/Ingreso_ventas';

const Ventas = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <IngresoVentas />
        <ListaProductos />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32, 
  },
});

export default Ventas;