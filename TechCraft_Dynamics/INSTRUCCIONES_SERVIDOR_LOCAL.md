# 🚀 TechCraft Dynamics - Configuración Local

## Pasos para configurar el servidor local con MySQL

### 1. Configuración de Base de Datos MySQL

**Asegúrate de tener MySQL instalado y corriendo:**
- MySQL Server debe estar ejecutándose en el puerto 3306
- Usuario: `root`
- Contraseña: (la que configuraste o vacía)

**Configuración en .env:**
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SAOanime37*
DB_NAME=techCraft
FRONTEND_URL=http://localhost:5173
```

### 2. Crear la Base de Datos

**Opción A - Automática:**
```bash
cd "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Backend"
node setup-database.js
```

**Opción B - Manual:**
1. Abrir MySQL Workbench o línea de comandos de MySQL
2. Ejecutar el archivo: `Base de datos techCraft.sql`

### 3. Iniciar el Servidor Backend

**Opción A - PowerShell Script:**
```powershell
cd "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Backend"
.\Start-Server.ps1
```

**Opción B - Comando directo:**
```bash
cd "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Backend"
node index.js
```

**Opción C - Con npm:**
```bash
cd "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Backend"
npm start
```

### 4. Iniciar el Frontend

```bash
cd "C:\Users\ASUS\Downloads\TCD FINITY\TCD\TechCraft_Dynamics\Frontend"
npm run dev
```

### 5. Verificar que todo funciona

- **Backend:** http://localhost:4000
- **API Docs:** http://localhost:4000/api-docs  
- **Frontend:** http://localhost:5173
- **Test de DB:** `node test-db.js` en el directorio Backend

### 6. Solución al Error Original

El error `tcd-production.up.railway.app/api/login:1 Failed to load resource: net::ERR_FAILED` 
ya está solucionado porque:

✅ **Frontend configurado para usar servidor local:**
- `.env` → `VITE_API_URL=http://localhost:4000/api`
- `api.js` → `baseURL: 'http://localhost:4000'`

✅ **Backend configurado para MySQL local:**
- Conexión local en `models/conexion.js`
- Variables de entorno en `.env`

✅ **Warning de MySQL solucionado:**
- Removed `reconnect: true` from connection config

### 7. Estructura de URLs Locales

```
Backend API: http://localhost:4000/api/
├── /login
├── /usuarios  
├── /productos
├── /categorias
├── /subcategorias
├── /proveedores
├── /ventas
└── /perfil
```

### 8. Troubleshooting

**Si el servidor no inicia:**
1. Verificar que MySQL esté corriendo
2. Verificar credenciales en `.env`
3. Ejecutar `node test-db.js` para probar conexión

**Si el frontend no conecta:**
1. Verificar que el backend esté en http://localhost:4000
2. Revisar las URLs en `.env` y `api.js`
3. Verificar CORS en el backend

**Si hay errores de autenticación:**
1. Verificar que la tabla `usuarios` tenga datos
2. Comprobar que las contraseñas estén hasheadas correctamente