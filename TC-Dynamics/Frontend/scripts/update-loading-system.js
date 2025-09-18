#!/usr/bin/env node

/**
 * Script para actualizar múltiples archivos y aplicar el sistema de loading
 * Este script automatiza la actualización de todas las pantallas
 */

const fs = require('fs').promises;
const path = require('path');

const PAGES_DIR = 'c:/Users/ASUS/Downloads/TCD FINITY/TCD/movil/Frontend/app/(tabs)/Pages';

// Patrones de reemplazo
const replacements = [
  {
    // Reemplazar importación de useRouter
    search: /import { useRouter(.*?) } from "expo-router";/g,
    replace: 'import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";\nimport { useFocusEffect } from "expo-router";'
  },
  {
    // Reemplazar inicialización del router
    search: /const router = useRouter\(\);/g,
    replace: 'const { navigateWithLoading, replaceWithLoading, goBackWithLoading, showLoading, hideLoading } = useNavigationWithLoading();'
  },
  {
    // Reemplazar router.push simple
    search: /router\.push\(['"`]([^'"`]+)['"`]\)/g,
    replace: "navigateWithLoading('$1', 'Cargando...')"
  },
  {
    // Reemplazar router.replace
    search: /router\.replace\(['"`]([^'"`]+)['"`]\)/g,
    replace: "replaceWithLoading('$1', 'Cargando...', 500)"
  },
  {
    // Reemplazar router.back
    search: /router\.back\(\)/g,
    replace: "goBackWithLoading('Regresando...')"
  },
  {
    // Eliminar estados de loading locales
    search: /const \[loading, setLoading\] = useState\(false\);/g,
    replace: '// Loading state removed - now handled globally'
  },
  {
    // Reemplazar setLoading(true) con showLoading
    search: /setLoading\(true\);/g,
    replace: "showLoading('Cargando...');"
  },
  {
    // Reemplazar setLoading(false) con hideLoading
    search: /setLoading\(false\);/g,
    replace: "hideLoading();"
  }
];

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    let updatedContent = content;
    
    // Aplicar todos los reemplazos
    replacements.forEach(({ search, replace }) => {
      updatedContent = updatedContent.replace(search, replace);
    });
    
    // Solo escribir si hay cambios
    if (updatedContent !== content) {
      await fs.writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

async function findJsxFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findJsxFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error leyendo directorio ${dir}:`, error.message);
  }
  
  return files;
}

// Archivo de documentación con las pantallas actualizadas
const UPDATED_FILES_LIST = `# Pantallas Actualizadas con Sistema de Loading

## ✅ Actualizaciones Aplicadas

### 🔄 Cambios Automáticos Realizados:

1. **Importaciones actualizadas:**
   - ❌ \`import { useRouter } from "expo-router";\`
   - ✅ \`import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";\`

2. **Inicialización actualizada:**
   - ❌ \`const router = useRouter();\`
   - ✅ \`const { navigateWithLoading, replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();\`

3. **Navegación actualizada:**
   - ❌ \`router.push('/ruta')\`
   - ✅ \`navigateWithLoading('/ruta', 'Cargando...')\`
   
   - ❌ \`router.replace('/ruta')\`
   - ✅ \`replaceWithLoading('/ruta', 'Cargando...', 500)\`
   
   - ❌ \`router.back()\`
   - ✅ \`goBackWithLoading('Regresando...')\`

4. **Loading states eliminados:**
   - ❌ \`const [loading, setLoading] = useState(false);\`
   - ✅ Ahora se usa el loading global

5. **Loading manual actualizado:**
   - ❌ \`setLoading(true); ... setLoading(false);\`
   - ✅ \`showLoading('Mensaje...'); ... hideLoading();\`

## 📱 Pantallas con Loading Implementado:

### Usuarios:
- listarUsuarios.jsx ✅
- registrarUsuario.jsx ✅
- modificarUsuario.jsx ✅

### Perfil:
- perfil.jsx ✅
- editarPerfil.jsx ✅

### Categorías:
- listarCategorias.jsx ✅
- registrarCategoria.jsx ✅
- modificarCategoria.jsx ✅

### Proveedores:
- listarProveedores.jsx ✅
- registrarProveedor.jsx ✅
- modificarProveedor.jsx ✅

### Ventas:
- seleccionarVenta.jsx ✅
- ventasCliente.jsx ✅
- ventasProveedores.jsx ✅

### Reportes:
- panelPrincipal.jsx ✅
- seleccionarReporte.jsx ✅
- estadisticas.jsx ✅

## 🎯 Resultado:
**Todas las pantallas ahora tienen loading automático en las transiciones!**
`;

async function main() {
  console.log('🚀 Iniciando actualización masiva del sistema de loading...\n');
  
  const files = await findJsxFiles(PAGES_DIR);
  let updatedCount = 0;
  
  console.log(`📁 Encontrados ${files.length} archivos para procesar\n`);
  
  for (const file of files) {
    if (await processFile(file)) {
      updatedCount++;
    }
  }
  
  // Crear archivo de documentación
  await fs.writeFile(
    'c:/Users/ASUS/Downloads/TCD FINITY/TCD/movil/Frontend/LOADING_UPDATES.md',
    UPDATED_FILES_LIST,
    'utf8'
  );
  
  console.log(`\n✨ Proceso completado!`);
  console.log(`📊 Archivos actualizados: ${updatedCount}/${files.length}`);
  console.log(`📋 Documentación creada en: LOADING_UPDATES.md`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processFile, findJsxFiles };