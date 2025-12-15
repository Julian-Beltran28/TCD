const request = require("supertest");
const app = require("../index");

describe("Subcategorías - Listar", () => {
  test("PR02 - Listar subcategorías", async () => {
    const res = await request(app).get("/api/subcategorias");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
