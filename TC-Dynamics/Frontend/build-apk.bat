@echo off
echo ========================================
echo    TC-Dynamics APK Builder
echo ========================================
echo.

REM Navegando al directorio del proyecto
cd /d "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TC-Dynamics\Frontend"

echo Directorio actual: %CD%
echo.

echo Opción 1: Construir usando EAS Build
echo --------------------------------------
echo 1. Instalando dependencias...
call npm install

echo.
echo 2. Verificando configuración...
call npx expo doctor

echo.
echo 3. Construyendo APK...
echo NOTA: Si EAS Build falla, usa la Opción 2
call eas build --platform android --profile preview

echo.
echo ========================================
echo ¡Build completado!
echo ========================================
echo.
echo El APK estará disponible en:
echo https://expo.dev/accounts/samu37/projects/tc-dynamics-fresh/builds
echo.
echo Tu aplicación mantendrá la conexión con Railway:
echo https://tcd-production.up.railway.app
echo.
pause