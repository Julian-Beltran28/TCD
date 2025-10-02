#!/usr/bin/env node

/**
 * Script wrapper para EAS CLI en Windows
 * Soluciona el problema de spawn cmd.exe ENOENT
 */

const { spawn } = require('child_process');

// Configurar variables de entorno
process.env.COMSPEC = process.env.COMSPEC || 'C:\\WINDOWS\\system32\\cmd.exe';
process.env.SystemRoot = process.env.SystemRoot || 'C:\\WINDOWS';

// Agregar rutas del sistema al PATH
const systemPaths = [
  'C:\\WINDOWS\\system32',
  'C:\\WINDOWS',
  'C:\\WINDOWS\\System32\\Wbem'
];

systemPaths.forEach(systemPath => {
  if (!process.env.PATH.includes(systemPath)) {
    process.env.PATH = process.env.PATH + ';' + systemPath;
  }
});

console.log('🔧 Configurando entorno Windows para EAS CLI...');
console.log('📁 COMSPEC:', process.env.COMSPEC);
console.log('📁 SystemRoot:', process.env.SystemRoot);
console.log('');

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('❌ Error: No se proporcionaron argumentos');
  console.log('💡 Uso: node eas-wrapper.js build --platform android --profile preview');
  process.exit(1);
}

// Ejecutar EAS CLI con la configuración corregida
console.log('🚀 Ejecutando: eas', args.join(' '));
console.log('📝 Nota: El warning sobre cmd.exe ENOENT puede aparecer pero es seguro ignorarlo');
console.log('');

const easProcess = spawn('eas', args, {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

easProcess.on('close', (code) => {
  console.log('');
  if (code === 0) {
    console.log('✅ Proceso completado exitosamente');
    console.log('🔗 Revisa tu panel de Expo: https://expo.dev/accounts/samu37/projects/tc-dynamics-fresh/builds');
  } else {
    console.log('❌ Proceso terminado con código:', code);
  }
  process.exit(code);
});

easProcess.on('error', (error) => {
  console.error('❌ Error ejecutando EAS CLI:', error.message);
  process.exit(1);
});