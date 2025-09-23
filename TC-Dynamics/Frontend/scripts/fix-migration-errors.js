const fs = require('fs');
const path = require('path');

// Configuración
const baseDir = path.join(process.cwd(), 'app', '(tabs)', 'Pages');

console.log('🔧 Iniciando corrección automática de errores de migración...');
console.log(`📁 Buscando archivos en: ${baseDir}\n`);

function fixMigrationErrors(filePath) {
  const relativePath = path.relative(baseDir, filePath);
  console.log(`📄 Procesando: ${relativePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  let changes = [];
  
  // 1. Verificar si tiene errores típicos de migración
  const hasErrors = content.includes('useRouter') && 
                   !content.includes('router.push') && 
                   !content.includes('router.replace') &&
                   content.includes('navigateWithLoading, replaceWithLoading, goBackWithLoading, showLoading, hideLoading');
  
  if (!hasErrors) {
    console.log('  ⏭️  Sin errores de migración detectados\n');
    return false;
  }
  
  // 2. Limpiar import de useRouter no usado
  if (content.includes('import { useLocalSearchParams, useRouter }')) {
    content = content.replace(
      /import { useLocalSearchParams, useRouter } from "expo-router";/g,
      'import { useLocalSearchParams } from "expo-router";'
    );
    changes.push('✅ Import de useRouter removido');
    changed = true;
  }
  
  // 3. Simplificar destructuring del hook
  const destructuringPattern = /const\s*{\s*navigateWithLoading,\s*replaceWithLoading,\s*goBackWithLoading,\s*showLoading,\s*hideLoading\s*}\s*=\s*useNavigationWithLoading\(\);/;
  if (destructuringPattern.test(content)) {
    content = content.replace(
      destructuringPattern,
      'const { replaceWithLoading, hideLoading } = useNavigationWithLoading();'
    );
    changes.push('✅ Hook destructuring optimizado');
    changed = true;
  }
  
  // 4. Corregir dependencias de useEffect
  // Buscar }, [id]); y }, [params.id]);
  if (content.includes('}, [id]);') && !content.includes('hideLoading')) {
    content = content.replace('}, [id]);', '}, [id, hideLoading]);');
    changes.push('✅ Dependencias de useEffect corregidas (id)');
    changed = true;
  }
  
  if (content.includes('}, [params.id]);') && !content.includes('[params.id, hideLoading]')) {
    content = content.replace('}, [params.id]);', '}, [params.id, hideLoading]);');
    changes.push('✅ Dependencias de useEffect corregidas (params.id)');
    changed = true;
  }
  
  // 5. Remover sección de loading local
  const loadingPattern = /\s*if\s*\(loading\)\s*{\s*return\s*\(\s*<View[^>]*>\s*<Text[^>]*>[^<]*<\/Text>\s*<\/View>\s*\);\s*}\s*/s;
  if (loadingPattern.test(content)) {
    content = content.replace(loadingPattern, '\n  ');
    changes.push('✅ Sección de loading local removida');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    changes.forEach(change => console.log(`  ${change}`));
    console.log('  🎉 Archivo corregido exitosamente\n');
    return true;
  } else {
    console.log('  ⏭️  Sin cambios necesarios\n');
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  let totalCount = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const [fixed, total] = walkDirectory(fullPath);
      fixedCount += fixed;
      totalCount += total;
    } else if (file.endsWith('.jsx') && file.includes('modificar')) {
      totalCount++;
      if (fixMigrationErrors(fullPath)) {
        fixedCount++;
      }
    }
  });
  
  return [fixedCount, totalCount];
}

// Ejecutar correcciones
const [fixedCount, totalCount] = walkDirectory(baseDir);

console.log('🎯 RESUMEN DE CORRECCIONES:');
console.log(`📊 Archivos analizados: ${totalCount}`);
console.log(`✅ Archivos corregidos: ${fixedCount}`);
console.log(`⏭️  Sin cambios: ${totalCount - fixedCount}`);

if (fixedCount > 0) {
  console.log('\n🚀 ¡Correcciones aplicadas exitosamente!');
  console.log('💡 Los archivos ahora deberían compilar sin errores');
} else {
  console.log('\n✨ Todos los archivos ya estaban correctos');
}

console.log('\n📝 Para verificar el resultado, ejecuta: npx expo start -c');