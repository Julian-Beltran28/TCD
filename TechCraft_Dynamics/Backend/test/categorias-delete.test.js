const request = require("supertest");
const app = require("../index");

describe("Categorías - Eliminar (soft delete)", () => {
  test("PRO05 - Eliminar categoría", async () => {
    // Crear categoría primero
    const create = await request(app)
      .post("/api/categorias")
      .field("Nombre_categoria", "Snacks")
      .field("Descripcion", "Snacks para mascotas");

    const id = create.body.id;

    // Eliminar
    const res = await request(app).delete(`/api/categorias/delete/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "La categoría ha sido desactivada (soft delete)."
    );
  });
});
