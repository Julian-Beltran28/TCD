const fs = require('fs');
const path = require('path');

// Configuración
const baseDir = path.join(process.cwd(), 'app', '(tabs)', 'Pages');
const exclusions = ['LoadingTest.jsx', 'index.jsx'];

console.log('🚀 Iniciando migración completa de Loading System...');
console.log(`📁 Buscando archivos en: ${baseDir}\n`);

function processFile(filePath) {
  const relativePath = path.relative(baseDir, filePath);
  console.log(`📄 Procesando: ${relativePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  let changes = [];
  
  // 1. Verificar si ya tiene el hook importado
  const hasHookImport = content.includes("import { useNavigationWithLoading }") || 
                       content.includes("from '@/hooks/useNavigationWithLoading'");
  
  // 2. Si no tiene el hook, agregarlo
  if (!hasHookImport && (content.includes('router.push') || content.includes('router.replace') || content.includes('setLoading('))) {
    // Encontrar la línea de imports de expo-router
    const expoRouterImportMatch = content.match(/import\s*{[^}]*}\s*from\s*["']expo-router["'];?/);
    if (expoRouterImportMatch) {
      const newImport = `${expoRouterImportMatch[0]}\nimport { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';`;
      content = content.replace(expoRouterImportMatch[0], newImport);
      changes.push('✅ Hook de navegación importado');
      changed = true;
    }
  }
  
  // 3. Reemplazar useRouter por el hook personalizado
  if (content.includes('const router = useRouter();')) {
    content = content.replace(
      /const router = useRouter\(\);/g,
      'const { navigateWithLoading, replaceWithLoading, goBackWithLoading, showLoading, hideLoading } = useNavigationWithLoading();'
    );
    changes.push('✅ Hook de navegación configurado');
    changed = true;
  }
  
  // 4. Reemplazar navegaciones router.push
  const pushMatches = content.match(/router\.push\([^)]+\)/g);
  if (pushMatches) {
    pushMatches.forEach(match => {
      // Extraer el objeto de navegación
      const pathMatch = match.match(/router\.push\((.+)\)/);
      if (pathMatch) {
        const navParam = pathMatch[1];
        const replacement = `navigateWithLoading(${navParam}, 'Navegando...', 500)`;
        content = content.replace(match, replacement);
        changes.push('✅ Navegación push migrada');
        changed = true;
      }
    });
  }
  
  // 5. Reemplazar navegaciones router.replace
  const replaceMatches = content.match(/router\.replace\([^)]+\)/g);
  if (replaceMatches) {
    replaceMatches.forEach(match => {
      const pathMatch = match.match(/router\.replace\((.+)\)/);
      if (pathMatch) {
        const navParam = pathMatch[1];
        const replacement = `replaceWithLoading(${navParam}, 'Redirigiendo...', 500)`;
        content = content.replace(match, replacement);
        changes.push('✅ Navegación replace migrada');
        changed = true;
      }
    });
  }
  
  // 6. Reemplazar router.back
  if (content.includes('router.back()')) {
    content = content.replace(/router\.back\(\)/g, 'goBackWithLoading(\'Regresando...\', 300)');
    changes.push('✅ Navegación back migrada');
    changed = true;
  }
  
  // 7. Reemplazar estados de loading manuales
  if (content.includes('setLoading(true)')) {
    content = content.replace(/setLoading\(true\)/g, 'showLoading(\'Cargando...\')');
    changes.push('✅ Loading state (true) migrado');
    changed = true;
  }
  
  if (content.includes('setLoading(false)')) {
    content = content.replace(/setLoading\(false\)/g, 'hideLoading()');
    changes.push('✅ Loading state (false) migrado');
    changed = true;
  }
  
  // 8. Remover imports innecesarios de ActivityIndicator
  if (content.includes('ActivityIndicator') && !content.includes('<ActivityIndicator')) {
    content = content.replace(/,?\s*ActivityIndicator\s*,?/g, '');
    content = content.replace(/ActivityIndicator\s*,?\s*/g, '');
    changes.push('✅ Import de ActivityIndicator removido');
    changed = true;
  }
  
  // 9. Remover estados de loading locales si ya no se usan
  const loadingStateMatch = content.match(/const\s*\[loading,\s*setLoading\]\s*=\s*useState\([^)]*\);/);
  if (loadingStateMatch && !content.includes('{loading}') && !content.includes('loading &&')) {
    content = content.replace(loadingStateMatch[0], '');
    changes.push('✅ Estado de loading local removido');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    changes.forEach(change => console.log(`  ${change}`));
    console.log('  🎉 Migrado exitosamente\n');
    return true;
  } else {
    console.log('  ⏭️  Sin cambios necesarios\n');
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let migratedCount = 0;
  let totalCount = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const [migrated, total] = walkDirectory(fullPath);
      migratedCount += migrated;
      totalCount += total;
    } else if (file.endsWith('.jsx') && !exclusions.includes(file)) {
      totalCount++;
      if (processFile(fullPath)) {
        migratedCount++;
      }
    }
  });
  
  return [migratedCount, totalCount];
}

// Ejecutar migración
const [migratedCount, totalCount] = walkDirectory(baseDir);

console.log('🎯 RESUMEN DE MIGRACIÓN COMPLETA:');
console.log(`📊 Total de archivos: ${totalCount}`);
console.log(`✅ Archivos migrados: ${migratedCount}`);
console.log(`⏭️  Sin cambios: ${totalCount - migratedCount}`);

if (migratedCount > 0) {
  console.log('\n🚀 ¡Migración completa exitosa!');
  console.log('💡 Se migraron navegaciones y estados de loading');
} else {
  console.log('\n✨ Todas las pantallas ya estaban migradas');
}

console.log('\n📝 Para verificar el resultado, ejecuta: node scripts/test-loading.js');