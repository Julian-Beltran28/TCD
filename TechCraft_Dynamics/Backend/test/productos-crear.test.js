const request = require('supertest');
const app = require('../index');

describe('Productos - crearProducto', () => {

  test('Debe crear un producto sin imagen correctamente', async () => {
    const nuevoProducto = {
      Nombre_producto: "Producto Test Jest",
      precio: 5000,
      stock: 10,
      Kilogramos: null,
      Precio_kilogramo: null,
      Libras: null,
      Precio_libras: null,
      Descripcion: "Producto de prueba",
      Codigo_de_barras: "ABC1234567",
      id_SubCategorias: 1,
      id_Proveedor: 1,
      tipo_producto: "paquete"
    };

    const res = await request(app)
      .post('/api/productos')
      .send(nuevoProducto);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

});
