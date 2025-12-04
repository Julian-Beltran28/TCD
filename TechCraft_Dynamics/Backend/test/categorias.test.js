const request = require("supertest");
const app = require("../index");

describe("Módulo Categorías - pruebas completas", () => {

  let categoriaId;

  test("C01 - Crear categoría", async () => {
    const res = await request(app)
      .post("/api/categorias/")
      .send({
        nombre_categoria: "Categoría Test",
        descripcion: "Descripción test"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    categoriaId = res.body.id;
  });

  test("C02 - Listar categorías", async () => {
    const res = await request(app).get("/api/categorias/");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const encontrado = res.body.find(c => c.id === categoriaId);
    expect(encontrado).toBeDefined();
  });

  test("C03 - Obtener categoría por ID", async () => {
    const res = await request(app).get(`/api/categorias/${categoriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre_categoria).toBe("Categoría Test");
  });

  test("C04 - Actualizar categoría", async () => {
    const res = await request(app)
      .put(`/api/categorias/${categoriaId}`)
      .send({ nombre_categoria: "Categoría Editada" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("actualizado");

    const resGet = await request(app).get(`/api/categorias/${categoriaId}`);
    expect(resGet.body.nombre_categoria).toBe("Categoría Editada");
  });

  test("C05 - Eliminar categoría", async () => {
    const res = await request(app).delete(`/api/categorias/delete/${categoriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("eliminado");

    const resGet = await request(app).get(`/api/categorias/${categoriaId}`);
    expect(resGet.statusCode).toBe(404);
  });

});
