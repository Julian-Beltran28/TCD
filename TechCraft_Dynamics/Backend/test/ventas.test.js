const request = require('supertest');
const app = require('../index'); 


describe('Ventas - crearVenta', () => {

  test('Debe retornar 400 si no se envían productos en la venta', async () => {
    const res = await request(app)
      .post('/api/ventas')
      .send({
        metodo_pago: "Nequi",
        info_pago: { telefono: "3001234567" },
        descripcion: "Venta sin productos",
        detalles: [] // <-- vacío
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("No se enviaron productos en la venta");
  });

});
