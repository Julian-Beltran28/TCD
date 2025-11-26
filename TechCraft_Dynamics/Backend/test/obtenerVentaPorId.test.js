const request = require('supertest');
const app = require('../index');

describe('Ventas - obtenerVentaPorId', () => {

  test('Debe obtener una venta por ID correctamente', async () => {

    // Creamos una venta
    const ventaCreada = await request(app)
      .post('/api/ventas')
      .send({
        metodo_pago: "Efectivo",
        descripcion: "Venta test Jest ID",
        detalles: [
          { producto_id: 1, cantidad: 1, descuento: 0, id_proveedor: 1 }
        ]
      });

    const idVenta = ventaCreada.body.ventaId;

    console.log(`🆔 Venta creada con ID: ${idVenta}`);

    // Obtenemos la venta por ID
    const res = await request(app).get(`/api/ventas/${idVenta}`);

    //  Log mostrando la venta completa
    console.log(" Venta obtenida:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(idVenta);
    expect(res.body).toHaveProperty('detalles');
    expect(Array.isArray(res.body.detalles)).toBe(true);
  });

});
