const request = require("supertest");
const app = require("../index");

describe("Módulo Cambio de Contraseña - pruebas completas", () => {

  const userId = 1; // Cambiar al ID real de prueba

  test("PW01 - Cambiar contraseña correctamente", async () => {
    const res = await request(app)
      .put(`/api/perfil/${userId}/password`)
      .send({ actual: "123456", nueva: "654321" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("cambiada");
  });

  test("PW02 - Contraseña actual incorrecta", async () => {
    const res = await request(app)
      .put(`/api/perfil/${userId}/password`)
      .send({ actual: "wrongpass", nueva: "999999" });

    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toContain("incorrecta");
  });

});
