const request = require('supertest');
const app = require('../index'); // o la ruta a tu archivo principal


test('Debe crear una venta válida con un producto', async () => {
  const ventaData = {
    metodo_pago: "Efectivo",
    info_pago: null,
    descripcion: "Venta prueba Jest",
    detalles: [
      {
        producto_id: 1,
        cantidad: 2,
        descuento: 0,
        id_proveedor: 1
      }
    ]
  };

  const res = await request(app)
    .post('/api/ventas')
    .send(ventaData);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("ventaId");
  expect(res.body).toHaveProperty("detalles");
  expect(Array.isArray(res.body.detalles)).toBe(true);
});
