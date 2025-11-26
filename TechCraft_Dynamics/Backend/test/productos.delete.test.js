const request = require('supertest');
const app = require('../index');

describe('Productos - eliminarProducto', () => {

  test('Debe eliminar un producto existente por ID', async () => {

    // 1️⃣ Crear un producto de prueba
    const productoCreado = await request(app)
      .post('/api/productos')
      .send({
        Nombre_producto: "Producto a eliminar Jest",
        precio: 1000,
        stock: 5,
        Kilogramos: null,
        Precio_kilogramo: null,
        Libras: null,
        Precio_libras: null,
        Descripcion: "Producto temporal",
        Codigo_de_barras: "DELETE12345",
        id_SubCategorias: 1,
        id_Proveedor: 1,
        tipo_producto: "paquete"
      });

    const id = productoCreado.body.id;
    expect(id).toBeDefined();

    // 2️⃣ Eliminar el producto
    const resDelete = await request(app).delete(`/api/productos/${id}`);

    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body).toHaveProperty("message");
    expect(resDelete.body.message).toContain("eliminado");

    // 3️⃣ Intentar obtenerlo → debe dar 404
    const resGet = await request(app).get(`/api/productos/${id}`);

    expect(resGet.statusCode).toBe(404);
  });

});
