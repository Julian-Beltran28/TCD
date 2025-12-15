const request = require("supertest");
const app = require("../index");

describe("Proveedores - Eliminar", () => {

  test("PR05 - Soft delete proveedor", async () => {

    // Crear proveedor
    const creado = await request(app)
      .post("/api/proveedores")
      .field("nombre_empresa", "Proveedor Eliminar")
      .field("tipo_exportacion", "Nacional");

    // Obtener ID del proveedor recién creado
    const list = await request(app).get("/api/proveedores/listar");
    const proveedor = list.body.proveedores[0];

    expect(proveedor).toBeDefined();

    // Eliminarlo (soft delete)
    const resDelete = await request(app).delete(`/api/proveedores/${proveedor.id}/soft-delete`);

    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body).toHaveProperty("mensaje");
    expect(resDelete.body.mensaje).toContain("eliminado");

    // Verificar que NO aparezca en el listado de activos
    const resList = await request(app).get("/api/proveedores/listar");
    const existe = resList.body.proveedores.find((p) => p.id === proveedor.id);

    expect(existe).toBeUndefined();
  });

});
