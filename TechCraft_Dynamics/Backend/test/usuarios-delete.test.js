const request = require('supertest');
const app = require('../index');

describe('Usuarios - eliminarUsuario', () => {

  test('Debe desactivar un usuario existente por ID', async () => {

    // 1️⃣ Crear un usuario de prueba
    const usuarioCreado = await request(app)
      .post('/api/usuarios')
      .send({
        Primer_Nombre: "Eliminar",
        Segundo_Nombre: "Jest",
        Primer_Apellido: "Usuario",
        Segundo_Apellido: "Prueba",
        Tipo_documento: "CC",
        Numero_documento: "987654321",
        Numero_celular: "3007654321",
        Correo_personal: "eliminarusuario@mail.com",
        Correo_empresarial: "eliminarusuario@empresa.com",
        id_Rol: 2,
        Contrasena: "12345678"
      });

    const id = usuarioCreado.body.id;
    expect(id).toBeDefined();

    // 2️⃣ Desactivar el usuario
    const resDelete = await request(app).delete(`/api/usuarios/delete/${id}`);

    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body).toHaveProperty("message");
    expect(resDelete.body.message).toContain("eliminado");

    // 3️⃣ Verificar que no aparezca en la lista de usuarios activos
    const resList = await request(app).get('/api/usuarios');
    const usuarioActivo = resList.body.find(u => u.id === id);
    expect(usuarioActivo).toBeUndefined();
  });

});
