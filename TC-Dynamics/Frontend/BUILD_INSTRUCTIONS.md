# Instrucciones para crear APK de TC-Dynamics

## 📱 Crear APK que mantiene conexión con Railway

### Opción 1: Usando EAS Build (Recomendado)

1. **Instalar EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Loguearse en Expo**:
   ```bash
   eas login
   ```

3. **Desde el directorio Frontend, construir el APK**:
   ```bash
   eas build --platform android --profile preview
   ```

4. **El APK se descargará automáticamente** una vez completado el build.

### Opción 2: Usando Expo Development Build

1. **Instalar Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```

2. **Construir para Android**:
   ```bash
   expo build:android -t apk
   ```

### Opción 3: Usando Android Studio (Para desarrolladores)

1. **Eject del proyecto Expo**:
   ```bash
   npx expo eject
   ```

2. **Abrir el proyecto en Android Studio** y construir el APK.

## 🔧 Configuración importante

### URL de la API
La aplicación está configurada para conectarse a Railway en:
- **URL de producción**: `https://tcd-production.up.railway.app`

Esta configuración se encuentra en:
- `app/login.jsx`
- `app/(tabs)/Pages/Proveedores/listarProveedores.jsx`
- `app/(tabs)/Pages/Categorias/listarCategorias.jsx`
- `app/(tabs)/Pages/Usuarios/listarUsuarios.jsx`

### Verificar conexión
Antes de crear el APK, asegúrate de que tu servidor en Railway esté funcionando:
```bash
curl https://tcd-production.up.railway.app/api/usuarios
```

## 📋 Requisitos del APK

- ✅ **Mantiene conexión con Railway**
- ✅ **Permisos de internet configurados**
- ✅ **Configuración de networking**
- ✅ **URLs de producción establecidas**

## 🚀 Después de construir el APK

1. **Descargar el APK** desde el link proporcionado por EAS
2. **Instalar en dispositivo Android**
3. **Verificar conectividad** abriendo la app y probando las funciones

## ⚠️ Notas importantes

- El APK mantendrá la conexión con Railway mientras el servidor esté activo
- No se necesita configuración adicional de red
- La app funcionará igual que en desarrollo, pero empaquetada para distribución