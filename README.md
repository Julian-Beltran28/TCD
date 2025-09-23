# 🐾 TechCraft Dynamics

**TechCraft Dynamics** es un sistema de gestión de inventario para la veterinaria *Mi Amigo Fiel*, diseñado para optimizar el control de productos, ventas, compras y proveedores, proporcionando reportes en tiempo real y automatización de procesos clave.

---

## 📋 Tabla de Contenidos

- [🧠 Descripción General](#-descripción-general)
- [🎯 Objetivos](#-objetivos)
- [📦 Funcionalidades Principales](#-funcionalidades-principales)
- [🧑‍💻 Roles de Usuario](#-roles-de-usuario)
- [⚙️ Tecnologías Usadas](#-tecnologías-usadas)
- [🛠️ Instalación](#️-instalación)
- [📱 React Native - Frontend Móvil](#-react-native---frontend-móvil)
- [📈 Requisitos](#-requisitos)
- [🧑‍🤝‍🧑 Autores](#-autores)
- [📃 Licencia](#-licencia)

---

## 🧠 Descripción General

Este software busca modernizar la gestión de inventario de una microempresa veterinaria mediante:

- Registro y seguimiento de productos
- Control de ventas y compras
- Manejo de proveedores
- Generación de reportes en PDF y gráficos
- Interfaz amigable con distintos niveles de acceso
- **Aplicación móvil nativa** para acceso desde dispositivos móviles

---

## 🎯 Objetivos

- Minimizar pérdidas por exceso o faltantes
- Automatizar tareas repetitivas
- Facilitar el acceso a datos para decisiones gerenciales
- Aumentar la eficiencia del personal y supervisión
- **Proporcionar acceso móvil** para gestión en tiempo real

---

## 📦 Funcionalidades Principales

- ✅ Inicio de sesión con autenticación segura
- 👥 Gestión de usuarios por rol (admin, supervisor, personal)
- 🛒 Módulo de ingreso de ventas con facturación
- 📦 Gestión de productos y categorías
- 🔎 Seguimiento de proveedores
- 📊 Generación de reportes y visualización de gráficos
- 📱 **Aplicación móvil nativa** con React Native + Expo

---

## 🧑‍💻 Roles de Usuario

| Rol        | Acciones principales                                        |
|------------|-------------------------------------------------------------|
| Admin      | Acceso total: crea, edita y elimina usuarios y productos    |
| Supervisor | Visualiza, comenta y reporta procesos                        |
| Personal   | Consulta productos y responde actividades                   |

---

## ⚙️ Tecnologías Usadas

### **Frontend Web**
- React, HTML5, CSS3, JavaScript

### **Frontend Móvil**
- React Native 0.81.4
- Expo SDK 54
- React Navigation
- Expo Router

### **Backend**
- Node.js, Express, MySQL
- Swagger para documentación de API

### **Base de Datos**
- MySQL

### **Hosting & Despliegue**
- Servidor con dominio propio
- Compatibilidad: Windows 11, Android, iOS

### **Herramientas Adicionales**
- Microsoft 365, antivirus, etc.

---

## 🛠️ Instalación

### **Backend**
```bash
# Clona el repositorio
git clone https://github.com/REDMAN8883/TCD.git
cd TCD

# Instala el backend y swagger
cd backend
npm install
npm install swagger-ui-express swagger-jsdoc

# Configura las variables de entorno .env (ver archivo .env.example)
# Asegúrate de tener una instancia de MySQL corriendo y configura la DB

# Ejecuta el backend
npm run dev
```

### **Frontend Web**
```bash
# Abre una nueva terminal para el frontend
cd ../frontend
npm install

# Ejecuta el frontend
npm run dev
```

---

## 📱 React Native - Frontend Móvil

### 🚀 **Configuración Inicial**

```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Navegar al directorio móvil
cd mobile

# Inicializar proyecto con template (si es necesario)
npx create-expo-app --template
```

### 📦 **Dependencias Principales**

#### **Core Framework**
```bash
# Expo Framework y React Native
expo: ^54.0.8
react: 19.1.0
react-native: 0.81.4
react-dom: 19.1.0
react-native-web: ^0.21.0
```

#### **Navegación**
```bash
npx expo install @react-navigation/native
npx expo install @react-navigation/bottom-tabs
npx expo install @react-navigation/elements
npx expo install expo-router
npx expo install react-native-screens
npx expo install react-native-safe-area-context
npx expo install react-native-gesture-handler
npx expo install react-native-reanimated
```

#### **UI y Efectos Visuales**
```bash
npx expo install expo-linear-gradient
npx expo install expo-blur
npx expo install @expo/vector-icons
npx expo install expo-symbols
npx expo install expo-haptics
```

#### **Manejo de Imágenes**
```bash
npx expo install expo-image-picker
npx expo install expo-image
```

#### **Almacenamiento y Datos**
```bash
npx expo install @react-native-async-storage/async-storage
npx expo install @react-native-picker/picker
npm install mysql2
```

#### **Utilidades del Sistema**
```bash
npx expo install expo-constants
npx expo install expo-font
npx expo install expo-splash-screen
npx expo install expo-status-bar
npx expo install expo-web-browser
npx expo install expo-linking
npx expo install react-native-webview
npx expo install react-native-worklets
```

### 💻 **Comandos de Desarrollo**

```bash
# Iniciar servidor de desarrollo
npx expo start

# Plataformas específicas
npx expo start --android
npx expo start --ios
npx expo start --web

# Limpiar caché
npx expo start --clear

# Construcción para producción
npx expo build:android
npx expo build:ios
npx expo export:web
```

### 🎯 **Funcionalidades Móviles Implementadas**

#### **Perfil de Usuario**
- ✅ Visualización y edición de datos de perfil
- ✅ Subida y cambio de imagen de perfil
- ✅ Lista desplegable para tipo de documento
- ✅ Campos de formulario estilizados
- ✅ Navegación fluida con BackButton

#### **Diseño y UI**
- ✅ Gradientes lineales personalizados
- ✅ Componentes estilizados con StyleSheet
- ✅ Imágenes circulares de perfil
- ✅ Scroll vertical optimizado
- ✅ Botones personalizados con efectos hápticos

#### **Gestión de Datos**
- ✅ Conexión con backend MySQL
- ✅ Almacenamiento local con AsyncStorage
- ✅ Subida de archivos con FormData
- ✅ Autenticación de usuarios
- ✅ Sincronización en tiempo real



### 🔧 **Configuraciones Especiales**

#### **Permisos Requeridos**
- ✅ Acceso a galería de fotos
- ✅ Acceso a cámara
- ✅ Almacenamiento local
- ✅ Conexión a internet



### 🎯 **Mejores Prácticas Móviles**
- Usar `npx expo install` para dependencias de Expo
- Limpiar caché con `--clear` cuando hay problemas
- Validar permisos antes de usar funcionalidades nativas
- Mantener formato consistente de colores hex (6 dígitos)

---

## 📈 Requisitos

### **Desarrollo**
- ✅ Mínimo 16 GB de RAM
- ✅ CPU AMD R7 7730U o equivalente
- ✅ Android Studio (para desarrollo móvil)
- ✅ Xcode (para iOS, solo macOS)

### **Producción**
- ✅ Disponibilidad del sistema: 99.9%
- ✅ Conectividad a internet estable
- ✅ Dispositivos móviles: Android 6.0+, iOS 12.0+

---

## 🧑‍🤝‍🧑 Autores

- **Brayan Stiven Herrera Mateus** – *Análisis y Diseño*
- **Samuel Cuida Esquivel** – *Desarrollo Frontend y Backend*
- **Julian Daniel Beltran Bustos** – *Documentación y desarrollo general*
- **Johan Daniel Miranda Moreno** – *Documentación y desarrollo general*

---

## 📃 Licencia

Este proyecto es propiedad de los autores mencionados. Para usos educativos, contactar previamente a los desarrolladores.

---

**Última actualización:** 22 de Septiembre, 2025  
**Versión:** 1.0.0  
**Plataformas:** Web, Android, iOS