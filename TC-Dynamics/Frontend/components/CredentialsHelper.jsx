import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CredentialsHelper = ({ onSelectCredentials }) => {
  const [showCredentials, setShowCredentials] = useState(false);

  const credentials = [
    { email: 'admin@admin.com', password: 'admin123', role: 'Administrador' },
    { email: 'super@admin.com', password: 'super123', role: 'Supervisor' },
    { email: 'staff@admin.com', password: 'staff123', role: 'Personal' }
  ];

  const selectCredential = (credential) => {
    Alert.alert(
      'Usar Credenciales de Prueba',
      `¿Deseas usar las credenciales de ${credential.role}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, usar', 
          onPress: () => {
            onSelectCredentials(credential.email, credential.password);
            setShowCredentials(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.helpButton}
        onPress={() => setShowCredentials(!showCredentials)}
      >
        <Text style={styles.helpButtonText}>
          {showCredentials ? '🙈 Ocultar' : '🔑 Credenciales de Prueba'}
        </Text>
      </TouchableOpacity>

      {showCredentials && (
        <View style={styles.credentialsContainer}>
          <Text style={styles.title}>👥 Usuarios de Prueba:</Text>
          {credentials.map((cred, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.credentialItem}
              onPress={() => selectCredential(cred)}
            >
              <Text style={styles.roleText}>{cred.role}</Text>
              <Text style={styles.emailText}>{cred.email}</Text>
              <Text style={styles.passwordText}>Contraseña: {cred.password}</Text>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.infoText}>
            💡 Toca cualquier opción para usar esas credenciales
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  helpButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  helpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  credentialsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  credentialItem: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  passwordText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default CredentialsHelper;