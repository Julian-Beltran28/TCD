# 📱 Guía de Iconos para APK - TC-Dynamics

## 🎯 **Problema del Icono**

**PROBLEMA**: El APK no muestra el icono correcto (`icon.png`)
**CAUSA**: Android requiere configuración específica de iconos adaptativos

## ✅ **Solución Implementada**

### **Configuración Actualizada en `app.json`**:
```json
"android": {
  "icon": "./assets/images/icon.png",           // ← Icono principal agregado
  "adaptiveIcon": {
    "foregroundImage": "./assets/images/icon.png", // ← Usa el mismo icono
    "backgroundColor": "#4CAF50"                    // ← Color de marca verde
  }
}
```

## 📋 **Especificaciones de Iconos**

### **Icono Principal (`icon.png`)**:
- ✅ **Resolución recomendada**: 1024x1024 px
- ✅ **Formato**: PNG con transparencia
- ✅ **Ubicación**: `./assets/images/icon.png`

### **Icono Adaptativo Android**:
- ✅ **foregroundImage**: Usa el mismo `icon.png`
- ✅ **backgroundColor**: `#4CAF50` (verde TC-Dynamics)
- ✅ **Formato**: PNG transparente para mejor adaptación

## 🔄 **Proceso de Aplicación**

### **Para aplicar los cambios**:
1. **Generar nuevo APK** con configuración actualizada
2. **Android automáticamente** usará la configuración correcta
3. **El icono aparecerá** en el launcher del dispositivo

### **Comando para nuevo APK**:
```bash
cd "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TC-Dynamics\Frontend"
eas build --platform android --profile preview
```

## 🎨 **Mejoras Adicionales (Opcional)**

### **Si quieres un icono más optimizado**:

1. **Crear icono 512x512** específico para Android:
   - Fondo sólido (sin transparencia)
   - Elementos más grandes y legibles
   - Colores más contrastados

2. **Actualizar configuración**:
```json
"adaptiveIcon": {
  "foregroundImage": "./assets/images/android-icon.png",
  "backgroundColor": "#4CAF50"
}
```

## 📱 **Resultado Esperado**

### **En el APK**:
- ✅ **Icono visible** en el launcher de Android
- ✅ **Diseño correcto** con colores TC-Dynamics
- ✅ **Adaptativo** a diferentes formas de iconos (círculo, cuadrado, etc.)
- ✅ **Profesional** y reconocible

### **Iconos por Plataforma**:
- 📱 **Android**: Usa `adaptiveIcon` configuración
- 🍎 **iOS**: Usa `icon` principal
- 🌐 **Web**: Usa `favicon.png`

## 🚀 **Próximos Pasos**

1. **Compilar nuevo APK** con la configuración actualizada
2. **Instalar en dispositivo** para verificar el icono
3. **El icono aparecerá correctamente** en el launcher

**¡La configuración del icono está lista para el próximo build del APK!** 🎉