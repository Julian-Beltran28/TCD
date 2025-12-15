const request = require('supertest');
const app = require('../index');

describe('Proveedores - Obtener por ID', () => {

  test('PR03 - Obtener proveedor por ID', async () => {
    // 1) Crear proveedor para asegurar un ID válido
    await request(app)
      .post('/api/proveedores')
      .field('nombre_empresa', 'Proveedor GetById')
      .field('tipo_exportacion', 'Nacional');

    // 2) Obtener la lista y tomar el más reciente (tu Listar ordena DESC)
    const listRes = await request(app).get('/api/proveedores/listar');
    expect(listRes.statusCode).toBe(200);
    const nuevo = listRes.body.proveedores[0];
    expect(nuevo).toBeDefined();
    const id = nuevo.id;

    // 3) Obtener por ID
    const res = await request(app).get(`/api/proveedores/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(id);
    expect(res.body).toHaveProperty('nombre_empresa');
  });

});
