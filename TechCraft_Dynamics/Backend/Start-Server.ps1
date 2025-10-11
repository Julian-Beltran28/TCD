# PowerShell script para iniciar TechCraft Dynamics
Write-Host "🚀 Iniciando TechCraft Dynamics Local Server" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Navegar al directorio del backend
Set-Location "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Backend"
Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Yellow

# Verificar que existen los archivos necesarios
if (Test-Path "index.js") {
    Write-Host "✅ index.js encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ index.js NO encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json NO encontrado" -ForegroundColor Red
    exit 1
}

# Probar conexión a base de datos
Write-Host "`n🔍 Probando conexión a base de datos..." -ForegroundColor Cyan
node test-db.js

# Iniciar el servidor
Write-Host "`n🚀 Iniciando servidor..." -ForegroundColor Cyan
Write-Host "Para detener el servidor presiona Ctrl+C" -ForegroundColor Yellow
Write-Host "Servidor estará disponible en: http://localhost:4000" -ForegroundColor Green
Write-Host "Documentación API: http://localhost:4000/api-docs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

node index.js