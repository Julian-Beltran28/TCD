import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Siempre redirigir al login al abrir la app (sesión cerrada automáticamente)
    const timer = setTimeout(() => {
      console.log('🚀 App iniciada - redirigiendo al login (sesión automáticamente cerrada)...');
      router.replace('/login');
    }, 1500); // Mostrar splash por 1.5 segundos

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={['#4CAF50', '#45a049', '#2E7D32']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo o Icono */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>TC</Text>
          <Text style={styles.logoSubtext}>DYNAMICS</Text>
        </View>

        {/* Texto de carga */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>
            {'Iniciando aplicación...'}
          </Text>
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.versionText}>Versión 3.0.0</Text>
          <Text style={styles.subtitleText}>Sistema de Gestión Empresarial</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
    letterSpacing: 4,
    marginTop: -5,
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
    opacity: 0.9,
  },
  infoContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  versionText: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  subtitleText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default SplashScreen;