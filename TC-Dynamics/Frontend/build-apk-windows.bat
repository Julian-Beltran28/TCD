@echo off
setlocal

echo ========================================
echo    TC-Dynamics EAS Build Script
echo ========================================
echo.

REM Navegar al directorio correcto
cd /d "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TC-Dynamics\Frontend"
echo Directorio actual: %CD%
echo.

REM Configurar variables de entorno
set FORCE_COLOR=0
set CI=true
set EAS_NO_VCS=1

echo Configurando variables de entorno...
echo FORCE_COLOR=%FORCE_COLOR%
echo CI=%CI%
echo EAS_NO_VCS=%EAS_NO_VCS%
echo.

echo Verificando configuracion de Expo...
call npx expo config --type public
if errorlevel 1 (
    echo Error: No se pudo leer la configuracion de Expo
    pause
    exit /b 1
)
echo.

echo Iniciando build de Android APK...
echo NOTA: El warning sobre cmd.exe se puede ignorar
echo.

call eas build --platform android --profile preview --non-interactive
if errorlevel 1 (
    echo Error en el build
    echo.
    echo Intentando con metodo alternativo...
    call eas build --platform android --profile preview
) else (
    echo Build completado exitosamente!
    echo.
    echo Revisa tu panel de Expo para descargar el APK:
    echo https://expo.dev/accounts/samu37/projects/tc-dynamics-fresh/builds
)

echo.
pause