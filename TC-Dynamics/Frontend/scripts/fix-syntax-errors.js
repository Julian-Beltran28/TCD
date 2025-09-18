const fs = require('fs');
const path = require('path');

// Configuración
const baseDir = path.join(process.cwd(), 'app', '(tabs)', 'Pages');

console.log('🔍 Buscando errores de sintaxis específicos en replaceWithLoading...');
console.log(`📁 Analizando: ${baseDir}\n`);

function findSyntaxErrors(filePath) {
  const relativePath = path.relative(baseDir, filePath);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasErrors = false;
  
  // Buscar el patrón problemático específico
  const problematicPattern = /replaceWithLoading\('\(tabs, '[^']+', \d+\)[^']*'\)/g;
  const matches = content.match(problematicPattern);
  
  if (matches && matches.length > 0) {
    console.log(`❌ ${relativePath}`);
    console.log(`   Errores encontrados: ${matches.length}`);
    matches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match}`);
    });
    console.log('');
    hasErrors = true;
  }
  
  return hasErrors;
}

function fixSyntaxErrors(filePath) {
  const relativePath = path.relative(baseDir, filePath);
  console.log(`🔧 Corrigiendo: ${relativePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Patrón para detectar y corregir el error específico
  const problematicPattern = /replaceWithLoading\('\(tabs, '([^']+)', (\d+)\)([^']*?)'\)/g;
  
  const fixedContent = content.replace(problematicPattern, (match, text, delay, path) => {
    console.log(`  ✅ Corrigiendo: ${match}`);
    const cleanPath = path.replace(/^\)/, ''); // Remover ) al inicio si existe
    const newCall = `replaceWithLoading('/(tabs)${cleanPath}', '${text}', ${delay})`;
    console.log(`  ➡️  Nuevo: ${newCall}`);
    changed = true;
    return newCall;
  });
  
  if (changed) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`  🎉 Archivo corregido\n`);
    return true;
  } else {
    console.log(`  ⏭️  Sin cambios necesarios\n`);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let errorFiles = [];
  let fixedFiles = [];
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const [errors, fixed] = walkDirectory(fullPath);
      errorFiles = errorFiles.concat(errors);
      fixedFiles = fixedFiles.concat(fixed);
    } else if (file.endsWith('.jsx')) {
      if (findSyntaxErrors(fullPath)) {
        errorFiles.push(fullPath);
        if (fixSyntaxErrors(fullPath)) {
          fixedFiles.push(fullPath);
        }
      }
    }
  });
  
  return [errorFiles, fixedFiles];
}

// Ejecutar análisis y corrección
console.log('🔍 FASE 1: DETECTANDO ERRORES\n');
const [errorFiles, fixedFiles] = walkDirectory(baseDir);

console.log('📊 RESUMEN:');
console.log(`❌ Archivos con errores encontrados: ${errorFiles.length}`);
console.log(`✅ Archivos corregidos: ${fixedFiles.length}`);

if (errorFiles.length === 0) {
  console.log('\n🎉 ¡No se encontraron errores de sintaxis!');
} else if (fixedFiles.length > 0) {
  console.log('\n🚀 ¡Errores de sintaxis corregidos exitosamente!');
  console.log('💡 La aplicación debería compilar correctamente ahora');
}

console.log('\n📝 Para verificar, ejecuta: npx expo start -c');