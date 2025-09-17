import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="Pages/Usuarios/listarUsuarios"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Pages/Proveedores/listarProveedores"
        options={{
          title: 'Proveedores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Pages/Categorias/listarCategorias"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size || 24} color={color} />
          ),
        }}
      />




      <Tabs.Screen
        name="Pages/Ventas/seleccionarVenta"
        options={{
          title: 'Ventas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size ?? 24} color={color} />
          ),
        }}
      />

            <Tabs.Screen
            name="Pages/Reportes/seleccionarReporte"
            options={{
              title: "Reportes",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart" size={size || 24} color={color} />
              ),
            }}
          />

      <Tabs.Screen
        name="Pages/Perfil/perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="power" size={size || 24} color={color} />
          ),
        }}
      />

      {/* Pantallas ocultas */}
      <Tabs.Screen name="Pages/Usuarios/modificarUsuario" options={{ href: null }} />
      <Tabs.Screen name="Pages/Usuarios/registrarUsuario" options={{ href: null }} />
      <Tabs.Screen name="Pages/Proveedores/modificarProveedor" options={{ href: null }} />
      <Tabs.Screen name="Pages/Proveedores/registrarProveedor" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/modificarCategoria" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/registrarCategoria" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/Sub-Categorias/listarSubcategorias" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/Sub-Categorias/modificarSubcategoria" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/Sub-Categorias/registrarSubcategoria" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/Sub-Categorias/Productos/listarProductos" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/Sub-Categorias/Productos/modificarProducto" options={{ href: null }} />
      <Tabs.Screen name="Pages/Categorias/Sub-Categorias/Productos/registrarProducto" options={{ href: null }} />
      <Tabs.Screen name="Pages/Perfil/editarPerfil" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="Pages/Ventas/ventasCliente" options={{ href: null }} />
      <Tabs.Screen name="Pages/Ventas/ventasProveedores" options={{ href: null }} />
      <Tabs.Screen name="Pages/Reportes/ventas" options={{ href: null }} />
      <Tabs.Screen name="Pages/Reportes/estadisticas" options={{ href: null }} />
      <Tabs.Screen name="Pages/Reportes/panelPrincipal" options={{ href: null }} />
    </Tabs>
  );
};

export default TabLayout;
