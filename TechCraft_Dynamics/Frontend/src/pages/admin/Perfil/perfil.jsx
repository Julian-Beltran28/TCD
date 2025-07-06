import React from 'react';
import PerfilUsuario from '../../PerfilUsuario'; // Ajusta el path si lo tienes en otra carpeta
import { useAuth } from '../../../context/AuthContext';

export default function Perfil() {
  const { user } = useAuth();

  if (!user) return <div className="p-4">Cargando usuario...</div>;

  return (
    <div className="card p-3 shadow-sm">
      <PerfilUsuario userId={user.id} />
    </div>
  );
}
