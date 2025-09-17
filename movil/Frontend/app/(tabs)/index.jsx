import { Redirect } from 'expo-router';
import React from 'react';

function TabsIndex() {
  // Redirige a la primera pantalla principal (Usuarios)
  return <Redirect href="(tabs)/Pages/Usuarios/listarUsuarios" />;
}

export default TabsIndex;