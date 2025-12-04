const request = require("supertest");
const app = require("../index");

describe("Módulo Proveedores - pruebas completas", () => {

  let proveedorId;

  test("PR01 - Crear proveedor correctamente", async () => {
    const res = await request(app)
      .post("/api/proveedores/")
      .send({
        nombre_empresa: "Proveedor Testing",
        tipo_exportacion: "Nacional",
        imagen_empresa: "imagen.jpg"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    proveedorId = res.body.id;
  });

  test("PR02 - Listar proveedores y verificar existencia del creado", async () => {
    const res = await request(app).get("/api/proveedores/listar");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const encontrado = res.body.find(p => p.nombre_empresa === "Proveedor Testing");
    expect(encontrado).toBeDefined();
    expect(encontrado.id).toBe(proveedorId);
  });

  test("PR03 - Obtener proveedor por ID", async () => {
    const res = await request(app).get(`/api/proveedores/${proveedorId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre_empresa).toBe("Proveedor Testing");
  });

  test("PR04 - Actualizar proveedor correctamente", async () => {
    const res = await request(app)
      .put(`/api/proveedores/${proveedorId}`)
      .send({ nombre_empresa: "Proveedor Editado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("actualizado");

    // Verificar que realmente se actualizó
    const resGet = await request(app).get(`/api/proveedores/${proveedorId}`);
    expect(resGet.body.nombre_empresa).toBe("Proveedor Editado");
  });

  test("PR05 - Listar productos por proveedor (puede estar vacío)", async () => {
    const res = await request(app).get(`/api/proveedores/productos/${proveedorId}`);
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) expect(Array.isArray(res.body)).toBe(true);
  });

  test("PR06 - Comprar productos (flujo simple)", async () => {
    const res = await request(app)
      .post("/api/proveedores/comprar")
      .send({
        id_proveedor: proveedorId,
        productos: [
          { id_producto: 1, cantidad: 2 },
          { id_producto: 2, cantidad: 3 }
        ]
      });

    expect([200, 400, 404]).toContain(res.statusCode);
  });

  test("PR07 - Soft delete proveedor", async () => {
    const res = await request(app).delete(`/api/proveedores/${proveedorId}/soft-delete`);
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("soft delete");

    // Verificar que ya no aparece activo
    const resLista = await request(app).get("/api/proveedores/listar");
    const encontrado = resLista.body.find(p => p.id === proveedorId);
    expect(encontrado).toBeUndefined();
  });

});
