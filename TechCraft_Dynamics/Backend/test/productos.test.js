const request = require('supertest');
const app = require('../index');

describe('Productos - listarProductos', () => {

  test('Debe retornar todos los productos activos', async () => {
    const res = await request(app).get('/api/productos');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Si hay productos, deben tener estructura
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('Nombre_producto');
      expect(res.body[0]).toHaveProperty('activo');
    }
  });

  test('Debe filtrar por proveedor usando ?proveedor=ID', async () => {
    const res = await request(app).get('/api/productos?proveedor=1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Si hay productos filtrados
    if (res.body.length > 0) {
      expect(res.body[0].id_Proveedor).toBe(1);
    }
  });

});
