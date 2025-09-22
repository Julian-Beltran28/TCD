# 📋 INSTALACIONES, LIBRERÍAS Y COMANDOS - TechCraft Dynamics

## 🚀 CONFIGURACIÓN INICIAL DEL PROYECTO

### Instalación de Expo CLI
```bash
npm install -g @expo/cli
```

### Inicialización del proyecto
```bash
npx create-expo-app --template
```

---

## 📦 DEPENDENCIAS PRINCIPALES INSTALADAS

### 🎯 **Core Dependencies**
```bash
# Expo Framework
expo: ^54.0.8

# React Native
react: 19.1.0
react-native: 0.81.4
react-dom: 19.1.0
react-native-web: ^0.21.0
```

### 🧭 **Navegación**
```bash
# Instalación de React Navigation
npx expo install @react-navigation/native
npx expo install @react-navigation/bottom-tabs
npx expo install @react-navigation/elements

# Expo Router (navegación basada en archivos)
npx expo install expo-router

# Dependencias de navegación
npx expo install react-native-screens
npx expo install react-native-safe-area-context
npx expo install react-native-gesture-handler
npx expo install react-native-reanimated
```

### 🎨 **UI y Efectos Visuales**
```bash
# Gradientes lineales
npx expo install expo-linear-gradient

# Efectos de desenfoque
npx expo install expo-blur

# Iconos vectoriales
npx expo install @expo/vector-icons

# Símbolos SF (iOS)
npx expo install expo-symbols

# Efectos hápticos
npx expo install expo-haptics
```

### 📸 **Manejo de Imágenes**
```bash
# Selector de imágenes (galería/cámara)
npx expo install expo-image-picker

# Componente optimizado para mostrar imágenes
npx expo install expo-image
```

### 🔧 **Componentes de Formulario**
```bash
# Selector desplegable (Picker)
npx expo install @react-native-picker/picker
```

### 💾 **Almacenamiento Local**
```bash
# AsyncStorage para datos locales
npx expo install @react-native-async-storage/async-storage
```

### 🌐 **Web y Enlaces**
```bash
# Navegador web integrado
npx expo install expo-web-browser

# Manejo de enlaces profundos
npx expo install expo-linking

# WebView para contenido web
npx expo install react-native-webview
```

### ⚙️ **Utilidades del Sistema**
```bash
# Constantes del dispositivo/app
npx expo install expo-constants

# Fuentes personalizadas
npx expo install expo-font

# Pantalla de splash
npx expo install expo-splash-screen

# Barra de estado
npx expo install expo-status-bar

# Worklets para animaciones
npx expo install react-native-worklets
```

### 🗄️ **Base de Datos**
```bash
# Cliente MySQL para Node.js
npm install mysql2
```

---

## 💻 COMANDOS DE DESARROLLO

### 🏁 **Comandos de Inicio**
```bash
# Iniciar servidor de desarrollo
npx expo start

# Iniciar en Android
npx expo start --android

# Iniciar en iOS
npx expo start --ios

# Iniciar en web
npx expo start --web

# Limpiar caché y reiniciar
npx expo start --clear
```

### 🔍 **Comandos de Análisis**
```bash
# Ejecutar linter
npx expo lint

# Verificar dependencias
npm audit

# Listar dependencias instaladas
npm list
```

### 🛠️ **Comandos de Construcción**
```bash
# Construir para producción (Android)
npx expo build:android

# Construir para producción (iOS)
npx expo build:ios

# Exportar para web
npx expo export:web
```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 📱 **Perfil de Usuario**
- ✅ Visualización de datos de perfil
- ✅ Edición de información personal
- ✅ Subida y cambio de imagen de perfil
- ✅ Campos con estilo de input (no editables en vista)
- ✅ Lista desplegable para tipo de documento (C.C, T.I, C.E)
- ✅ Scroll vertical en ambas pantallas
- ✅ Gradientes de fondo personalizados

### 🎨 **Diseño y UI**
- ✅ LinearGradient para fondos
- ✅ Componentes estilizados con StyleSheet
- ✅ Navegación con BackButton
- ✅ Imágenes circulares de perfil
- ✅ Campos de formulario consistentes
- ✅ Botones personalizados

### 📊 **Gestión de Datos**
- ✅ Conexión con backend MySQL
- ✅ Almacenamiento local con AsyncStorage
- ✅ Subida de archivos (imágenes) con FormData
- ✅ Autenticación de usuarios
- ✅ Actualización de perfiles

---

## 📁 ESTRUCTURA DE ARCHIVOS PRINCIPALES

```
Frontend/
├── app/
│   ├── (tabs)/
│   │   └── Pages/
│   │       └── Perfil/
│   │           ├── perfil.jsx
│   │           └── editarPerfil.jsx
│   └── styles/
│       ├── perfilStyles.js
│       └── editarPerfilStyles.js
├── components/
│   └── BackButton.jsx
├── hooks/
│   └── useNavigationWithLoading.js
└── package.json
```

---

## 🔧 CONFIGURACIONES ESPECIALES

### 📱 **Android Studio & Emulador**
```bash
# Verificar dispositivos Android
adb devices

# Reiniciar servidor ADB
adb kill-server
adb start-server

# Conectar dispositivo específico
adb connect <IP:PORT>
```

### 🎯 **Permisos Requeridos**
- ✅ Acceso a galería de fotos
- ✅ Acceso a cámara (opcional)
- ✅ Almacenamiento local
- ✅ Conexión a internet

---

## ⚠️ PROBLEMAS RESUELTOS

### 🐛 **Errores Corregidos**
1. **LinearGradient NullPointerException**: Colores hex con sufijo "ff" inválido
2. **ImagePicker deprecation**: MediaTypeOptions → MediaType
3. **Cannot read property 'map'**: LinearGradient sin propiedad colors
4. **Syntax errors**: Formatos de color incorrectos

### 🔧 **Soluciones Aplicadas**
- ✅ Formato de colores hex estándar (6 dígitos)
- ✅ Importaciones actualizadas de ImagePicker
- ✅ Propiedades obligatorias en LinearGradient
- ✅ Validación de tipos de datos

---

## 📝 NOTAS IMPORTANTES

### 🎯 **Mejores Prácticas**
- Usar `npx expo install` en lugar de `npm install` para dependencias de Expo
- Limpiar caché con `--clear` cuando hay problemas
- Validar permisos antes de usar funcionalidades nativas
- Mantener formato consistente de colores hex

### 🚀 **Próximos Pasos Sugeridos**
- Implementar notificaciones push
- Agregar más validaciones de formulario
- Optimizar imágenes automáticamente
- Implementar caché de imágenes mejorado

---

**Generado el:** 22 de Septiembre, 2025  
**Proyecto:** TechCraft Dynamics - Frontend Móvil  
**Framework:** React Native + Expo  
**Versión:** 1.0.0