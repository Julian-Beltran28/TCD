// src/middlewares/verificarToken.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'tu_clave_secreta_super_segura';

export function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });

    req.usuario = decoded;
    next();
  });
}
