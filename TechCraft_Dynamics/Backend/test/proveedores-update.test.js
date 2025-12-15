const request = require("supertest");
const app = require("../index");

describe("Proveedores - Actualizar", () => {
  test("PR04 - Actualizar proveedor por ID", async () => {
    // 1️⃣ Crear proveedor temporal para actualizar
    const createRes = await request(app)
      .post("/api/proveedores")
      .field("nombre_empresa", "Proveedor Temp")
      .field("tipo_exportacion", "Nacional")
      .field("nombre_representante", "Laura")
      .field("apellido_representante", "Martínez")
      .field("numero_empresarial", "3017654321")
      .field("correo_empresarial", "temp@mail.com");

    const id = createRes.body.id || 1; // Si no devuelves ID, pon uno manual

    // 2️⃣ Actualizar proveedor
    const updateRes = await request(app)
      .put(`/api/proveedores/${id}`)
      .field("nombre_empresa", "Proveedor Modificado")
      .field("tipo_exportacion", "Internacional")
      .field("nombre_representante", "Luis")
      .field("apellido_representante", "Ramírez")
      .field("numero_empresarial", "3001112233")
      .field("correo_empresarial", "modificado@mail.com");

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("mensaje");
    expect(updateRes.body.mensaje).toContain("actualizado");
  });
});
