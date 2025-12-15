const request = require("supertest");
const app = require("../index");

describe("Categorías - Listar", () => {
  test("PR02 - Listar categorías activas", async () => {
    const res = await request(app).get("/api/categorias");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
