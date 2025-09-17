// 🔹 Iconos usando Ionicons en lugar de MaterialIcons
import { Ionicons } from '@expo/vector-icons';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';

// 👉 Mapeo de SF Symbols a Ionicons
const MAPPING = {
  'house.fill': 'home',               // Inicio
  'paperplane.fill': 'send',          // Enviar
  'chevron.left.forwardslash.chevron.right': 'code-slash',
  'chevron.right': 'chevron-forward',

  // 👉 Iconos usados en TabLayout
  'card.fill': 'card-outline',        // Perfil
  'person.fill': 'people',            // Usuarios
  'building.2.fill': 'business',      // Proveedores
  'list': 'list',                     // Categorías
  'power': 'power',                   // Cerrar Sesión
  'cart.fill': 'cart-outline',        // Ventas
} as const;

// 🔹 Tipos para validación
type IconSymbolName = keyof typeof MAPPING;
type IconMappingValue = ComponentProps<typeof Ionicons>['name'];

// 🔹 Componente reutilizable de iconos
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <Ionicons
      color={color}
      size={size}
      name={MAPPING[name] as IconMappingValue}
      style={style}
    />
  );
}
