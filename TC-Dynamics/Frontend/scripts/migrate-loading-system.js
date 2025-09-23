#!/usr/bin/env node

/**
 * Script para automatizar la migración de pantallas al sistema de loading global
 * Actualiza automáticamente los patrones comunes en todos los archivos .jsx
 */

const fs = require('fs');
const path = require('path');

// Usar ruta relativa desde donde se ejecuta el script
const currentDir = process.cwd();
const baseDir = path.join(currentDir, 'app', '(tabs)', 'Pages');

// Patrones de reemplazo
const patterns = [
  {
    // 1. Reemplazar imports
    search: /import \{ useRouter(.*?) \} from "expo-router";/g,
    replace: `import { useFocusEffect } from "expo-router";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";`
  },
  {
    // 2. Eliminar ActivityIndicator de imports
    search: /import \{([^}]*), ActivityIndicator,([^}]*)\} from "react-native";/g,
    replace: 'import {$1,$2} from "react-native";'
  },
  {
    // 3. Reemplazar inicialización
    search: /const \[loading, setLoading\] = useState\([^)]*\);\s*const router = useRouter\(\);/g,
    replace: 'const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();'
  },
  {
    // 4. Reemplazar setLoading(true)
    search: /setLoading\(true\);/g,
    replace: 'showLoading("Cargando...");'
  },
  {
    // 5. Reemplazar setLoading(false)
    search: /setLoading\(false\);/g,
    replace: 'hideLoading();'
  },
  {
    // 6. Eliminar if (loading) blocks
    search: /if \(loading\) \{\s*return \(\s*<View[^>]*>\s*<ActivityIndicator[^>]*\/>\s*<Text[^>]*>[^<]*<\/Text>\s*<\/View>\s*\);\s*\}/g,
    replace: ''
  },
  {
    // 7. Reemplazar router.push()
    search: /router\.push\(([^)]+)\)/g,
    replace: 'navigateWithLoading($1, "Navegando...")'
  },
  {
    // 8. Reemplazar router.replace()
    search: /router\.replace\(([^)]+)\)/g,
    replace: 'replaceWithLoading($1, "Cargando...")'
  }
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Aplicar cada patrón
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern.search, pattern.replace);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

function findJsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && !item.includes('node_modules')) {
        traverse(fullPath);
      } else if (item.endsWith('.jsx') && !item.includes('Loading') && !item.includes('_layout')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

// Ejecutar el script
console.log('🚀 Iniciando migración automática...');
console.log(`📁 Buscando archivos en: ${baseDir}`);

if (fs.existsSync(baseDir)) {
  const jsxFiles = findJsxFiles(baseDir);
  console.log(`📄 Encontrados ${jsxFiles.length} archivos .jsx`);
  
  let updatedCount = 0;
  jsxFiles.forEach(file => {
    if (updateFile(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\n🎉 Migración completada!`);
  console.log(`📊 ${updatedCount} de ${jsxFiles.length} archivos actualizados`);
} else {
  console.error(`❌ Directorio no encontrado: ${baseDir}`);
}