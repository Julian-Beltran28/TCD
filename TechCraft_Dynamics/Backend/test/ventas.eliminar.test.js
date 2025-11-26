
const request = require('supertest');
const app = require('../index');

describe('Ventas - eliminarVenta', () => {
  
  test('Debe eliminar una venta existente por ID', async () => {

    // 1️⃣ Crear venta real
    const ventaCreada = await request(app)
      .post('/api/ventas')
      .send({
        metodo_pago: "Efectivo",
        descripcion: "Venta creada para prueba DELETE",
        detalles: [
          { producto_id: 1, cantidad: 1, descuento: 0, id_proveedor: 1 }
        ]
      });

    const ventaId = ventaCreada.body.ventaId;
    expect(ventaId).toBeDefined();

    // 2️⃣ Eliminar venta
    const resDelete = await request(app).delete(`/api/ventas/${ventaId}`);

    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body).toHaveProperty("message");
    expect(resDelete.body.message).toContain("eliminada");

    // 3️⃣ Intentar obtener la venta eliminada → debe dar 404
    const resGet = await request(app).get(`/api/ventas/${ventaId}`);

    expect(resGet.statusCode).toBe(404);
    expect(resGet.body).toHaveProperty("error");
  });

});
