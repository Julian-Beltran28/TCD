describe('Ventas - listarVentas', () => {
  test('Debe devolver todas las ventas', async () => {
    const res = await request(app).get('/api/ventas');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const venta = res.body[0];
      expect(venta).toHaveProperty('id');
      expect(venta).toHaveProperty('detalles'); // tu controlador agrega detalles siempre
      expect(Array.isArray(venta.detalles)).toBe(true);
    }
  });
});
