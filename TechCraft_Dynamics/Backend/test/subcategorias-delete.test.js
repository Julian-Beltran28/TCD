const request = require("supertest");
const app = require("../index");

describe("Subcategorías - Eliminar (soft delete)", () => {
  test("PRO05 - Eliminar subcategoría", async () => {
    // Crear una subcategoría
    const create = await request(app)
      .post("/api/subcategorias")
      .field("Nombre_Subcategoria", "Snacks")
      .field("Descripcion", "Snacks varios")
      .field("id_Categorias", 1);

    const id = create.body.id;

    // Eliminar
    const res = await request(app).delete(`/api/subcategorias/delete/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "mensaje",
      "Subcategoría desactivada correctamente (soft delete)"
    );
  });
});
