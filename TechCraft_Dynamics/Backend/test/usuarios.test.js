const request = require('supertest');
const app = require('../index');

describe('Usuarios - listarUsuarios', () => {

  test('Debe retornar todos los usuarios activos', async () => {
    const res = await request(app).get('/api/usuarios');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Si hay usuarios, deben tener estructura
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('Primer_Nombre');
      expect(res.body[0]).toHaveProperty('Correo_personal');
      expect(res.body[0]).toHaveProperty('activo');
    }
  });

});
