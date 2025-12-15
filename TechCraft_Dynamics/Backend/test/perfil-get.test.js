const request = require("supertest");
const app = require("../index");
const db = require("../models/conexion");
const bcrypt = require("bcryptjs");

describe("Perfil - Obtener", () => {
  test("PR01 - Obtener perfil por ID", async () => {
    // Crear usuario manualmente en la BD
    const hashed = await bcrypt.hash("123456", 10);
    const [insert] = await db.query(`
      INSERT INTO Usuarios 
      (Primer_Nombre, Primer_Apellido, Tipo_documento, Numero_documento, Numero_celular,
       Correo_personal, Correo_empresarial, Contrasena, id_Rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      "Carlos",
      "Gómez",
      "CC",
      "112233",
      "3209000000",
      "carlos@example.com",
      "carlos@empresa.com",
      hashed,
      1
    ]);

    const id = insert.insertId;

    const res = await request(app).get(`/api/perfil/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(id);
    expect(res.body).toHaveProperty("Primer_Nombre");
  });

  test("PR01 - Retorna 404 si el usuario no existe", async () => {
    const res = await request(app).get("/api/perfil/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Usuario no encontrado");
  });
});
