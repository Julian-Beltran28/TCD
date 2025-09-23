const fs = require('fs');
const path = require('path');

// Lista de archivos a modificar (excluyendo los que ya están hechos)
const filesToModify = [
  'app/(tabs)/Pages/Categorias/listarCategorias.jsx',
  'app/(tabs)/Pages/Categorias/modificarCategoria.jsx', 
  'app/(tabs)/Pages/Categorias/registrarCategoria.jsx',
  'app/(tabs)/Pages/Categorias/Sub-Categorias/listarSubcategorias.jsx',
  'app/(tabs)/Pages/Categorias/Sub-Categorias/modificarSubcategoria.jsx',
  'app/(tabs)/Pages/Categorias/Sub-Categorias/registrarSubcategoria.jsx',
  'app/(tabs)/Pages/Categorias/Sub-Categorias/Productos/listarProductos.jsx',
  'app/(tabs)/Pages/Categorias/Sub-Categorias/Productos/modificarProducto.jsx',
  'app/(tabs)/Pages/Categorias/Sub-Categorias/Productos/registrarProducto.jsx',
  'app/(tabs)/Pages/Reportes/panelPrincipal.jsx',
  'app/(tabs)/Pages/Reportes/seleccionarReporte.jsx',
  'app/(tabs)/Pages/Reportes/estadisticas.jsx',
  'app/(tabs)/Pages/Reportes/ventas.jsx',
  'app/(tabs)/Pages/Ventas/seleccionarVenta.jsx',
  'app/(tabs)/Pages/Ventas/ventasCliente.jsx',
  'app/(tabs)/Pages/Ventas/ventasProveedores.jsx'
];

const baseDir = process.cwd();

function addBackButtonToFile(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if BackButton is already imported
  if (content.includes('BackButton')) {
    console.log(`⚠️  BackButton already in: ${filePath}`);
    return;
  }

  // Add import
  if (content.includes("import React")) {
    content = content.replace(
      /(import.*from ['"]@\/hooks\/useNavigationWithLoading['"];?\s*)/,
      `$1import BackButton from '@/components/BackButton';\n`
    );
  }

  // Find return statement and wrap with fragment
  const returnRegex = /(\s*return\s*\(\s*<[^>]+)/;
  const match = content.match(returnRegex);
  
  if (match) {
    const returnStatement = match[1];
    const elementTag = returnStatement.match(/<(\w+)/)?.[1];
    
    if (elementTag) {
      // Replace return with fragment
      content = content.replace(
        returnRegex,
        `$1<>\n      <BackButton />\n      <${elementTag}`
      );
      
      // Find the closing tag and add fragment close
      const closingRegex = new RegExp(`(\\s*</View>\\s*\\);?)\\s*$`, 'm');
      content = content.replace(closingRegex, '$1\n    </>\n  );');
    }
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Modified: ${filePath}`);
}

console.log('🚀 Adding BackButton to remaining files...\n');

filesToModify.forEach(addBackButtonToFile);

console.log('\n✨ Done! BackButton added to all remaining files.');