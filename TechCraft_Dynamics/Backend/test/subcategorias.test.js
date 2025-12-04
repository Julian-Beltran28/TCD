const request = require("supertest");
const app = require("../index");

describe("Módulo Subcategorías - pruebas completas", () => {

  let subcategoriaId;

  test("S01 - Crear subcategoría", async () => {
    const res = await request(app)
      .post("/api/subcategorias/")
      .send({
        nombre_subcategoria: "Subcategoria Test",
        id_categoria: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    subcategoriaId = res.body.id;
  });

  test("S02 - Listar subcategorías", async () => {
    const res = await request(app).get("/api/subcategorias/");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const encontrado = res.body.find(s => s.id === subcategoriaId);
    expect(encontrado).toBeDefined();
  });

  test("S03 - Obtener subcategoría por ID", async () => {
    const res = await request(app).get(`/api/subcategorias/${subcategoriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre_subcategoria).toBe("Subcategoria Test");
  });

  test("S04 - Actualizar subcategoría", async () => {
    const res = await request(app)
      .put(`/api/subcategorias/${subcategoriaId}`)
      .send({ nombre_subcategoria: "Subcategoria Editada" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("actualizado");

    const resGet = await request(app).get(`/api/subcategorias/${subcategoriaId}`);
    expect(resGet.body.nombre_subcategoria).toBe("Subcategoria Editada");
  });

  test("S05 - Eliminar subcategoría", async () => {
    const res = await request(app).delete(`/api/subcategorias/delete/${subcategoriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("eliminado");

    const resGet = await request(app).get(`/api/subcategorias/${subcategoriaId}`);
    expect(resGet.statusCode).toBe(404);
  });

});
