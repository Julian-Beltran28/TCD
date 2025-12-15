const request = require("supertest");
const app = require("../index");

describe("Proveedores - Listar", () => {

  test("PR02 - Listar proveedores", async () => {
    const res = await request(app).get("/api/proveedores/listar");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("proveedores");
    expect(Array.isArray(res.body.proveedores)).toBe(true);
  });

  test("PR03 - Obtener proveedor por ID", async () => {
    // Primero crear proveedor para asegurar ID válido
    const creado = await request(app)
      .post("/api/proveedores")
      .field("nombre_empresa", "Proveedor Test ID")
      .field("tipo_exportacion", "Internacional");

    // Obtener último proveedor creado (tu query ordena DESC)
    const list = await request(app).get("/api/proveedores/listar");
    const nuevo = list.body.proveedores[0]; // el más reciente

    const res = await request(app).get(`/api/proveedores/${nuevo.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(nuevo.id);
  });

});
