describe('Ventas - obtenerVentaPorId', () => {

  test('Debe obtener una venta por ID correctamente', async () => {

    // Primero creamos una venta real:
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

    // Ahora probamos GET /ventas/:id
    const res = await request(app).get(`/api/ventas/${idVenta}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(idVenta);
    expect(res.body).toHaveProperty('detalles');
    expect(Array.isArray(res.body.detalles)).toBe(true);
  });

});
