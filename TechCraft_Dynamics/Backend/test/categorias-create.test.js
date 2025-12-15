const request = require("supertest");
const app = require("../index");

describe("Categorías - Crear", () => {
  test("PR01 - Crear categoría", async () => {
    const res = await request(app)
      .post("/api/categorias")
      .field("Nombre_categoria", "Medicamentos")
      .field("Descripcion", "Productos farmacéuticos para animales");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("number");
  });
});
