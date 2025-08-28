const bcrypt = require('bcrypt');

async function run() {
  const admin = await bcrypt.hash('admin123', 10);
  const superv = await bcrypt.hash('super123', 10);
  const staff = await bcrypt.hash('staff123', 10);

  console.log('Contraseñas encriptadas:\n');
  console.log('Admin:', admin);
  console.log('Supervisor:', superv);
  console.log('Staff:', staff);
}

run();
