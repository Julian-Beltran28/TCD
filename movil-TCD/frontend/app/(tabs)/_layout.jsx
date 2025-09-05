import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Pantallas principales que aparecerán en el Layout de la app.
const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Fondo transparente en iOS para efecto blur
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ventas"
        options={{
          title: 'Ventas',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="card.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="proveedores"
        options={{
          title: 'Proveedores',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="building.2.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="logout"
        options={{
          title: 'Cerrar Sesión',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="power" color={color} />
          ),
        }}
      />

      {/* Pantallas ocultas (no aparecen en el TabBar son los linkeos dentro de los componentes) */}
      <Tabs.Screen name="modificarProveedor" options={{ href: null }} />
      <Tabs.Screen name="registrarProveedor" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="editar" options={{ href: null }} />
      <Tabs.Screen name="modificarCategoria" options={{ href: null }} />
      <Tabs.Screen name="registrarCategoria" options={{ href: null }} />
      <Tabs.Screen name="subcategorias" options={{ href: null }} />
      <Tabs.Screen name="modificarSubcategoria" options={{ href: null }} />
      <Tabs.Screen name="registrarSubcategoria" options={{ href: null }} />
      <Tabs.Screen name="productos" options={{ href: null }} />
      <Tabs.Screen name="modificarProducto" options={{ href: null }} />
      <Tabs.Screen name="registrarProducto" options={{ href: null }} />
      <Tabs.Screen name="detallesProducto" options={{ href: null }} />
      <Tabs.Screen name="editarPerfil" options={{ href: null }} />
    </Tabs>
  );
};

export default TabLayout;
