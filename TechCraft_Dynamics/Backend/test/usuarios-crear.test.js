const request = require('supertest');
const app = require('../index');

describe('Usuarios - crearUsuario', () => {

  test('Debe crear un usuario correctamente', async () => {
    const nuevoUsuario = {
      Primer_Nombre: "Test",
      Segundo_Nombre: "Jest",
      Primer_Apellido: "Usuario",
      Segundo_Apellido: "Prueba",
      Tipo_documento: "CC",
      Numero_documento: "123456789",
      Numero_celular: "3001234567",
      Correo_personal: "testusuario@mail.com",
      Correo_empresarial: "testusuario@empresa.com",
      id_Rol: 2,
      Contrasena: "12345678"
    };

    const res = await request(app)
      .post('/api/usuarios')
      .send(nuevoUsuario);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Usuario creado');
  });

});
