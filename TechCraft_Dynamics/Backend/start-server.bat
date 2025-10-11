@echo off
echo Iniciando servidor TechCraft Dynamics...
cd /d "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Backend"
echo Directorio actual: %CD%
echo Verificando MySQL...
node test-db.js
echo.
echo Iniciando servidor...
node index.js
pause