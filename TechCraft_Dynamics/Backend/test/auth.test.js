const request = require("supertest");
const app = require("../index");
const db = require("../models/conexion");
const bcrypt = require("bcryptjs");

describe("Autenticación - Login", () => {
  let usuarioTestId;
  const credencialesValidas = {
    correo: "test.login@empresa.com",
    contrasena: "password123"
  };

  // Crear usuario de prueba antes de las pruebas
  beforeAll(async () => {
    try {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(credencialesValidas.contrasena, 10);

      // Insertar usuario de prueba
      const [result] = await db.query(
        `INSERT INTO Usuarios 
        (Primer_Nombre, Primer_Apellido, Correo_empresarial, Contrasena, id_Rol) 
        VALUES (?, ?, ?, ?, ?)`,
        ["Test", "Usuario", credencialesValidas.correo, hashedPassword, 1]
      );

      usuarioTestId = result.insertId;
    } catch (error) {
      console.error("Error en beforeAll:", error);
    }
  });

  // Limpiar después de las pruebas
  afterAll(async () => {
    try {
      if (usuarioTestId) {
        await db.query("DELETE FROM Usuarios WHERE id = ?", [usuarioTestId]);
      }
      await db.end();
    } catch (error) {
      console.error("Error en afterAll:", error);
    }
  });

  test("PR01 - Login exitoso", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        correo: credencialesValidas.correo,
        contrasena: credencialesValidas.contrasena
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body).toHaveProperty("usuario");
    expect(res.body.usuario).toHaveProperty("id");
    expect(res.body.usuario).toHaveProperty("nombre");
    expect(res.body.usuario).toHaveProperty("rol");
    expect(res.body.usuario).toHaveProperty("correo");
  });

  test("PR02 - Usuario no existe", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        correo: "usuario.noexiste@empresa.com",
        contrasena: "cualquierPassword123"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("mensaje");
    expect(res.body.mensaje).toContain("Usuario o contraseña incorrecta");
  });

  test("PR03 - Contraseña incorrecta", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        correo: credencialesValidas.correo,
        contrasena: "passwordIncorrecta999"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("mensaje");
    expect(res.body.mensaje).toContain("Usuario o contraseña incorrecta");
  });

  // Pruebas adicionales recomendadas
  test("PR04 - Login sin correo", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        contrasena: credencialesValidas.contrasena
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("mensaje", "Faltan datos en la solicitud");
  });

  test("PR05 - Login sin contraseña", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        correo: credencialesValidas.correo
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("mensaje", "Faltan datos en la solicitud");
  });

  test("PR06 - Login con body vacío", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
  });
});