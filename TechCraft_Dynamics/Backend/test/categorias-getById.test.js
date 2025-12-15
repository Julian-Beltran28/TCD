const request = require("supertest");
const app = require("../index");

describe("Categorías - Obtener por ID", () => {
  test("PR03 - Obtener categoría existente por ID", async () => {
    // Primero creamos una categoría para tener un ID válido
    const create = await request(app)
      .post("/api/categorias")
      .field("Nombre_categoria", "Accesorios")
      .field("Descripcion", "Accesorios varios");

    const id = create.body.id;

    const res = await request(app).get(`/api/categorias/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  test("PR03 - Obtener categoría inexistente devuelve 404", async () => {
    const res = await request(app).get("/api/categorias/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("mensaje", "Categoría no encontrada");
  });
});
