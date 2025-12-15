const request = require("supertest");
const app = require("../index");

describe("Categorías - Actualizar", () => {
  test("PR04 - Actualizar categoría por ID", async () => {
    // Crear categoría
    const create = await request(app)
      .post("/api/categorias")
      .field("Nombre_categoria", "Juguetes")
      .field("Descripcion", "Juguetes para mascotas");

    const id = create.body.id;

    // Actualizar
    const res = await request(app)
      .put(`/api/categorias/${id}`)
      .field("Nombre_categoria", "Juguetes Premium")
      .field("Descripcion", "Juguetes de alta calidad");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("actualizada");
  });
});
