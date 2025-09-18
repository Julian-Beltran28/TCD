#!/usr/bin/env node

/**
 * Script simplificado para migrar pantallas al sistema de loading global
 * Ejecutar desde la carpeta Frontend: node scripts/migrate-simple.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migración automática de Loading System...\n');

// Configuración
const PAGES_DIR = path.join(process.cwd(), 'app', '(tabs)', 'Pages');

// Patrones de reemplazo simples y seguros
const replacements = [
  {
    name: 'Import useRouter',
    from: /import \{ useRouter, useFocusEffect \} from ['"]expo-router['"];/g,
    to: `import { useFocusEffect } from 'expo-router';
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';`
  },
  {
    name: 'Remove ActivityIndicator import',
    from: /, ActivityIndicator/g,
    to: ''
  },
  {
    name: 'Replace router and loading state',
    from: /const \[loading, setLoading\] = useState\([^)]*\);\s*const router = useRouter\(\);/g,
    to: 'const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();'
  },
  {
    name: 'Replace setLoading(true)',
    from: /setLoading\(true\);/g,
    to: 'showLoading("Cargando...");'
  },
  {
    name: 'Replace setLoading(false)',
    from: /setLoading\(false\);/g,
    to: 'hideLoading();'
  }
];

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Aplicar reemplazos
    replacements.forEach(replacement => {
      const newContent = content.replace(replacement.from, replacement.to);
      if (newContent !== content) {
        console.log(`  ✅ ${replacement.name}`);
        content = newContent;
        hasChanges = true;
      }
    });
    
    // Guardar si hubo cambios
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

function findAndMigrateFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Directorio no encontrado: ${dir}`);
    return { total: 0, migrated: 0 };
  }
  
  let total = 0;
  let migrated = 0;
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.jsx') && !item.includes('Loading') && !item.includes('Test')) {
        total++;
        const relativePath = path.relative(PAGES_DIR, fullPath);
        console.log(`\n📄 Procesando: ${relativePath}`);
        
        if (migrateFile(fullPath)) {
          migrated++;
          console.log(`  🎉 Migrado exitosamente`);
        } else {
          console.log(`  ⏭️  Sin cambios necesarios`);
        }
      }
    });
  }
  
  processDirectory(dir);
  return { total, migrated };
}

// Ejecutar migración
console.log(`📁 Buscando archivos en: ${PAGES_DIR}\n`);

const result = findAndMigrateFiles(PAGES_DIR);

console.log(`\n🎯 RESUMEN DE MIGRACIÓN:`);
console.log(`📊 Total de archivos: ${result.total}`);
console.log(`✅ Archivos migrados: ${result.migrated}`);
console.log(`⏭️  Sin cambios: ${result.total - result.migrated}`);

if (result.migrated > 0) {
  console.log(`\n🚀 ¡Migración completada! Revisa las pantallas actualizadas.`);
  console.log(`💡 Puede que necesites ajustes manuales en algunos archivos.`);
} else {
  console.log(`\n✨ Todos los archivos ya están actualizados o no requieren cambios.`);
}

console.log(`\n📝 Para completar la migración, revisa el archivo MIGRATION_GUIDE.md`);