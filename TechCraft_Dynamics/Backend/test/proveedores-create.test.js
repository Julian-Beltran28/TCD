const request = require("supertest");
const app = require("../index");

describe("Proveedores - Crear", () => {
  test("PR01 - Crear proveedor", async () => {
    const res = await request(app)
      .post("/api/proveedores")
      .field("nombre_empresa", "Proveedor X")
      .field("tipo_exportacion", "Nacional")
      .field("nombre_representante", "Carlos")
      .field("apellido_representante", "Gómez")
      .field("numero_empresarial", "3001234567")
      .field("correo_empresarial", "proveedorx@mail.com");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje");
    expect(res.body.mensaje).toContain("Proveedor creado");
  });
});
