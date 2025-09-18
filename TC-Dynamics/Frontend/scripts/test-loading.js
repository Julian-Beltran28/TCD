#!/usr/bin/env node

/**
 * Script para verificar que el sistema de loading esté funcionando
 * Ejecutar: node scripts/test-loading.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 VERIFICANDO SISTEMA DE LOADING...\n');

// Archivos críticos del sistema
const criticalFiles = [
  'context/LoadingContext.jsx',
  'components/Loading.jsx', 
  'hooks/useNavigationWithLoading.jsx',
  'app/_layout.jsx'
];

// Pantallas que deberían estar migradas
const migratedScreens = [
  'app/login.jsx',
  'app/(tabs)/logout.jsx',
  'app/(tabs)/Pages/Usuarios/listarUsuarios.jsx',
  'app/(tabs)/Pages/Categorias/listarCategorias.jsx'
];

function checkFileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${filePath}`);
  return exists;
}

function checkFileHasPattern(filePath, pattern, description) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasPattern = pattern.test(content);
    console.log(`  ${hasPattern ? '✅' : '❌'} ${description}`);
    return hasPattern;
  } catch (error) {
    console.log(`  ❌ Error leyendo archivo: ${error.message}`);
    return false;
  }
}

// Verificar archivos críticos
console.log('📁 ARCHIVOS CRÍTICOS DEL SISTEMA:');
const criticalFilesOk = criticalFiles.every(checkFileExists);

// Verificar integración en _layout.jsx
console.log('\n🔌 INTEGRACIÓN EN LAYOUT:');
checkFileHasPattern('app/_layout.jsx', /LoadingProvider/, 'LoadingProvider importado');
checkFileHasPattern('app/_layout.jsx', /<Loading visible={loading}/, 'Componente Loading renderizado');

// Verificar pantallas migradas
console.log('\n📱 PANTALLAS MIGRADAS:');
migratedScreens.forEach(screen => {
  if (checkFileExists(screen)) {
    checkFileHasPattern(screen, /useNavigationWithLoading/, 'Hook importado');
    checkFileHasPattern(screen, /(showLoading|navigateWithLoading)/, 'Funciones de loading usadas');
  }
});

// Buscar pantallas no migradas
console.log('\n🔍 PANTALLAS SIN MIGRAR:');
const pagesDir = path.join(process.cwd(), 'app', '(tabs)', 'Pages');

function findUnmigratedFiles(dir) {
  const unmigrated = [];
  
  if (!fs.existsSync(dir)) {
    console.log('❌ Directorio Pages no encontrado');
    return [];
  }
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.jsx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const hasOldSystem = /useState.*loading|useRouter/.test(content);
          const hasNewSystem = /useNavigationWithLoading/.test(content);
          
          if (hasOldSystem && !hasNewSystem) {
            const relativePath = path.relative(pagesDir, fullPath);
            unmigrated.push(relativePath);
          }
        } catch (_error) {
          // Ignorar errores de lectura
        }
      }
    });
  }
  
  traverse(dir);
  return unmigrated;
}

const unmigratedFiles = findUnmigratedFiles(pagesDir);

if (unmigratedFiles.length > 0) {
  unmigratedFiles.slice(0, 10).forEach(file => {
    console.log(`❌ ${file}`);
  });
  
  if (unmigratedFiles.length > 10) {
    console.log(`... y ${unmigratedFiles.length - 10} archivos más`);
  }
} else {
  console.log('✅ Todas las pantallas están migradas');
}

// Resumen final
console.log('\n📊 RESUMEN:');
console.log(`${criticalFilesOk ? '✅' : '❌'} Sistema base: ${criticalFilesOk ? 'OK' : 'FALTAN ARCHIVOS'}`);
console.log(`📱 Pantallas migradas: ${migratedScreens.length}`);
console.log(`⚠️  Pantallas sin migrar: ${unmigratedFiles.length}`);

if (criticalFilesOk && unmigratedFiles.length < migratedScreens.length) {
  console.log('\n🎉 ¡El sistema de loading está funcionando!');
  console.log('💡 Usa la guía MIGRATION_GUIDE.md para migrar las pantallas restantes');
} else {
  console.log('\n⚠️  El sistema necesita más trabajo');
  console.log('📖 Revisa los archivos marcados con ❌ arriba');
}

console.log('\n🔗 Archivos de ayuda:');
console.log('📚 MIGRATION_GUIDE.md - Guía paso a paso');
console.log('🧪 app/(tabs)/Pages/LoadingTest.jsx - Pantalla de pruebas');
console.log('🔧 DIAGNOSIS_LOADING_SYSTEM.md - Diagnóstico completo');