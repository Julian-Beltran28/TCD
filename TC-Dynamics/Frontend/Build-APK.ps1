# Script PowerShell para construir APK de TC-Dynamics
param(
    [switch]$Verbose = $false
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "    TC-Dynamics EAS Build (PowerShell)"  -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Navegar al directorio correcto
$targetDir = "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TC-Dynamics\Frontend"
Set-Location $targetDir
Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Configurar variables de entorno
$env:FORCE_COLOR = "0"
$env:CI = "true"
$env:EAS_NO_VCS = "1"

Write-Host "⚙️ Configurando variables de entorno..." -ForegroundColor Cyan
Write-Host "   FORCE_COLOR = $env:FORCE_COLOR"
Write-Host "   CI = $env:CI" 
Write-Host "   EAS_NO_VCS = $env:EAS_NO_VCS"
Write-Host ""

# Verificar configuración de Expo
Write-Host "🔍 Verificando configuración de Expo..." -ForegroundColor Cyan
try {
    $config = & npx expo config --type public 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Configuración de Expo OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en configuración de Expo" -ForegroundColor Red
        Write-Host $config
    }
} catch {
    Write-Host "❌ Error ejecutando expo config: $_" -ForegroundColor Red
}
Write-Host ""

# Intentar build
Write-Host "🚀 Iniciando build de Android APK..." -ForegroundColor Cyan
Write-Host "📝 NOTA: El warning sobre cmd.exe se puede ignorar" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "🎯 Ejecutando: eas build --platform android --profile preview --non-interactive" -ForegroundColor Magenta
    
    # Usar cmd.exe directamente si está disponible
    $cmdPath = "${env:SystemRoot}\System32\cmd.exe"
    if (Test-Path $cmdPath) {
        Write-Host "✅ Usando cmd.exe en: $cmdPath" -ForegroundColor Green
        $result = & $cmdPath /c "eas build --platform android --profile preview --non-interactive" 2>&1
    } else {
        Write-Host "⚠️ cmd.exe no encontrado, usando PowerShell directamente" -ForegroundColor Yellow
        $result = & eas build --platform android --profile preview --non-interactive 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Build completado exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Revisa tu panel de Expo para descargar el APK:" -ForegroundColor Cyan
        Write-Host "🔗 https://expo.dev/accounts/samu37/projects/tc-dynamics-fresh/builds" -ForegroundColor Blue
    } else {
        Write-Host "❌ Error en el build (Código: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host $result
        
        Write-Host ""
        Write-Host "🔄 Intentando con método interactivo..." -ForegroundColor Yellow
        & eas build --platform android --profile preview
    }
} catch {
    Write-Host "❌ Error ejecutando build: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Script completado" -ForegroundColor Green
Read-Host "Presiona Enter para continuar"