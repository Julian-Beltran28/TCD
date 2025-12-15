const request = require("supertest");
const app = require("../index");
const db = require("../models/conexion");
const bcrypt = require("bcryptjs");

describe("Perfil - Actualizar", () => {
  test("PR02 - Actualizar perfil sin imagen", async () => {
    const hashed = await bcrypt.hash("abc123", 10);

    const [insert] = await db.query(`
      INSERT INTO Usuarios 
      (Primer_Nombre, Primer_Apellido, Tipo_documento, Numero_documento,
       Numero_celular, Correo_personal, Correo_empresarial, Contrasena, id_Rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      "Laura",
      "Ríos",
      "CC",
      "554433",
      "3105000000",
      "laura@example.com",
      "laura@empresa.com",
      hashed,
      1
    ]);

    const id = insert.insertId;

    const res = await request(app)
      .put(`/api/perfil/${id}`)
      .field("Primer_Nombre", "Laura Updated")
      .field("Segundo_Nombre", "María")
      .field("Primer_Apellido", "Ríos")
      .field("Segundo_Apellido", "López")
      .field("Tipo_documento", "CC")
      .field("Numero_documento", "554433")
      .field("Numero_celular", "3105000000")
      .field("Correo_personal", "laura_new@example.com")
      .field("Correo_empresarial", "laura_new@empresa.com");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje", "Perfil actualizado correctamente");
  });
});
