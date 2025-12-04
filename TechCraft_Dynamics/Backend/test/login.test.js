const request = require("supertest");
const app = require("../index");

describe("Módulo Login - pruebas completas", () => {

  test("L01 - Login exitoso", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ correo: "admin@admin.com", contrasena: "admin123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body).toHaveProperty("token");
  });

  test("L02 - Login con correo incorrecto", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ correo: "noexiste@tcd.com", contrasena: "1234" });

    expect(res.statusCode).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  test("L03 - Login con contraseña incorrecta", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ correo: "admin@admin.com", contrasena: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
  });

});
