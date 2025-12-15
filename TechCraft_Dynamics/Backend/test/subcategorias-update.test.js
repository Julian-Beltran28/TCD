const request = require("supertest");
const app = require("../index");

describe("Subcategorías - Actualizar", () => {
  test("PR04 - Actualizar subcategoría", async () => {
    // Crear primero
    const create = await request(app)
      .post("/api/subcategorias")
      .field("Nombre_Subcategoria", "Comidas")
      .field("Descripcion", "Comida seca")
      .field("id_Categorias", 1);

    const id = create.body.id;

    // Actualizar
    const res = await request(app)
      .put(`/api/subcategorias/${id}`)
      .field("Nombre_Subcategoria", "Comidas Premium")
      .field("Descripcion", "Comida seca de alta calidad")
      .field("id_Categorias", 1);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje", "Subcategoría actualizada correctamente");
  });
});
