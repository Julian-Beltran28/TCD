const request = require("supertest");
const app = require("../index");

describe("Módulo Perfil - pruebas completas", () => {

  const userId = 1; // Cambiar al ID real de prueba
  let originalData;

  test("P01 - Obtener perfil por ID", async () => {
    const res = await request(app).get(`/api/perfil/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("nombres");
    expect(res.body).toHaveProperty("apellidos");

    originalData = res.body;
  });

  test("P02 - Actualizar perfil sin imagen", async () => {
    const res = await request(app)
      .put(`/api/perfil/${userId}`)
      .send({ nombres: "Nombre Editado", apellidos: "Apellido Editado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("actualizado");

    const resGet = await request(app).get(`/api/perfil/${userId}`);
    expect(resGet.body.nombres).toBe("Nombre Editado");
    expect(resGet.body.apellidos).toBe("Apellido Editado");
  });

  test("P03 - Actualizar perfil con imagen", async () => {
    const res = await request(app)
      .put(`/api/perfil/${userId}`)
      .attach("imagen", "Backend/uploads/1756591281064-cereza.png"); 

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toContain("actualizado");
  });

});
