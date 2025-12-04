const request = require("supertest");
const app = require("../index");

describe("Módulo Usuarios - pruebas completas", () => {

  let usuarioId;

  test("U01 - Crear usuario correctamente", async () => {
    const res = await request(app)
      .post("/api/usuarios/")
      .send({
        nombres: "Usuario Test",
        apellidos: "Jest",
        rol: "staff",
        contrasena: "123456",
        tipo_documento: "CC",
        numero_documento: "123456789",
        telefono: "3001234567",
        correo: "test@tcd.com",
        correo_personal: "testpersonal@tcd.com",
        activo: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    usuarioId = res.body.id;
  });

  test("U02 - Listar usuarios y verificar existencia", async () => {
    const res = await request(app).get("/api/usuarios/listar");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const encontrado = res.body.find(u => u.id === usuarioId);
    expect(encontrado).toBeDefined();
  });

  test("U03 - Obtener usuario por ID", async () => {
    const res = await request(app).get(`/api/usuarios/${usuarioId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombres).toBe("Usuario Test");
  });

  test("U04 - Actualizar usuario correctamente", async () => {
    const res = await request(app)
      .put(`/api/usuarios/${usuarioId}`)
      .send({ nombres: "Usuario Editado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("actualizado");

    const resGet = await request(app).get(`/api/usuarios/${usuarioId}`);
    expect(resGet.body.nombres).toBe("Usuario Editado");
  });

  test("U05 - Cambiar contraseña del usuario", async () => {
    const res = await request(app)
      .put(`/api/usuarios/cambiar-contrasena/${usuarioId}`)
      .send({ actual: "123456", nueva: "654321" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("cambiada");
  });

  test("U06 - Eliminar usuario", async () => {
    const res = await request(app).delete(`/api/usuarios/delete/${usuarioId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("Usuario eliminado");

    const resGet = await request(app).get(`/api/usuarios/${usuarioId}`);
    expect(resGet.statusCode).toBe(404);
  });

});
