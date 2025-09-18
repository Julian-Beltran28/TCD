import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

const BackButton = ({ style }) => {
  const { goBackWithLoading } = useNavigationWithLoading();

  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={() => goBackWithLoading('Regresando...', 600)}
    >
      <Text style={styles.arrow}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BackButton;