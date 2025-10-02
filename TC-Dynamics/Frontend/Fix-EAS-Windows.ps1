# Script para configurar permanentemente el entorno de EAS CLI en Windows
# Ejecutar como Administrador: PowerShell -ExecutionPolicy Bypass -File "Fix-EAS-Windows.ps1"

Write-Host "========================================" -ForegroundColor Green
Write-Host "    Configuración EAS CLI para Windows"  -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar si se ejecuta como administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  ADVERTENCIA: No se está ejecutando como administrador" -ForegroundColor Yellow
    Write-Host "   Algunas configuraciones del sistema podrían no aplicarse" -ForegroundColor Yellow
    Write-Host ""
}

# Configurar variables de entorno del usuario
Write-Host "🔧 Configurando variables de entorno..." -ForegroundColor Cyan

# COMSPEC
$comspecPath = "C:\WINDOWS\system32\cmd.exe"
if (Test-Path $comspecPath) {
    [Environment]::SetEnvironmentVariable("COMSPEC", $comspecPath, "User")
    Write-Host "✅ COMSPEC configurado: $comspecPath" -ForegroundColor Green
} else {
    Write-Host "❌ No se encontró cmd.exe en la ruta esperada" -ForegroundColor Red
}

# SystemRoot
$systemRoot = "C:\WINDOWS"
if (Test-Path $systemRoot) {
    [Environment]::SetEnvironmentVariable("SystemRoot", $systemRoot, "User")
    Write-Host "✅ SystemRoot configurado: $systemRoot" -ForegroundColor Green
} else {
    Write-Host "❌ No se encontró el directorio de Windows" -ForegroundColor Red
}

# Agregar rutas del sistema al PATH del usuario
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$systemPaths = @(
    "C:\WINDOWS\system32",
    "C:\WINDOWS",
    "C:\WINDOWS\System32\Wbem"
)

$pathModified = $false
foreach ($systemPath in $systemPaths) {
    if (Test-Path $systemPath) {
        if ($currentPath -notlike "*$systemPath*") {
            $currentPath = "$currentPath;$systemPath"
            $pathModified = $true
            Write-Host "✅ Agregado al PATH: $systemPath" -ForegroundColor Green
        } else {
            Write-Host "ℹ️  Ya existe en PATH: $systemPath" -ForegroundColor Blue
        }
    }
}

if ($pathModified) {
    [Environment]::SetEnvironmentVariable("PATH", $currentPath, "User")
    Write-Host "✅ PATH actualizado" -ForegroundColor Green
}

Write-Host ""

# Configurar EAS específicamente
Write-Host "🎯 Configurando EAS CLI..." -ForegroundColor Cyan

# Variables específicas para EAS
[Environment]::SetEnvironmentVariable("EAS_NO_VCS", "0", "User")
[Environment]::SetEnvironmentVariable("FORCE_COLOR", "1", "User")

Write-Host "✅ Variables EAS configuradas" -ForegroundColor Green
Write-Host ""

# Crear script de conveniencia
$easyBuildScript = @"
@echo off
echo ========================================
echo    TC-Dynamics Build (Solucion cmd.exe)
echo ========================================
echo.

cd /d "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TC-Dynamics\Frontend"

echo ✅ El warning 'spawn cmd.exe ENOENT' es normal y seguro
echo 🚀 Iniciando build...
echo.

eas build --platform android --profile preview --non-interactive

if errorlevel 1 (
    echo.
    echo ❌ Build falló, intentando modo interactivo...
    eas build --platform android --profile preview
)

echo.
echo ✅ Revisa tu panel de Expo para descargar el APK:
echo 🔗 https://expo.dev/accounts/samu37/projects/tc-dynamics-fresh/builds
echo.
pause
"@

$scriptPath = "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TC-Dynamics\Frontend\build-tc-dynamics.bat"
$easyBuildScript | Out-File -FilePath $scriptPath -Encoding ASCII

Write-Host "📝 Script de conveniencia creado:" -ForegroundColor Cyan
Write-Host "   $scriptPath" -ForegroundColor Blue
Write-Host ""

# Instrucciones finales
Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Reinicia PowerShell para aplicar los cambios" -ForegroundColor White
Write-Host "   2. Navega al directorio Frontend" -ForegroundColor White
Write-Host "   3. Ejecuta: eas build --platform android --profile preview" -ForegroundColor White
Write-Host "   4. O ejecuta el script: build-tc-dynamics.bat" -ForegroundColor White
Write-Host ""
Write-Host "ℹ️  El warning sobre cmd.exe ENOENT seguirá apareciendo pero es seguro ignorarlo" -ForegroundColor Blue
Write-Host "   EAS CLI funcionará correctamente a pesar del warning" -ForegroundColor Blue

Read-Host "Presiona Enter para continuar"