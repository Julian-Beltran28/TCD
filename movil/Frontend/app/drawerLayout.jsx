import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import TabLayout from "./(tabs)/_layout"; // 👈 tus tabs existentes
import Perfil from "./(tabs)/Pages/Perfil/perfil";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerShown: true,
          drawerType: "front",
          drawerStyle: { width: 240 },
        }}
      >
        {/* ✅ Cargamos los tabs dentro del drawer */}
        <Drawer.Screen name="Inicio" component={TabLayout} />
        <Drawer.Screen name="Perfil" component={Perfil} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
