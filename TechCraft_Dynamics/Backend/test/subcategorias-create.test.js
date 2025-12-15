const request = require("supertest");
const app = require("../index");

describe("Subcategorías - Crear", () => {
  test("PR01 - Crear subcategoría", async () => {
    const res = await request(app)
      .post("/api/subcategorias")
      .field("Nombre_Subcategoria", "Vitaminas")
      .field("Descripcion", "Vitaminas esenciales para mascotas")
      .field("id_Categorias", 1);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("number");
  });
});
