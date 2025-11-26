const request = require('supertest');
const app = require('../index');

describe('Ventas - listarVentas', () => {
  test('Debe devolver todas las ventas', async () => {
    const res = await request(app).get('/api/ventas');

  
    console.log(` Ventas encontradas: ${res.body.length}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const venta = res.body[0];
      expect(venta).toHaveProperty('id');
      expect(venta).toHaveProperty('detalles');
      expect(Array.isArray(venta.detalles)).toBe(true);
    }
  });
});
