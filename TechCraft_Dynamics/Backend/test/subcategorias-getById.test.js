const request = require("supertest");
const app = require("../index");

describe("Subcategorías - Obtener por ID", () => {

  test("PR03 - Obtener subcategoría existente", async () => {
    // Primero creamos una subcategoría para obtener un ID válido
    const create = await request(app)
      .post("/api/subcategorias")
      .field("Nombre_Subcategoria", "Higiene")
      .field("Descripcion", "Productos de aseo")
      .field("id_Categorias", 1);

    const id = create.body.id;

    const res = await request(app).get(`/api/subcategorias/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(id);
  });

  test("PR03 - Retorna 404 si no existe", async () => {
    const res = await request(app).get("/api/subcategorias/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("mensaje", "Subcategoría no encontrada");
  });
});
