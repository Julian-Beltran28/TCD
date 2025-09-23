# 🔧 GUÍA RÁPIDA PARA ACTUALIZAR PANTALLAS AL SISTEMA DE LOADING

## 📝 **PASOS PARA MIGRAR CUALQUIER PANTALLA:**

### 1. **Actualizar Imports:**
```jsx
// ❌ ANTES
import { useRouter, useFocusEffect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

// ✅ DESPUÉS
import { useFocusEffect } from 'expo-router';
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';
import { View, Text } from 'react-native'; // Eliminar ActivityIndicator
```

### 2. **Actualizar Hook y Estado:**
```jsx
// ❌ ANTES
const [loading, setLoading] = useState(false);
const router = useRouter();

// ✅ DESPUÉS
const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();
```

### 3. **Actualizar Fetch Functions:**
```jsx
// ❌ ANTES
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar los datos');
  } finally {
    setLoading(false);
  }
};

// ✅ DESPUÉS
const fetchData = useCallback(async () => {
  showLoading("Cargando datos...");
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar los datos');
  } finally {
    hideLoading();
  }
}, [showLoading, hideLoading]);
```

### 4. **Actualizar useEffect y useFocusEffect:**
```jsx
// ❌ ANTES
useFocusEffect(
  useCallback(() => {
    fetchData();
  }, [])
);

// ✅ DESPUÉS
useFocusEffect(
  useCallback(() => {
    fetchData();
  }, [fetchData])
);
```

### 5. **Eliminar Loading UI Local:**
```jsx
// ❌ ANTES - ELIMINAR ESTO
if (loading) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text>Cargando...</Text>
    </View>
  );
}

// ✅ DESPUÉS - No es necesario, se maneja globalmente
```

### 6. **Actualizar Navegación:**
```jsx
// ❌ ANTES
router.push('/ruta');
router.replace('/ruta');
router.push({ pathname: '/ruta', params: { id: 1 } });

// ✅ DESPUÉS
navigateWithLoading('/ruta', 'Cargando...');
replaceWithLoading('/ruta', 'Cargando...');
navigateWithLoading({ pathname: '/ruta', params: { id: 1 } }, 'Cargando...');
```

### 7. **Actualizar Operaciones Asíncronas:**
```jsx
// ❌ ANTES
const deleteItem = async (id) => {
  setLoading(true);
  try {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    Alert.alert('Éxito', 'Item eliminado');
    fetchData();
  } catch (error) {
    Alert.alert('Error', 'No se pudo eliminar');
  } finally {
    setLoading(false);
  }
};

// ✅ DESPUÉS
const deleteItem = async (id) => {
  showLoading("Eliminando...");
  try {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    Alert.alert('Éxito', 'Item eliminado');
    await fetchData();
  } catch (error) {
    Alert.alert('Error', 'No se pudo eliminar');
    hideLoading();
  }
};
```

## 🎯 **EJEMPLO COMPLETO - ANTES Y DESPUÉS:**

### ❌ **ANTES (Sistema Antiguo):**
```jsx
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

const MyScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => router.push('/add')}>
        <Text>Agregar</Text>
      </TouchableOpacity>
      <FlatList data={data} renderItem={({item}) => <Text>{item.name}</Text>} />
    </View>
  );
};
```

### ✅ **DESPUÉS (Sistema Global):**
```jsx
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

const MyScreen = () => {
  const [data, setData] = useState([]);
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

  const fetchData = useCallback(async () => {
    showLoading("Cargando datos...");
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <View>
      <TouchableOpacity onPress={() => navigateWithLoading('/add', 'Cargando formulario...')}>
        <Text>Agregar</Text>
      </TouchableOpacity>
      <FlatList data={data} renderItem={({item}) => <Text>{item.name}</Text>} />
    </View>
  );
};
```

## 🚀 **¡LISTO! AHORA APLICA ESTOS CAMBIOS A TODAS LAS PANTALLAS**