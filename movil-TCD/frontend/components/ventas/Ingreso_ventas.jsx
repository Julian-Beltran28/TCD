import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function IngresoVentas() {
  const navigation = useNavigation();

  const handlePuntoVentas = () => {
    navigation.navigate('PuntoVentas');
  };

  const handleCompras = () => {
    navigation.navigate('Compras');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contenidoPrincipal}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Ingresar ventas</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={handlePuntoVentas}
            activeOpacity={0.7}
          >
            <Icon name="shopping-cart" size={40} color="#ed9527" />
            <Text style={styles.cardTitle}>Punto de ventas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={handleCompras}
            activeOpacity={0.7}
          >
            <Icon name="inventory" size={40} color="#ed9527" />
            <Text style={styles.cardTitle}>Compras a proveedores</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor general
  container: {
    flex: 1,
    backgroundColor: 'rgb(241, 238, 238)',
    padding: 16,
    borderRadius: 13,
  },

  // Contenido principal
  contenidoPrincipal: {
    flex: 1,
    padding: 20,
  },

  // Título
  tituloContainer: {
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
  },
  titulo: {
    fontSize: 28,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#fff',
    backgroundColor: '#46886f',
  },

  // Contenedor de cards
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // si no caben, bajan
    justifyContent: 'space-between',
  },

  // Card
  card: {
    flex: 1, // cada tarjeta ocupa el mismo ancho
    backgroundColor: '#e8f5e9',
    borderTopWidth: 2,
    borderTopColor: '#46886f',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ed9527',
    marginTop: 8,
    textAlign: 'center',
  },
});
